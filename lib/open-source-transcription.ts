import { Transcript, TranscriptSegment } from '@/types';

// Declare SpeechRecognition types for browser compatibility
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface TranscriptionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
}

export class OpenSourceTranscriptionService {
  private recognition: any = null;
  private isSupported: boolean;
  private isRecording: boolean = false;
  private transcriptSegments: TranscriptSegment[] = [];
  private onResultCallback?: (result: TranscriptionResult) => void;
  private onEndCallback?: () => void;
  private onErrorCallback?: (error: string) => void;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  /**
   * Check if Web Speech API is supported
   */
  private checkSupport(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  /**
   * Initialize the speech recognition
   */
  private initializeRecognition(options: TranscriptionOptions = {}): any {
    if (!this.isSupported) {
      console.warn('Web Speech API not supported. Falling back to manual input.');
      return null;
    }

    // Use the appropriate SpeechRecognition constructor
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition options
    recognition.lang = options.language || 'en-US';
    recognition.continuous = options.continuous !== false;
    recognition.interimResults = options.interimResults !== false;
    recognition.maxAlternatives = options.maxAlternatives || 1;

    // Set up event handlers
    recognition.onresult = this.handleResult.bind(this);
    recognition.onend = this.handleEnd.bind(this);
    recognition.onerror = this.handleError.bind(this);

    return recognition;
  }

  /**
   * Start real-time transcription
   */
  async startTranscription(options: TranscriptionOptions = {}): Promise<boolean> {
    if (this.isRecording) {
      console.warn('Transcription already in progress');
      return false;
    }

    this.recognition = this.initializeRecognition(options);
    
    if (!this.recognition) {
      return false;
    }

    try {
      this.recognition.start();
      this.isRecording = true;
      this.transcriptSegments = [];
      console.log('Transcription started');
      return true;
    } catch (error) {
      console.error('Failed to start transcription:', error);
      return false;
    }
  }

  /**
   * Stop transcription
   */
  stopTranscription(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      console.log('Transcription stopped');
    }
  }

  /**
   * Handle transcription results
   */
  private handleResult(event: any): void {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    const confidence = result[0].confidence;
    const isFinal = result.isFinal;

    const transcriptionResult: TranscriptionResult = {
      transcript,
      confidence,
      isFinal,
      timestamp: new Date()
    };

    // Add to segments if final
    if (isFinal) {
      this.transcriptSegments.push({
        id: `segment_${Date.now()}_${Math.random()}`,
        text: transcript,
        speaker: 'Unknown', // Could be enhanced with speaker identification
        startTime: Date.now() / 1000, // Convert to seconds
        endTime: Date.now() / 1000, // Convert to seconds
        confidence
      });
    }

    // Call callback if provided
    if (this.onResultCallback) {
      this.onResultCallback(transcriptionResult);
    }
  }

  /**
   * Handle transcription end
   */
  private handleEnd(): void {
    this.isRecording = false;
    console.log('Transcription ended');
    
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }

  /**
   * Handle transcription errors
   */
  private handleError(event: any): void {
    this.isRecording = false;
    const errorMessage = `Transcription error: ${event.error}`;
    console.error(errorMessage);
    
    if (this.onErrorCallback) {
      this.onErrorCallback(errorMessage);
    }
  }

  /**
   * Get current transcript
   */
  getCurrentTranscript(): Transcript {
    return {
      id: `transcript_${Date.now()}`,
      meetingId: 'current',
      segments: this.transcriptSegments,
      confidence: this.transcriptSegments.length > 0 
        ? this.transcriptSegments.reduce((sum, seg) => sum + seg.confidence, 0) / this.transcriptSegments.length
        : 0,
      language: 'en',
      createdAt: new Date()
    };
  }

  /**
   * Set result callback
   */
  onResult(callback: (result: TranscriptionResult) => void): void {
    this.onResultCallback = callback;
  }

  /**
   * Set end callback
   */
  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  /**
   * Set error callback
   */
  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Check if currently recording
   */
  isTranscribing(): boolean {
    return this.isRecording;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'es-ES', 'es-MX', 'fr-FR', 'fr-CA',
      'de-DE', 'it-IT', 'pt-BR', 'pt-PT',
      'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW',
      'ru-RU', 'ar-SA', 'hi-IN', 'nl-NL'
    ];
  }

  /**
   * Get language name from code
   */
  getLanguageName(code: string): string {
    const languageNames: Record<string, string> = {
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'en-AU': 'English (Australia)',
      'en-CA': 'English (Canada)',
      'es-ES': 'Spanish (Spain)',
      'es-MX': 'Spanish (Mexico)',
      'fr-FR': 'French (France)',
      'fr-CA': 'French (Canada)',
      'de-DE': 'German',
      'it-IT': 'Italian',
      'pt-BR': 'Portuguese (Brazil)',
      'pt-PT': 'Portuguese (Portugal)',
      'ja-JP': 'Japanese',
      'ko-KR': 'Korean',
      'zh-CN': 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      'ru-RU': 'Russian',
      'ar-SA': 'Arabic',
      'hi-IN': 'Hindi',
      'nl-NL': 'Dutch'
    };
    
    return languageNames[code] || code;
  }
}

/**
 * Alternative transcription service using audio file upload and processing
 * This can be used when real-time transcription is not available
 */
export class AudioFileTranscriptionService {
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  /**
   * Stop recording and get audio blob
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          resolve(audioBlob);
        };
        
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    });
  }

  /**
   * Convert audio blob to base64 for processing
   */
  async audioBlobToBase64(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  }

  /**
   * Process audio file (placeholder for future implementation)
   */
  async processAudioFile(audioFile: File): Promise<string> {
    // This is a placeholder for future audio processing
    // Could integrate with open-source speech recognition libraries
    console.log('Processing audio file:', audioFile.name);
    
    // For now, return a placeholder transcript
    return `[Audio file "${audioFile.name}" processed. This is a placeholder transcript. In a real implementation, this would use open-source speech recognition.]`;
  }
}

/**
 * Utility functions for transcription
 */
export const transcriptionUtils = {
  /**
   * Clean and format transcript text
   */
  cleanTranscript(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Remove extra whitespace
      .replace(/^\s+|\s+$/g, '') // Trim
      .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Fix spacing after punctuation
      .replace(/\s+([,.!?])/g, '$1'); // Remove spaces before punctuation
  },

  /**
   * Calculate average confidence from segments
   */
  calculateAverageConfidence(segments: TranscriptSegment[]): number {
    if (segments.length === 0) return 0;
    return segments.reduce((sum, seg) => sum + seg.confidence, 0) / segments.length;
  },

  /**
   * Split transcript into sentences
   */
  splitIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .filter(sentence => sentence.trim().length > 0);
  },

  /**
   * Extract key phrases from transcript
   */
  extractKeyPhrases(text: string, maxPhrases: number = 5): string[] {
    const sentences = this.splitIntoSentences(text);
    const phrases: string[] = [];
    
    for (const sentence of sentences) {
      const words = sentence.split(' ').filter(word => word.length > 3);
      if (words.length >= 3) {
        phrases.push(words.slice(0, 5).join(' '));
      }
    }
    
    return phrases.slice(0, maxPhrases);
  }
};

// Export default instance
export const transcriptionService = new OpenSourceTranscriptionService();
export const audioTranscriptionService = new AudioFileTranscriptionService();
