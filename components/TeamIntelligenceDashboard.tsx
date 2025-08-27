"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CrossMeetingInsight, Prediction, ResourceForecast, WorkloadPrediction } from '@/types';

interface TeamIntelligenceData {
  insights: CrossMeetingInsight[];
  predictions: Prediction[];
  resourceForecasts: ResourceForecast[];
  workloadPredictions: WorkloadPrediction[];
  teamStats: {
    totalMeetings: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    teamProductivity: number;
    meetingEffectiveness: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TeamIntelligenceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'predictions' | 'analytics'>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [data, setData] = useState<TeamIntelligenceData>({
    insights: [],
    predictions: [],
    resourceForecasts: [],
    workloadPredictions: [],
    teamStats: {
      totalMeetings: 0,
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      teamProductivity: 0,
      meetingEffectiveness: 0,
    },
  });

  useEffect(() => {
    // Load mock data for demonstration
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockData: TeamIntelligenceData = {
      insights: [
        {
          id: '1',
          type: 'pattern',
          title: 'High Meeting Frequency Detected',
          description: 'December had 15 meetings, which is above the recommended threshold. Consider consolidating or optimizing meeting schedules.',
          confidence: 0.8,
          relatedMeetings: ['meeting_1', 'meeting_2'],
          participants: ['user_1', 'user_2'],
          tags: ['pattern', 'meeting-frequency', 'optimization'],
          createdAt: new Date(),
          lastUpdated: new Date(),
          status: 'active'
        },
        {
          id: '2',
          type: 'risk',
          title: 'Multiple Overdue Tasks',
          description: 'There are 7 overdue tasks, which may indicate resource constraints or unrealistic deadlines.',
          confidence: 0.8,
          relatedMeetings: ['meeting_3', 'meeting_4'],
          participants: ['user_3', 'user_4'],
          tags: ['risk', 'overdue', 'resource-constraint'],
          createdAt: new Date(),
          lastUpdated: new Date(),
          status: 'active'
        },
        {
          id: '3',
          type: 'opportunity',
          title: 'Effective Meeting Pattern Identified',
          description: 'The pattern "Weekly Standup" has 85% effectiveness. Consider applying this approach to other meetings.',
          confidence: 0.7,
          relatedMeetings: ['meeting_5'],
          participants: ['user_1', 'user_2', 'user_3'],
          tags: ['opportunity', 'best-practice', 'optimization'],
          createdAt: new Date(),
          lastUpdated: new Date(),
          status: 'active'
        }
      ],
      predictions: [
        {
          id: '1',
          type: 'resource',
          title: 'High Resource Demand Predicted',
          description: '12 tasks are due in the next 30 days, indicating potential resource constraints.',
          confidence: 0.8,
          probability: 0.7,
          impact: 'high',
          timeframe: 'short_term',
          affectedUsers: ['user_1', 'user_2'],
          affectedDepartments: ['Engineering', 'Product'],
          recommendations: [
            'Consider redistributing workload',
            'Prioritize tasks by business impact',
            'Evaluate need for additional resources'
          ],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'risk',
          title: 'Task Completion Risk Detected',
          description: '5 tasks are overdue, indicating potential project delays and resource allocation issues.',
          confidence: 0.9,
          probability: 0.8,
          impact: 'high',
          timeframe: 'immediate',
          affectedUsers: ['user_3', 'user_4'],
          affectedDepartments: ['Sales', 'Marketing'],
          recommendations: [
            'Review and reprioritize overdue tasks',
            'Assess resource availability',
            'Communicate delays to stakeholders'
          ],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      ],
      resourceForecasts: [
        {
          id: '1',
          resourceType: 'personnel',
          currentCapacity: 8,
          predictedDemand: 12,
          capacityGap: 4,
          timeframe: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          confidence: 0.7,
          recommendations: [
            'Consider temporary contractors',
            'Redistribute workload across team',
            'Extend non-critical deadlines'
          ]
        }
      ],
      workloadPredictions: [
        {
          userId: 'user_1',
          currentWorkload: 6,
          predictedWorkload: 8,
          workloadTrend: 'increasing',
          burnoutRisk: 'medium',
          recommendations: [
            'Monitor workload closely',
            'Consider extending non-urgent deadlines'
          ],
          timeframe: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ],
      teamStats: {
        totalMeetings: 45,
        totalTasks: 127,
        completedTasks: 89,
        overdueTasks: 7,
        teamProductivity: 87,
        meetingEffectiveness: 73,
      },
    };

    setData(mockData);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'opportunity':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'decision':
        return <Target className="w-5 h-5 text-green-500" />;
      default:
        return <Eye className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend':
        return 'border-blue-200 bg-blue-50';
      case 'risk':
        return 'border-red-200 bg-red-50';
      case 'opportunity':
        return 'border-yellow-200 bg-yellow-50';
      case 'decision':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'resource':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'timeline':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'risk':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'opportunity':
        return <Zap className="w-5 h-5 text-green-500" />;
      case 'workload':
        return <BarChart3 className="w-5 h-5 text-orange-500" />;
      default:
        return <Eye className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getWorkloadTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'decreasing':
        return <ArrowDownRight className="w-4 h-4 text-green-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Team Intelligence Dashboard</h1>
              <p className="text-slate-600">AI-powered insights and predictions for your team</p>
            </div>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Timeframe:</span>
            {(['7d', '30d', '90d'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-lg transition-colors',
                  selectedTimeframe === timeframe
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                )}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm">
            {([
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'insights', label: 'AI Insights', icon: Brain },
              { id: 'predictions', label: 'Predictions', icon: TrendingUp },
              { id: 'analytics', label: 'Analytics', icon: Target },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'overview' && (
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Meetings', value: data.teamStats.totalMeetings, icon: Calendar, color: 'blue' },
                { label: 'Total Tasks', value: data.teamStats.totalTasks, icon: CheckCircle, color: 'green' },
                { label: 'Team Productivity', value: `${data.teamStats.teamProductivity}%`, icon: TrendingUp, color: 'purple' },
                { label: 'Meeting Effectiveness', value: `${data.teamStats.meetingEffectiveness}%`, icon: Target, color: 'orange' },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    </div>
                    <div className={`p-3 bg-${metric.color}-100 rounded-lg`}>
                      <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Completion Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Completed</span>
                    <span className="text-sm font-medium text-green-600">{data.teamStats.completedTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Overdue</span>
                    <span className="text-sm font-medium text-red-600">{data.teamStats.overdueTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Pending</span>
                    <span className="text-sm font-medium text-blue-600">
                      {data.teamStats.totalTasks - data.teamStats.completedTasks - data.teamStats.overdueTasks}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent AI Insights</h3>
                <div className="space-y-3">
                  {data.insights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{insight.title}</p>
                        <p className="text-xs text-slate-600">{insight.description.substring(0, 80)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">AI-Generated Insights</h2>
              <span className="text-sm text-slate-600">{data.insights.length} insights found</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  variants={itemVariants}
                  className={cn(
                    'bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-md',
                    getInsightColor(insight.type)
                  )}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">{insight.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                    <span>{insight.type}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {insight.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-white rounded-full border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'predictions' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Predictive Analytics</h2>
              <span className="text-sm text-slate-600">{data.predictions.length} predictions active</span>
            </div>

            {/* Predictions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.predictions.map((prediction) => (
                <motion.div
                  key={prediction.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    {getPredictionIcon(prediction.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">{prediction.title}</h3>
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
                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getImpactColor(prediction.impact))}>
                      {prediction.impact} Impact
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-700">Recommendations:</p>
                    {prediction.recommendations.map((rec, index) => (
                      <p key={index} className="text-xs text-slate-600">• {rec}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Resource Forecasts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Resource Forecasts</h3>
              <div className="space-y-4">
                {data.resourceForecasts.map((forecast) => (
                  <div key={forecast.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900 capitalize">{forecast.resourceType} Forecast</h4>
                      <span className="text-sm text-slate-500">{Math.round(forecast.confidence * 100)}% confidence</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-slate-500">Current Capacity</span>
                        <p className="text-lg font-semibold text-slate-900">{forecast.currentCapacity}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Predicted Demand</span>
                        <p className="text-lg font-semibold text-slate-900">{forecast.predictedDemand}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Capacity Gap</span>
                        <p className="text-lg font-semibold text-red-600">{forecast.capacityGap}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-700">Recommendations:</p>
                      {forecast.recommendations.map((rec, index) => (
                        <p key={index} className="text-xs text-slate-600">• {rec}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Workload Analytics</h2>
              <span className="text-sm text-slate-600">Team workload predictions and trends</span>
            </div>

            {/* Workload Predictions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Individual Workload Analysis</h3>
              <div className="space-y-4">
                {data.workloadPredictions.map((prediction) => (
                  <div key={prediction.userId} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900">User {prediction.userId}</h4>
                      <div className="flex items-center gap-2">
                        {getWorkloadTrendIcon(prediction.workloadTrend)}
                        <span className="text-sm text-slate-500 capitalize">{prediction.workloadTrend}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-slate-500">Current</span>
                        <p className="text-lg font-semibold text-slate-900">{prediction.currentWorkload}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Predicted</span>
                        <p className="text-lg font-semibold text-slate-900">{prediction.predictedWorkload}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Burnout Risk</span>
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getBurnoutRiskColor(prediction.burnoutRisk))}>
                          {prediction.burnoutRisk}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-700">Recommendations:</p>
                      {prediction.recommendations.map((rec, index) => (
                        <p key={index} className="text-xs text-slate-600">• {rec}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Productivity Trends</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Current Week</span>
                    <span className="text-sm font-medium text-green-600">+12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Last Week</span>
                    <span className="text-sm font-medium text-red-600">-3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Two Weeks Ago</span>
                    <span className="text-sm font-medium text-green-600">+8%</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Meeting Effectiveness</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Action Items Generated</span>
                    <span className="text-sm font-medium text-blue-600">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Average Duration</span>
                    <span className="text-sm font-medium text-orange-600">47 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Participant Satisfaction</span>
                    <span className="text-sm font-medium text-green-600">4.2/5</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TeamIntelligenceDashboard;
