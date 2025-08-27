'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Filter, 
  Search, 
  Plus,
  MoreVertical,
  Play,
  Pause,
  Stop,
  FileText,
  CheckSquare,
  Tag,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatDateTime, formatDuration, getStatusColor, getPriorityColor } from '@/lib/utils';
import { Meeting, ActionItem } from '@/types';

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

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    // Simulate loading data
    const loadMeetings = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          title: 'Q3 Review Meeting',
          description: 'Quarterly business review and planning session',
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
          duration: 90,
          participants: ['john@company.com', 'jane@company.com', 'bob@company.com', 'alice@company.com'],
          platform: 'zoom',
          status: 'completed',
          recordingUrl: 'https://example.com/recording1',
          transcriptUrl: 'https://example.com/transcript1',
          summary: 'Q3 results exceeded expectations with 15% growth. Q4 budget approved.',
          actionItems: [
            {
              id: 'ai1',
              meetingId: '1',
              description: 'Review and update project timeline',
              assignee: 'John Doe',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              priority: 'high',
              status: 'pending',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'ai2',
              meetingId: '1',
              description: 'Prepare budget proposal for Q4',
              assignee: 'Jane Smith',
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              priority: 'medium',
              status: 'pending',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          tags: ['quarterly', 'review', 'planning'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Team Standup',
          description: 'Daily team synchronization meeting',
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          duration: 30,
          participants: ['john@company.com', 'jane@company.com', 'bob@company.com'],
          platform: 'teams',
          status: 'completed',
          actionItems: [
            {
              id: 'ai3',
              meetingId: '2',
              description: 'Fix bug in user authentication',
              assignee: 'Bob Johnson',
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
              priority: 'high',
              status: 'in-progress',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          tags: ['daily', 'team', 'sync'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          title: 'Client Presentation',
          description: 'Present Q3 results to client',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          duration: 60,
          participants: ['john@company.com', 'client@company.com'],
          platform: 'meet',
          status: 'scheduled',
          actionItems: [],
          tags: ['client', 'presentation'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          title: 'Product Planning',
          description: 'Discuss new product features and roadmap',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000),
          duration: 120,
          participants: ['john@company.com', 'jane@company.com', 'product@company.com'],
          platform: 'zoom',
          status: 'scheduled',
          actionItems: [],
          tags: ['product', 'planning', 'roadmap'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      setMeetings(mockMeetings);
      setFilteredMeetings(mockMeetings);
      setLoading(false);
    };

    loadMeetings();
  }, []);

  useEffect(() => {
    // Filter meetings based on search and filters
    let filtered = meetings;
    
    if (searchQuery) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }
    
    if (platformFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.platform === platformFilter);
    }
    
    setFilteredMeetings(filtered);
  }, [meetings, searchQuery, statusFilter, platformFilter]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return '🔵';
      case 'teams':
        return '🔷';
      case 'meet':
        return '🟢';
      case 'webex':
        return '🟠';
      default:
        return '📹';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-1/3"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
          <p className="text-slate-600">Manage and track all your meetings</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          New Meeting
        </button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Platform Filter */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="input-field min-w-[140px]"
            >
              <option value="all">All Platforms</option>
              <option value="zoom">Zoom</option>
              <option value="teams">Teams</option>
              <option value="meet">Meet</option>
              <option value="webex">Webex</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Meetings List */}
      <motion.div variants={itemVariants} className="space-y-4">
        <AnimatePresence>
          {filteredMeetings.map((meeting) => (
            <motion.div
              key={meeting.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedMeeting(meeting)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Platform Icon */}
                  <div className="text-2xl">{getPlatformIcon(meeting.platform)}</div>
                  
                  {/* Meeting Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {meeting.title}
                      </h3>
                      <span className={cn('status-badge', getStatusColor(meeting.status))}>
                        {meeting.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 mb-3">{meeting.description}</p>
                    
                    {/* Meeting Details */}
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(meeting.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(meeting.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants.length} participants</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {meeting.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <div className="flex gap-2">
                          {meeting.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  {meeting.status === 'scheduled' && (
                    <>
                      <button className="p-2 rounded-lg hover:bg-primary-50 transition-colors">
                        <Play className="w-4 h-4 text-primary-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <Pause className="w-4 h-4 text-slate-600" />
                      </button>
                    </>
                  )}
                  
                  {meeting.status === 'in-progress' && (
                    <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <Stop className="w-4 h-4 text-slate-600" />
                    </button>
                  )}
                  
                  {meeting.status === 'completed' && (
                    <div className="flex gap-2">
                      {meeting.transcriptUrl && (
                        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <FileText className="w-4 h-4 text-slate-600" />
                        </button>
                      )}
                      {meeting.actionItems.length > 0 && (
                        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <CheckSquare className="w-4 h-4 text-slate-600" />
                        </button>
                      )}
                    </div>
                  )}
                  
                  <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              
              {/* Action Items Preview */}
              {meeting.actionItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Action Items ({meeting.actionItems.length})</h4>
                  <div className="space-y-2">
                    {meeting.actionItems.slice(0, 2).map((actionItem) => (
                      <div key={actionItem.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{actionItem.description}</span>
                        <div className="flex items-center gap-2">
                          <span className={cn('priority-badge', getPriorityColor(actionItem.priority))}>
                            {actionItem.priority}
                          </span>
                          <span className="text-slate-500">→ {actionItem.assignee}</span>
                        </div>
                      </div>
                    ))}
                    {meeting.actionItems.length > 2 && (
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View all {meeting.actionItems.length} action items
                        <ArrowRight className="w-4 h-4 ml-1 inline" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredMeetings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No meetings found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
