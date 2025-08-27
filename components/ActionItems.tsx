'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatDuration, getRelativeTime, getPriorityColor, getStatusColor } from '@/lib/utils';
import { ActionItem, Meeting } from '@/types';

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

export default function ActionItems() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [filteredActionItems, setFilteredActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItem | null>(null);

  useEffect(() => {
    // Simulate loading data
    const loadActionItems = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockActionItems: ActionItem[] = [
        {
          id: '1',
          meetingId: 'meeting_1',
          description: 'Review and update project timeline for Q4',
          assignee: 'John Doe',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          priority: 'high',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          meetingId: 'meeting_1',
          description: 'Prepare budget proposal for Q4 with detailed breakdown',
          assignee: 'Jane Smith',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          priority: 'medium',
          status: 'in-progress',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          meetingId: 'meeting_2',
          description: 'Fix critical bug in user authentication system',
          assignee: 'Bob Johnson',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          priority: 'urgent',
          status: 'in-progress',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          id: '4',
          meetingId: 'meeting_3',
          description: 'Schedule follow-up meeting with client to address concerns',
          assignee: 'John Doe',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          priority: 'high',
          status: 'pending',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
        {
          id: '5',
          meetingId: 'meeting_4',
          description: 'Create user research report based on recent findings',
          assignee: 'Alice Brown',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          priority: 'low',
          status: 'pending',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
        {
          id: '6',
          meetingId: 'meeting_2',
          description: 'Update documentation for new authentication flow',
          assignee: 'Bob Johnson',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          priority: 'medium',
          status: 'completed',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      ];
      
      setActionItems(mockActionItems);
      setFilteredActionItems(mockActionItems);
      setLoading(false);
    };

    loadActionItems();
  }, []);

  useEffect(() => {
    // Filter action items based on search and filters
    let filtered = actionItems;
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === priorityFilter);
    }
    
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(item => item.assignee === assigneeFilter);
    }
    
    setFilteredActionItems(filtered);
  }, [actionItems, searchQuery, statusFilter, priorityFilter, assigneeFilter]);

  const getUniqueAssignees = () => {
    return Array.from(new Set(actionItems.map(item => item.assignee)));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (dueDate: Date) => {
    const daysUntilDue = getDaysUntilDue(dueDate);
    if (daysUntilDue < 0) return 'text-red-600 bg-red-100';
    if (daysUntilDue <= 2) return 'text-orange-600 bg-orange-100';
    if (daysUntilDue <= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-1/3"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-slate-900">Action Items</h1>
          <p className="text-slate-600">Track and manage tasks from your meetings</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          New Action Item
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{actionItems.length}</p>
          <p className="text-sm text-slate-600">Total Items</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-warning-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {actionItems.filter(item => item.status === 'pending').length}
          </p>
          <p className="text-sm text-slate-600">Pending</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {actionItems.filter(item => item.status === 'in-progress').length}
          </p>
          <p className="text-sm text-slate-600">In Progress</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {actionItems.filter(item => item.status === 'completed').length}
          </p>
          <p className="text-sm text-slate-600">Completed</p>
        </div>
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
                placeholder="Search action items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field min-w-[140px]"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="input-field min-w-[140px]"
            >
              <option value="all">All Assignees</option>
              {getUniqueAssignees().map((assignee) => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Action Items List */}
      <motion.div variants={itemVariants} className="space-y-4">
        <AnimatePresence>
          {filteredActionItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedActionItem(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Status Icon */}
                  <div className="mt-1">
                    {getStatusIcon(item.status)}
                  </div>
                  
                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {item.description}
                      </h3>
                      <span className={cn('status-badge', getPriorityColor(item.priority))}>
                        {item.priority}
                      </span>
                      <span className={cn('status-badge', getStatusColor(item.status))}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{item.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {formatDate(item.dueDate!)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getDueDateColor(item.dueDate!))}>
                          {getDaysUntilDue(item.dueDate!) > 0 
                            ? `${getDaysUntilDue(item.dueDate!)} days left`
                            : getDaysUntilDue(item.dueDate!) < 0 
                              ? `${Math.abs(getDaysUntilDue(item.dueDate!))} days overdue`
                              : 'Due today'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Edit className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredActionItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No action items found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
