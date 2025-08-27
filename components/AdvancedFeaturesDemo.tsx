"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  Calendar,
  Target,
  BarChart3,
  Zap,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Play,
  Pause,
  Mic,
  FileText,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AITaskAllocationEngine } from '@/lib/ai-task-allocation';
import { CrossMeetingIntelligenceEngine } from '@/lib/cross-meeting-intelligence';
import { PredictiveAnalyticsEngine } from '@/lib/predictive-analytics';
import { transcriptionService } from '@/lib/open-source-transcription';
import { summaryService } from '@/lib/open-source-summary';

interface DemoData {
  isTranscribing: boolean;
  currentTranscript: string;
  insights: any[];
  predictions: any[];
  taskAllocations: any[];
}

const AdvancedFeaturesDemo: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<'transcription' | 'intelligence' | 'analytics'>('transcription');
  const [demoData, setDemoData] = useState<DemoData>({
    isTranscribing: false,
    currentTranscript: '',
    insights: [],
    predictions: [],
    taskAllocations: []
  });

  const [transcriptText, setTranscriptText] = useState('');
  const [summaryResult, setSummaryResult] = useState<any>(null);

  // Demo data for different features
  const demoFeatures = {
    transcription: {
      title: 'Real-Time Transcription',
      description: 'Experience live transcription using Web Speech API',
      icon: Mic,
      color: 'blue'
    },
    intelligence: {
      title: 'Cross-Meeting Intelligence',
      description: 'AI-powered insights across multiple meetings',
      icon: Brain,
      color: 'purple'
    },
    analytics: {
      title: 'Predictive Analytics',
      description: 'Anticipate needs and optimize workflows',
      icon: TrendingUp,
      color: 'green'
    }
  };

  // Start real-time transcription demo
  const startTranscriptionDemo = async () => {
    setDemoData(prev => ({ ...prev, isTranscribing: true }));
    
    // Simulate real-time transcription
    const demoTexts = [
      "Welcome to our quarterly planning meeting.",
      "Today we'll discuss the Q4 roadmap and budget allocation.",
      "I think we should focus on the mobile app development first.",
      "That's a great point, Sarah. What's your timeline estimate?",
      "We need to allocate at least 3 developers to this project.",
      "I agree, and we should also consider the marketing budget.",
      "Let's set a deadline for the end of November.",
      "Perfect, I'll create action items for everyone."
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < demoTexts.length) {
        setDemoData(prev => ({
          ...prev,
          currentTranscript: prev.currentTranscript + ' ' + demoTexts[currentIndex]
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
        setDemoData(prev => ({ ...prev, isTranscribing: false }));
      }
    }, 2000);

    // Set up transcription service callbacks
    transcriptionService.onResult((result) => {
      if (result.isFinal) {
        setDemoData(prev => ({
          ...prev,
          currentTranscript: prev.currentTranscript + ' ' + result.transcript
        }));
      }
    });
  };

  // Generate summary demo
  const generateSummaryDemo = async () => {
    if (!demoData.currentTranscript) return;

    try {
      const mockTranscript = {
        id: 'demo_transcript',
        meetingId: 'demo_meeting',
        segments: [{
          id: 'demo_segment',
          text: demoData.currentTranscript,
          speaker: 'Demo User',
          startTime: new Date(),
          endTime: new Date(),
          confidence: 0.9
        }],
        fullText: demoData.currentTranscript,
        confidence: 0.9,
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const summary = await summaryService.generateSummary(mockTranscript);
      setSummaryResult(summary);
    } catch (error) {
      console.error('Summary generation failed:', error);
    }
  };

  // Generate AI insights demo
  const generateInsightsDemo = async () => {
    const mockInsights = [
      {
        id: 'insight_1',
        type: 'trend',
        title: 'High Meeting Frequency Detected',
        description: 'Your team has had 12 meetings this week, which is above the recommended threshold.',
        confidence: 0.85,
        recommendations: ['Consider consolidating meetings', 'Use async communication for updates']
      },
      {
        id: 'insight_2',
        type: 'opportunity',
        title: 'Effective Meeting Pattern Identified',
        description: 'Your 30-minute standups consistently produce 3+ action items.',
        confidence: 0.78,
        recommendations: ['Document this format', 'Apply to other meeting types']
      },
      {
        id: 'insight_3',
        type: 'risk',
        title: 'Task Completion Risk',
        description: '5 tasks are overdue, indicating potential resource constraints.',
        confidence: 0.92,
        recommendations: ['Review priorities', 'Reallocate resources']
      }
    ];

    setDemoData(prev => ({ ...prev, insights: mockInsights }));
  };

  // Generate predictions demo
  const generatePredictionsDemo = async () => {
    const mockPredictions = [
      {
        id: 'pred_1',
        type: 'resource',
        title: 'Resource Demand Spike Predicted',
        description: 'Based on current workload, you\'ll need 2 additional developers by week 3.',
        confidence: 0.87,
        probability: 0.82,
        impact: 'high',
        timeframe: 'short_term'
      },
      {
        id: 'pred_2',
        type: 'timeline',
        title: 'Project Delay Risk',
        description: 'Current velocity suggests 15% delay risk for Q4 launch.',
        confidence: 0.76,
        probability: 0.68,
        impact: 'medium',
        timeframe: 'medium_term'
      }
    ];

    setDemoData(prev => ({ ...prev, predictions: mockPredictions }));
  };

  // Generate task allocations demo
  const generateTaskAllocationsDemo = async () => {
    const mockAllocations = [
      {
        id: 'task_1',
        description: 'Review mobile app wireframes',
        assignee: 'Sarah Chen',
        reason: 'UI/UX expertise, current workload: 4/10',
        confidence: 0.89
      },
      {
        id: 'task_2',
        description: 'Prepare budget proposal',
        assignee: 'Mike Johnson',
        reason: 'Finance background, available capacity',
        confidence: 0.92
      },
      {
        id: 'task_3',
        description: 'Coordinate with marketing team',
        assignee: 'Lisa Wang',
        reason: 'Cross-functional experience, stakeholder relationships',
        confidence: 0.85
      }
    ];

    setDemoData(prev => ({ ...prev, taskAllocations: mockAllocations }));
  };

  useEffect(() => {
    // Auto-generate demo data when switching features
    if (activeFeature === 'intelligence') {
      generateInsightsDemo();
    } else if (activeFeature === 'analytics') {
      generatePredictionsDemo();
      generateTaskAllocationsDemo();
    }
  }, [activeFeature]);

  const getFeatureColor = (feature: string) => {
    const colors = {
      transcription: 'from-blue-500 to-blue-600',
      intelligence: 'from-purple-500 to-purple-600',
      analytics: 'from-green-500 to-green-600'
    };
    return colors[feature as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Advanced AI Features Demo</h1>
          </motion.div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experience the next generation of meeting intelligence with AI-powered task allocation, 
            cross-meeting insights, and predictive analytics.
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-lg">
            {Object.entries(demoFeatures).map(([key, feature]) => {
              const Icon = feature.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFeature(key as any)}
                  className={cn(
                    'flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300',
                    activeFeature === key
                      ? `bg-gradient-to-r ${getFeatureColor(key)} text-white shadow-lg`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {feature.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Transcription Demo */}
            {activeFeature === 'transcription' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Mic className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Real-Time Transcription</h2>
                    <p className="text-slate-600">Experience live transcription using Web Speech API</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Controls */}
                  <div className="flex gap-4">
                    <button
                      onClick={startTranscriptionDemo}
                      disabled={demoData.isTranscribing}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {demoData.isTranscribing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {demoData.isTranscribing ? 'Pause' : 'Start'} Demo
                    </button>
                    
                    <button
                      onClick={generateSummaryDemo}
                      disabled={!demoData.currentTranscript}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Generate Summary
                    </button>
                  </div>

                  {/* Live Transcript */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Live Transcript</h3>
                    <div className="bg-white rounded-lg p-4 min-h-[200px] border border-slate-200">
                      {demoData.currentTranscript ? (
                        <p className="text-slate-800 leading-relaxed">{demoData.currentTranscript}</p>
                      ) : (
                        <p className="text-slate-400 italic">Click "Start Demo" to begin transcription...</p>
                      )}
                    </div>
                  </div>

                  {/* AI Summary */}
                  {summaryResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">AI-Generated Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-slate-800 mb-2">Summary</h4>
                          <p className="text-slate-700">{summaryResult.summary}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800 mb-2">Key Points</h4>
                          <ul className="space-y-1">
                            {summaryResult.keyPoints.map((point: string, index: number) => (
                              <li key={index} className="flex items-center gap-2 text-slate-700">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-4">
                          <span className="px-3 py-1 bg-white rounded-full text-sm font-medium border border-green-200">
                            Sentiment: {summaryResult.sentiment}
                          </span>
                          <span className="px-3 py-1 bg-white rounded-full text-sm font-medium border border-green-200">
                            Confidence: {Math.round(summaryResult.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Intelligence Demo */}
            {activeFeature === 'intelligence' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Cross-Meeting Intelligence</h2>
                    <p className="text-slate-600">AI-powered insights across multiple meetings and team patterns</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {demoData.insights.map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'p-6 rounded-xl border-2 transition-all hover:shadow-md',
                        insight.type === 'trend' && 'border-blue-200 bg-blue-50',
                        insight.type === 'opportunity' && 'border-yellow-200 bg-yellow-50',
                        insight.type === 'risk' && 'border-red-200 bg-red-50'
                      )}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                        {insight.type === 'opportunity' && <Lightbulb className="w-5 h-5 text-yellow-500" />}
                        {insight.type === 'risk' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-2">{insight.title}</h3>
                          <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                        <span className="capitalize">{insight.type}</span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-700">Recommendations:</p>
                        {insight.recommendations.map((rec: string, recIndex: number) => (
                          <p key={recIndex} className="text-xs text-slate-600">• {rec}</p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Demo */}
            {activeFeature === 'analytics' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Predictive Analytics</h2>
                    <p className="text-slate-600">Anticipate needs and optimize team workflows proactively</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Predictions */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">AI Predictions</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {demoData.predictions.map((prediction, index) => (
                        <motion.div
                          key={prediction.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-50 rounded-xl p-6 border border-slate-200"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            {prediction.type === 'resource' && <Users className="w-5 h-5 text-purple-500" />}
                            {prediction.type === 'timeline' && <Clock className="w-5 h-5 text-blue-500" />}
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-2">{prediction.title}</h4>
                              <p className="text-sm text-slate-600 mb-3">{prediction.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-xs text-slate-500">Confidence</span>
                              <p className="text-sm font-medium text-slate-900">{Math.round(prediction.confidence * 100)}%</p>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500">Probability</span>
                              <p className="text-sm font-medium text-slate-900">{Math.round(prediction.probability * 100)}%</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <span className={cn(
                              'px-2 py-1 text-xs font-medium rounded-full',
                              prediction.impact === 'high' && 'text-red-600 bg-red-100',
                              prediction.impact === 'medium' && 'text-yellow-600 bg-yellow-100',
                              prediction.impact === 'low' && 'text-green-600 bg-green-100'
                            )}>
                              {prediction.impact} Impact
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Task Allocations */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">AI Task Allocation</h3>
                    <div className="space-y-4">
                      {demoData.taskAllocations.map((allocation, index) => (
                        <motion.div
                          key={allocation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-slate-900">{allocation.description}</h4>
                            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium border border-blue-200">
                              {Math.round(allocation.confidence * 100)}% Match
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 mb-3">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-slate-800">{allocation.assignee}</span>
                          </div>
                          
                          <p className="text-sm text-slate-600">{allocation.reason}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Meetings?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              This is just a preview of EchoPilot's advanced AI capabilities. 
              Experience the full power of team intelligence in your organization.
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Get Started with EchoPilot
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdvancedFeaturesDemo;
