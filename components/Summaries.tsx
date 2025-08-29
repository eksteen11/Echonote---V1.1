'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  CheckSquare, 
  Tag,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Share2,
  Copy,
  Star,
  Eye,
  MoreVertical,
  ArrowRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatDuration, getRelativeTime } from '@/lib/utils';
import { Summary, Meeting, ActionItem } from '@/types';
import PageHeader from '@/components/PageHeader';

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

export default function Summaries() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [filteredSummaries, setFilteredSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);

  useEffect(() => {
    // Simulate loading data
    const loadSummaries = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockSummaries: Summary[] = [
        {
          id: '1',
          meetingId: 'meeting_1',
          content: 'The Q3 review meeting covered quarterly business performance, budget discussions, and strategic planning for Q4. Key highlights include exceeding revenue targets by 15%, successful product launches, and team expansion plans. The meeting concluded with action items for project timeline updates and budget proposal preparation.',
          keyPoints: [
            'Q3 revenue exceeded targets by 15%',
            'Three new products successfully launched',
            'Team expanded from 25 to 32 members',
            'Q4 budget increased by 20%',
            'New market expansion strategy approved'
          ],
          sentiment: 'positive',
          topics: ['quarterly review', 'budget', 'product launch', 'team expansion', 'strategy'],
          aiGenerated: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          id: '2',
          meetingId: 'meeting_2',
          content: 'Daily team standup focused on current sprint progress, technical challenges, and upcoming deliverables. Several blockers were identified and resolved collaboratively. The team is on track to complete sprint goals by Friday.',
          keyPoints: [
            'Sprint progress: 75% complete',
            'Authentication bug resolved',
            'New feature development on track',
            'Code review process improved',
            'Next sprint planning scheduled'
          ],
          sentiment: 'neutral',
          topics: ['sprint', 'technical', 'development', 'planning'],
          aiGenerated: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        },
        {
          id: '3',
          meetingId: 'meeting_3',
          content: 'Client presentation meeting focused on Q3 results and Q4 roadmap. Client expressed concerns about delivery timelines and requested additional features. The meeting ended with revised commitments and extended project timeline.',
          keyPoints: [
            'Q3 results presented successfully',
            'Client requested 3 new features',
            'Project timeline extended by 2 weeks',
            'Additional budget approved',
            'Weekly check-ins scheduled'
          ],
          sentiment: 'negative',
          topics: ['client', 'presentation', 'timeline', 'features', 'budget'],
          aiGenerated: true,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        },
        {
          id: '4',
          meetingId: 'meeting_4',
          content: 'Product planning session covered new feature requirements, user research findings, and development priorities. The team aligned on MVP scope and identified key success metrics. Development will begin next month.',
          keyPoints: [
            'MVP scope defined and approved',
            'User research insights shared',
            'Success metrics established',
            'Development timeline: 3 months',
            'Beta testing planned for month 2'
          ],
          sentiment: 'positive',
          topics: ['product', 'planning', 'features', 'development', 'research'],
          aiGenerated: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        },
      ];
      
      setSummaries(mockSummaries);
      setFilteredSummaries(mockSummaries);
      setLoading(false);
    };

    loadSummaries();
  }, []);

  useEffect(() => {
    // Filter summaries based on search and filters
    let filtered = summaries;
    
    if (searchQuery) {
      filtered = filtered.filter(summary =>
        summary.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summary.keyPoints.some(point => point.toLowerCase().includes(searchQuery.toLowerCase())) ||
        summary.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(summary => summary.sentiment === sentimentFilter);
    }
    
    setFilteredSummaries(filtered);
  }, [summaries, searchQuery, sentimentFilter]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'neutral':
        return <Minus className="w-5 h-5 text-slate-600" />;
      default:
        return <Minus className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      case 'neutral':
        return 'text-slate-600 bg-slate-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-1/3"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <PageHeader title="Meeting Summaries" subtitle="AI-generated insights and key points from your meetings" />

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search summaries, key points, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Sentiment Filter */}
          <div className="flex gap-2">
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="input-field min-w-[140px]"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Summaries Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredSummaries.map((summary) => (
            <motion.div
              key={summary.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedSummary(summary)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                      Meeting Summary
                    </h3>
                    <p className="text-sm text-slate-500">{getRelativeTime(summary.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={cn('status-badge', getSentimentColor(summary.sentiment))}>
                    {summary.sentiment}
                  </span>
                  {summary.aiGenerated && (
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-accent-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content Preview */}
              <div className="mb-4">
                <p className="text-slate-700 line-clamp-3">
                  {summary.content}
                </p>
              </div>

              {/* Key Points */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Key Points</h4>
                <div className="space-y-1">
                  {summary.keyPoints.slice(0, 3).map((point, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600 line-clamp-1">{point}</span>
                    </div>
                  ))}
                  {summary.keyPoints.length > 3 && (
                    <p className="text-xs text-slate-500">
                      +{summary.keyPoints.length - 3} more points
                    </p>
                  )}
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {summary.topics.slice(0, 4).map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                  {summary.topics.length > 4 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                      +{summary.topics.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Generated</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Share2 className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredSummaries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No summaries found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Summary Detail Modal */}
      <AnimatePresence>
        {selectedSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSummary(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Meeting Summary</h2>
                  <button
                    onClick={() => setSelectedSummary(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Summary Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Summary</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedSummary.content}</p>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Points</h3>
                    <div className="space-y-2">
                      {selectedSummary.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSummary.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-primary-100 text-primary-700 text-sm rounded-lg font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <button className="btn-secondary">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </button>
                      <button className="btn-secondary">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </button>
                    </div>
                    
                    <button className="btn-primary">
                      View Full Meeting
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
