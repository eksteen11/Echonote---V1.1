'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Video,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatDuration, getRelativeTime } from '@/lib/utils';
import { DashboardStats, Meeting, ActionItem } from '@/types';
import { useAuth } from '@/lib/auth-context';

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

export default function Dashboard() {
  const { meetings, actionItems, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data from auth context
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate stats from real data
      const totalMeetings = meetings.length;
      const upcomingMeetingsCount = meetings.filter(m => m.status === 'scheduled').length;
      const completedMeetingsCount = meetings.filter(m => m.status === 'completed').length;
      const totalActionItemsCount = actionItems.length;
      const pendingActionItemsCount = actionItems.filter(a => a.status === 'pending').length;
      const avgDuration = meetings.length > 0 
        ? Math.round(meetings.reduce((sum, m) => sum + m.duration, 0) / meetings.length)
        : 0;

      // Calculate platform usage
      const platformCounts = meetings.reduce((acc, meeting) => {
        acc[meeting.platform] = (acc[meeting.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topPlatforms = Object.entries(platformCounts)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setStats({
        totalMeetings: totalMeetings,
        upcomingMeetings: upcomingMeetingsCount,
        completedMeetings: completedMeetingsCount,
        totalActionItems: totalActionItemsCount,
        pendingActionItems: pendingActionItemsCount,
        averageMeetingDuration: avgDuration,
        topPlatforms,
        recentActivity: [
          { type: 'meeting_completed', description: 'Product Development Review completed', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { type: 'summary_generated', description: 'Action items extracted from Marketing Strategy Meeting', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
          { type: 'transcript_ready', description: 'Q4 Planning Session transcript available', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
        ],
      });

      // Get upcoming meetings from real data and convert to Dashboard format
      const upcoming = meetings
        .filter(m => m.status === 'scheduled')
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 3)
        .map(m => ({
          id: m.id,
          title: m.title,
          description: m.description,
          startTime: new Date(m.start_time),
          endTime: m.end_time ? new Date(m.end_time) : undefined,
          duration: m.duration,
          participants: m.participants,
          platform: m.platform,
          status: m.status,
          recordingUrl: m.recording_url,
          transcriptUrl: m.transcript_url,
          summary: m.summary,
          actionItems: actionItems.filter(a => a.meeting_id === m.id).map(a => ({
            id: a.id,
            meetingId: a.meeting_id,
            description: a.description,
            assignee: a.assignee,
            dueDate: a.due_date ? new Date(a.due_date) : undefined,
            priority: a.priority,
            status: a.status,
            createdAt: new Date(a.created_at),
            updatedAt: new Date(a.updated_at),
          })),
          tags: m.tags,
          createdAt: new Date(m.created_at),
          updatedAt: new Date(m.updated_at),
        }));
      
      setUpcomingMeetings(upcoming);

      setRecentActivity([
        { type: 'meeting_completed', description: 'Q3 Review completed', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { type: 'summary_generated', description: 'Action items extracted from Team Standup', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
        { type: 'transcript_ready', description: 'Client Presentation transcript available', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
      ]);

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
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
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening with your meetings.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Meetings</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.totalMeetings}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Upcoming</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.upcomingMeetings}</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:bg-accent-200 transition-colors">
              <Clock className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Action Items</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.pendingActionItems}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center group-hover:bg-warning-200 transition-colors">
              <CheckSquare className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Duration</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.averageMeetingDuration}m</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center group-hover:bg-success-200 transition-colors">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Meetings */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Upcoming Meetings</h2>
              <button className="btn-ghost text-primary-600 hover:text-primary-700">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{meeting.title}</h3>
                      <p className="text-sm text-slate-600">{meeting.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-slate-500">{formatDate(meeting.startTime)}</span>
                        <span className="text-xs text-slate-500">{formatDuration(meeting.duration)}</span>
                        <span className="text-xs text-slate-500 capitalize">{meeting.platform}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-white transition-colors">
                      <Play className="w-4 h-4 text-primary-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white transition-colors">
                      <Pause className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500">{getRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn-ghost w-full mt-6 text-primary-600 hover:text-primary-700">
              View All Activity
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Platform Usage */}
      <motion.div variants={itemVariants}>
        <div className="card">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Platform Usage</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats?.topPlatforms.map((platform) => (
              <div key={platform.platform} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-medium text-slate-900">{platform.platform}</h3>
                <p className="text-2xl font-bold text-primary-600">{platform.count}</p>
                <p className="text-sm text-slate-500">meetings</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
