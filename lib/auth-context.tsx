"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Meeting, ActionItem, Transcript, Summary } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  // Mock data
  meetings: Meeting[];
  actionItems: ActionItem[];
  transcripts: Transcript[];
  summaries: Summary[];
  // Mock actions
  createMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Meeting>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  createActionItem: (item: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ActionItem>;
  updateActionItem: (id: string, updates: Partial<ActionItem>) => Promise<void>;
  deleteActionItem: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);

  // Initialize mock data
  useEffect(() => {
    initializeMockData();
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const initializeMockData = () => {
    // Mock user
    const mockUser: User = {
      id: 'user_1',
      email: 'john@echopilot.com',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      company: 'EchoPilot Inc.',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock meetings
    const mockMeetings: Meeting[] = [
      {
        id: 'meeting_1',
        title: 'Q4 Planning Session',
        description: 'Strategic planning for Q4 goals and objectives',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        duration: 60,
        participants: ['john@echopilot.com', 'sarah@echopilot.com', 'mike@echopilot.com'],
        platform: 'zoom',
        status: 'scheduled',
        tags: ['planning', 'strategy', 'q4'],
        actionItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'meeting_2',
        title: 'Product Development Review',
        description: 'Weekly review of product development progress',
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        duration: 45,
        participants: ['john@echopilot.com', 'dev-team@echopilot.com'],
        platform: 'teams',
        status: 'completed',
        recordingUrl: 'https://example.com/recording1',
        transcriptUrl: 'https://example.com/transcript1',
        summary: 'Discussed API improvements and mobile app features',
        tags: ['development', 'product', 'weekly'],
        actionItems: [],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'meeting_3',
        title: 'Marketing Strategy Meeting',
        description: 'Planning marketing campaigns for the new quarter',
        startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        duration: 90,
        participants: ['john@echopilot.com', 'marketing@echopilot.com'],
        platform: 'meet',
        status: 'completed',
        recordingUrl: 'https://example.com/recording2',
        transcriptUrl: 'https://example.com/transcript2',
        summary: 'Planned social media campaigns and content strategy',
        tags: ['marketing', 'strategy', 'campaigns'],
        actionItems: [],
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    // Mock action items
    const mockActionItems: ActionItem[] = [
      {
        id: 'action_1',
        meetingId: 'meeting_2',
        description: 'Implement API rate limiting improvements',
        assignee: 'dev-team@echopilot.com',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        priority: 'high',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'action_2',
        meetingId: 'meeting_2',
        description: 'Design mobile app user interface',
        assignee: 'design-team@echopilot.com',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        priority: 'medium',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'action_3',
        meetingId: 'meeting_3',
        description: 'Create social media content calendar',
        assignee: 'marketing@echopilot.com',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        priority: 'high',
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    // Mock transcripts
    const mockTranscripts: Transcript[] = [
      {
        id: 'transcript_1',
        meetingId: 'meeting_2',
        segments: [
          {
            id: 'segment_1',
            speaker: 'John Doe',
            text: 'Welcome everyone to our product development review.',
            startTime: 0,
            endTime: 5,
            confidence: 0.95,
          },
          {
            id: 'segment_2',
            speaker: 'Dev Team Lead',
            text: 'We\'ve made significant progress on the API improvements.',
            startTime: 6,
            endTime: 12,
            confidence: 0.92,
          },
        ],
        confidence: 0.93,
        language: 'en',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    // Mock summaries
    const mockSummaries: Summary[] = [
      {
        id: 'summary_1',
        meetingId: 'meeting_2',
        content: 'Discussed API improvements and mobile app features. Team made significant progress on backend optimization.',
        keyPoints: ['API rate limiting improvements', 'Mobile app UI design', 'Backend performance optimization'],
        sentiment: 'positive',
        topics: ['development', 'product', 'optimization'],
        aiGenerated: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    setUser(mockUser);
    setMeetings(mockMeetings);
    setActionItems(mockActionItems);
    setTranscripts(mockTranscripts);
    setSummaries(mockSummaries);
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Mock authentication
    if (email === 'john@echopilot.com' && password === 'password123') {
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create account' };
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    setMeetings([]);
    setActionItems([]);
    setTranscripts([]);
    setSummaries([]);
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      setUser({ ...user, ...updates, updatedAt: new Date() });
    }
  };

  // Mock CRUD operations
  const createMeeting = async (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> => {
    const newMeeting: Meeting = {
      ...meeting,
      id: `meeting_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMeetings(prev => [...prev, newMeeting]);
    return newMeeting;
  };

  const updateMeeting = async (id: string, updates: Partial<Meeting>): Promise<void> => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === id 
        ? { ...meeting, ...updates, updatedAt: new Date() }
        : meeting
    ));
  };

  const deleteMeeting = async (id: string): Promise<void> => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));
    setActionItems(prev => prev.filter(item => item.meetingId !== id));
    setTranscripts(prev => prev.filter(transcript => transcript.meetingId !== id));
    setSummaries(prev => prev.filter(summary => summary.meetingId !== id));
  };

  const createActionItem = async (item: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActionItem> => {
    const newActionItem: ActionItem = {
      ...item,
      id: `action_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setActionItems(prev => [...prev, newActionItem]);
    return newActionItem;
  };

  const updateActionItem = async (id: string, updates: Partial<ActionItem>): Promise<void> => {
    setActionItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    ));
  };

  const deleteActionItem = async (id: string): Promise<void> => {
    setActionItems(prev => prev.filter(item => item.id !== id));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    meetings,
    actionItems,
    transcripts,
    summaries,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    createActionItem,
    updateActionItem,
    deleteActionItem,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
