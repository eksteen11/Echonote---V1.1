"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Meeting, ActionItem, Transcript, Summary, Subscription } from './supabase';

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
  subscription: Subscription | null;
  // Mock actions
  createMeeting: (meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => Promise<Meeting>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  createActionItem: (item: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>) => Promise<ActionItem>;
  updateActionItem: (id: string, updates: Partial<ActionItem>) => Promise<void>;
  deleteActionItem: (id: string) => Promise<void>;
  upgradeSubscription: (tier: 'starter' | 'professional' | 'enterprise') => Promise<void>;
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
  const [subscription, setSubscription] = useState<Subscription | null>(null);

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
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      company: 'EchoPilot Inc.',
      role: 'admin',
      subscription_tier: 'professional',
      subscription_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Mock meetings
    const mockMeetings: Meeting[] = [
      {
        id: 'meeting_1',
        title: 'Q4 Planning Session',
        description: 'Strategic planning for Q4 goals and objectives',
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        duration: 60,
        participants: ['john@echopilot.com', 'sarah@echopilot.com', 'mike@echopilot.com'],
        platform: 'zoom',
        status: 'scheduled',
        tags: ['planning', 'strategy', 'q4'],
        user_id: 'user_1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'meeting_2',
        title: 'Product Development Review',
        description: 'Weekly review of product development progress',
        start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        end_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
        duration: 45,
        participants: ['john@echopilot.com', 'dev-team@echopilot.com'],
        platform: 'teams',
        status: 'completed',
        recording_url: 'https://example.com/recording1',
        transcript_url: 'https://example.com/transcript1',
        summary: 'Discussed API improvements and mobile app features',
        tags: ['development', 'product', 'weekly'],
        user_id: 'user_1',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'meeting_3',
        title: 'Marketing Strategy Meeting',
        description: 'Planning marketing campaigns for the new quarter',
        start_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        end_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
        duration: 90,
        participants: ['john@echopilot.com', 'marketing@echopilot.com'],
        platform: 'meet',
        status: 'completed',
        recording_url: 'https://example.com/recording2',
        transcript_url: 'https://example.com/transcript2',
        summary: 'Planned social media campaigns and content strategy',
        tags: ['marketing', 'strategy', 'campaigns'],
        user_id: 'user_1',
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Mock action items
    const mockActionItems: ActionItem[] = [
      {
        id: 'action_1',
        meeting_id: 'meeting_2',
        description: 'Implement API rate limiting improvements',
        assignee: 'dev-team@echopilot.com',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
        priority: 'high',
        status: 'in-progress',
        user_id: 'user_1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'action_2',
        meeting_id: 'meeting_2',
        description: 'Design mobile app user interface',
        assignee: 'design-team@echopilot.com',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks
        priority: 'medium',
        status: 'pending',
        user_id: 'user_1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'action_3',
        meeting_id: 'meeting_3',
        description: 'Create social media content calendar',
        assignee: 'marketing@echopilot.com',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
        priority: 'high',
        status: 'pending',
        user_id: 'user_1',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Mock transcripts
    const mockTranscripts: Transcript[] = [
      {
        id: 'transcript_1',
        meeting_id: 'meeting_2',
        segments: [
          {
            speaker: 'John Doe',
            text: 'Welcome everyone to our product development review.',
            startTime: 0,
            endTime: 5,
            confidence: 0.95,
          },
          {
            speaker: 'Dev Team Lead',
            text: 'We\'ve made significant progress on the API improvements.',
            startTime: 6,
            endTime: 12,
            confidence: 0.92,
          },
        ],
        confidence: 0.93,
        language: 'en',
        user_id: 'user_1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Mock summaries
    const mockSummaries: Summary[] = [
      {
        id: 'summary_1',
        meeting_id: 'meeting_2',
        content: 'The team discussed API improvements and mobile app development progress. Key decisions were made regarding rate limiting and user interface design.',
        key_points: [
          'API rate limiting improvements needed',
          'Mobile app UI design in progress',
          'Next review scheduled for next week',
        ],
        sentiment: 'positive',
        topics: ['development', 'API', 'mobile app'],
        ai_generated: true,
        user_id: 'user_1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Mock subscription
    const mockSubscription: Subscription = {
      id: 'sub_1',
      user_id: 'user_1',
      tier: 'professional',
      status: 'active',
      current_period_start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      cancel_at_period_end: false,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setUser(mockUser);
    setMeetings(mockMeetings);
    setActionItems(mockActionItems);
    setTranscripts(mockTranscripts);
    setSummaries(mockSummaries);
    setSubscription(mockSubscription);
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Mock authentication
    if (email === 'john@echopilot.com' && password === 'password123') {
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Mock signup
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: 'user',
      subscription_tier: 'free',
      subscription_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(newUser);
    return { success: true };
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    setMeetings([]);
    setActionItems([]);
    setTranscripts([]);
    setSummaries([]);
    setSubscription(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      setUser({ ...user, ...updates, updated_at: new Date().toISOString() });
    }
  };

  // Mock CRUD operations
  const createMeeting = async (meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>): Promise<Meeting> => {
    const newMeeting: Meeting = {
      ...meeting,
      id: `meeting_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMeetings(prev => [...prev, newMeeting]);
    return newMeeting;
  };

  const updateMeeting = async (id: string, updates: Partial<Meeting>): Promise<void> => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === id 
        ? { ...meeting, ...updates, updated_at: new Date().toISOString() }
        : meeting
    ));
  };

  const deleteMeeting = async (id: string): Promise<void> => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));
    setActionItems(prev => prev.filter(item => item.meeting_id !== id));
    setTranscripts(prev => prev.filter(transcript => transcript.meeting_id !== id));
    setSummaries(prev => prev.filter(summary => summary.meeting_id !== id));
  };

  const createActionItem = async (item: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>): Promise<ActionItem> => {
    const newActionItem: ActionItem = {
      ...item,
      id: `action_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setActionItems(prev => [...prev, newActionItem]);
    return newActionItem;
  };

  const updateActionItem = async (id: string, updates: Partial<ActionItem>): Promise<void> => {
    setActionItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updated_at: new Date().toISOString() }
        : item
    ));
  };

  const deleteActionItem = async (id: string): Promise<void> => {
    setActionItems(prev => prev.filter(item => item.id !== id));
  };

  const upgradeSubscription = async (tier: 'starter' | 'professional' | 'enterprise'): Promise<void> => {
    if (subscription) {
      const updatedSubscription: Subscription = {
        ...subscription,
        tier,
        updated_at: new Date().toISOString(),
      };
      setSubscription(updatedSubscription);
      
      if (user) {
        setUser({ ...user, subscription_tier: tier, updated_at: new Date().toISOString() });
      }
    }
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
    subscription,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    createActionItem,
    updateActionItem,
    deleteActionItem,
    upgradeSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
