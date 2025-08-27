import { Summary, Transcript } from '@/types';

export interface SummaryOptions {
  maxLength?: number;
  includeKeyPoints?: boolean;
  includeTopics?: boolean;
  includeSentiment?: boolean;
  language?: string;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  topics: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  wordCount: number;
  processingTime: number;
}

export class OpenSourceSummaryService {
  private stopWords!: Set<string>;
  private positiveWords!: Set<string>;
  private negativeWords!: Set<string>;

  constructor() {
    this.initializeWordLists();
  }

  /**
   * Initialize word lists for analysis
   */
  private initializeWordLists(): void {
    // Common stop words in English
    this.stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
      'this', 'that', 'these', 'those', 'here', 'there', 'where', 'when', 'why', 'how',
      'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
      'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
    ]);

    // Positive sentiment words
    this.positiveWords = new Set([
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'brilliant', 'outstanding',
      'perfect', 'superb', 'terrific', 'awesome', 'incredible', 'marvelous', 'splendid',
      'success', 'achieve', 'win', 'improve', 'progress', 'growth', 'opportunity', 'solution',
      'innovative', 'creative', 'efficient', 'effective', 'productive', 'collaborative', 'supportive'
    ]);

    // Negative sentiment words
    this.negativeWords = new Set([
      'bad', 'terrible', 'awful', 'horrible', 'dreadful', 'awful', 'poor', 'worst',
      'problem', 'issue', 'challenge', 'difficulty', 'obstacle', 'barrier', 'failure',
      'delay', 'late', 'slow', 'inefficient', 'ineffective', 'unproductive', 'conflict',
      'disagreement', 'argument', 'complaint', 'criticism', 'blame', 'fault', 'error'
    ]);
  }

  /**
   * Generate summary from transcript
   */
  async generateSummary(transcript: Transcript, options: SummaryOptions = {}): Promise<SummaryResult> {
    const startTime = Date.now();
    
    const {
      maxLength = 200,
      includeKeyPoints = true,
      includeTopics = true,
      includeSentiment = true
    } = options;

    // Extract text from transcript
    const fullText = transcript.segments.map(s => s.text).join(' ');
    
    // Generate summary
    const summary = this.extractSummary(fullText, maxLength);
    
    // Extract key points
    const keyPoints = includeKeyPoints ? this.extractKeyPoints(fullText) : [];
    
    // Extract topics
    const topics = includeTopics ? this.extractTopics(fullText) : [];
    
    // Analyze sentiment
    const sentiment = includeSentiment ? this.analyzeSentiment(fullText) : 'neutral';
    
    // Calculate confidence based on text quality
    const confidence = this.calculateConfidence(fullText);
    
    const processingTime = Date.now() - startTime;

    return {
      summary,
      keyPoints,
      topics,
      sentiment,
      confidence,
      wordCount: summary.split(' ').length,
      processingTime
    };
  }

  /**
   * Extract summary from text using extractive summarization
   */
  private extractSummary(text: string, maxLength: number): string {
    // Split into sentences
    const sentences = this.splitIntoSentences(text);
    
    if (sentences.length === 0) return '';
    
    // Score sentences based on word frequency and position
    const sentenceScores = sentences.map((sentence, index) => {
      const words = this.tokenize(sentence);
      const wordFrequency = this.calculateWordFrequency(text, words);
      const positionScore = 1 / (index + 1); // Earlier sentences get higher scores
      const lengthScore = Math.min(words.length / 20, 1); // Optimal sentence length
      
      // Calculate average word frequency for this sentence
      const avgWordFrequency = words.reduce((sum, word) => {
        return sum + (wordFrequency[word.toLowerCase()] || 0);
      }, 0) / words.length;
      
      return {
        sentence,
        score: avgWordFrequency * 0.6 + positionScore * 0.3 + lengthScore * 0.1
      };
    });

    // Sort by score and select top sentences
    sentenceScores.sort((a, b) => b.score - a.score);
    
    let summary = '';
    let currentLength = 0;
    
    for (const { sentence } of sentenceScores) {
      if (currentLength + sentence.length <= maxLength) {
        summary += (summary ? ' ' : '') + sentence;
        currentLength += sentence.length;
      } else {
        break;
      }
    }

    return summary || sentences[0];
  }

  /**
   * Extract key points from text
   */
  private extractKeyPoints(text: string, maxPoints: number = 5): string[] {
    const sentences = this.splitIntoSentences(text);
    const keyPoints: string[] = [];
    
    // Look for sentences with action words or important indicators
    const actionIndicators = [
      'need to', 'should', 'must', 'will', 'going to', 'plan to',
      'decided', 'agreed', 'approved', 'resolved', 'determined',
      'important', 'critical', 'essential', 'key', 'major', 'significant'
    ];
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check if sentence contains action indicators
      const hasActionIndicator = actionIndicators.some(indicator => 
        lowerSentence.includes(indicator)
      );
      
      // Check if sentence contains numbers or dates
      const hasNumbers = /\d+/.test(sentence);
      
      // Check if sentence is a question
      const isQuestion = sentence.includes('?');
      
      if ((hasActionIndicator || hasNumbers) && !isQuestion && keyPoints.length < maxPoints) {
        keyPoints.push(sentence.trim());
      }
    }
    
    // If not enough key points found, add important sentences
    if (keyPoints.length < maxPoints) {
      const remainingSentences = sentences.filter(s => !keyPoints.includes(s));
      const additionalPoints = remainingSentences.slice(0, maxPoints - keyPoints.length);
      keyPoints.push(...additionalPoints);
    }
    
    return keyPoints.slice(0, maxPoints);
  }

  /**
   * Extract topics from text
   */
  private extractTopics(text: string, maxTopics: number = 5): string[] {
    const words = this.tokenize(text);
    const wordFrequency = this.calculateWordFrequency(text, words);
    
    // Filter out stop words and short words
    const candidateWords = words.filter(word => 
      word.length > 3 && 
      !this.stopWords.has(word.toLowerCase()) &&
      !/^\d+$/.test(word) // Not just numbers
    );
    
    // Sort by frequency and select top topics
    const sortedWords = candidateWords.sort((a, b) => 
      wordFrequency[b.toLowerCase()] - wordFrequency[a.toLowerCase()]
    );
    
    // Remove duplicates and limit results
    const uniqueTopics = Array.from(new Set(sortedWords));
    return uniqueTopics.slice(0, maxTopics);
  }

  /**
   * Analyze sentiment of text
   */
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const words = this.tokenize(text);
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const word of words) {
      const lowerWord = word.toLowerCase();
      if (this.positiveWords.has(lowerWord)) {
        positiveCount++;
      } else if (this.negativeWords.has(lowerWord)) {
        negativeCount++;
      }
    }
    
    // Calculate sentiment score
    const totalWords = words.length;
    const positiveRatio = positiveCount / totalWords;
    const negativeRatio = negativeCount / totalWords;
    
    // Determine sentiment based on ratios
    if (positiveRatio > 0.05 && positiveRatio > negativeRatio * 1.5) {
      return 'positive';
    } else if (negativeRatio > 0.05 && negativeRatio > positiveRatio * 1.5) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  /**
   * Calculate confidence score for the summary
   */
  private calculateConfidence(text: string): number {
    const words = this.tokenize(text);
    const sentences = this.splitIntoSentences(text);
    
    if (words.length === 0 || sentences.length === 0) return 0;
    
    let confidence = 0.5; // Base confidence
    
    // Text length factor (longer texts are more reliable)
    const lengthFactor = Math.min(words.length / 100, 1);
    confidence += lengthFactor * 0.2;
    
    // Sentence structure factor
    const avgSentenceLength = words.length / sentences.length;
    const structureFactor = avgSentenceLength >= 5 && avgSentenceLength <= 25 ? 1 : 0.5;
    confidence += structureFactor * 0.2;
    
    // Word variety factor
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const varietyFactor = uniqueWords.size / words.length;
    confidence += varietyFactor * 0.1;
    
    return Math.min(confidence, 1);
  }

  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Calculate word frequency in text
   */
  private calculateWordFrequency(text: string, words: string[]): Record<string, number> {
    const frequency: Record<string, number> = {};
    
    for (const word of words) {
      const lowerWord = word.toLowerCase();
      frequency[lowerWord] = (frequency[lowerWord] || 0) + 1;
    }
    
    return frequency;
  }

  /**
   * Generate meeting summary with specific focus
   */
  async generateMeetingSummary(transcript: Transcript, meetingType: string): Promise<SummaryResult> {
    const baseOptions: SummaryOptions = {
      maxLength: 300,
      includeKeyPoints: true,
      includeTopics: true,
      includeSentiment: true
    };

    // Customize based on meeting type
    switch (meetingType.toLowerCase()) {
      case 'standup':
        baseOptions.maxLength = 150;
        break;
      case 'planning':
        baseOptions.maxLength = 400;
        break;
      case 'review':
        baseOptions.maxLength = 350;
        break;
      case 'brainstorming':
        baseOptions.maxLength = 250;
        break;
      default:
        break;
    }

    return this.generateSummary(transcript, baseOptions);
  }

  /**
   * Generate executive summary (shorter, more focused)
   */
  async generateExecutiveSummary(transcript: Transcript): Promise<SummaryResult> {
    const options: SummaryOptions = {
      maxLength: 150,
      includeKeyPoints: true,
      includeTopics: true,
      includeSentiment: true
    };

    const result = await this.generateSummary(transcript, options);
    
    // Focus on decisions and action items for executive summary
    const executiveKeyPoints = result.keyPoints.filter(point => 
      point.toLowerCase().includes('decided') ||
      point.toLowerCase().includes('agreed') ||
      point.toLowerCase().includes('approved') ||
      point.toLowerCase().includes('budget') ||
      point.toLowerCase().includes('timeline')
    );

    return {
      ...result,
      keyPoints: executiveKeyPoints.length > 0 ? executiveKeyPoints : result.keyPoints.slice(0, 3),
      summary: result.summary.substring(0, 150) + (result.summary.length > 150 ? '...' : '')
    };
  }

  /**
   * Generate technical summary (more detailed, technical focus)
   */
  async generateTechnicalSummary(transcript: Transcript): Promise<SummaryResult> {
    const options: SummaryOptions = {
      maxLength: 500,
      includeKeyPoints: true,
      includeTopics: true,
      includeSentiment: true
    };

    const result = await this.generateSummary(transcript, options);
    
    // Focus on technical details
    const technicalKeyPoints = result.keyPoints.filter(point => 
      point.toLowerCase().includes('implementation') ||
      point.toLowerCase().includes('architecture') ||
      point.toLowerCase().includes('technology') ||
      point.toLowerCase().includes('code') ||
      point.toLowerCase().includes('system') ||
      point.toLowerCase().includes('api') ||
      point.toLowerCase().includes('database')
    );

    return {
      ...result,
      keyPoints: technicalKeyPoints.length > 0 ? technicalKeyPoints : result.keyPoints,
      summary: result.summary
    };
  }
}

/**
 * Utility functions for summary generation
 */
export const summaryUtils = {
  /**
   * Clean and format summary text
   */
  cleanSummary(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '')
      .replace(/([.!?])\s*([a-z])/g, '$1 $2')
      .replace(/\s+([,.!?])/g, '$1');
  },

  /**
   * Truncate text to specified length
   */
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  },

  /**
   * Count words in text
   */
  countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  /**
   * Estimate reading time
   */
  estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
    const words = this.countWords(text);
    return Math.ceil(words / wordsPerMinute);
  }
};

// Export singleton instance (lazy initialization to avoid SSR issues)
let _summaryService: OpenSourceSummaryService | null = null;

export const summaryService = {
  get instance() {
    if (typeof window === 'undefined') {
      throw new Error('SummaryService can only be used in browser environment');
    }
    if (!_summaryService) {
      _summaryService = new OpenSourceSummaryService();
    }
    return _summaryService;
  }
};
