import { 
  Meeting, 
  ActionItem, 
  Transcript, 
  Summary, 
  CalendarEvent, 
  User,
  ApiResponse,
  PaginatedResponse,
  SearchFilters,
  DashboardStats,
  UserPreferences
} from '@/types';
import { transcriptionService, audioTranscriptionService } from './open-source-transcription';
import { summaryService } from './open-source-summary';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.echopilot.com';
const ASSEMBLY_AI_KEY = process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY;
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const GOOGLE_CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

// Generic API client
class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Main API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Open Source Transcription Service
export class TranscriptionService {
  async transcribeAudio(audioUrl: string): Promise<ApiResponse<Transcript>> {
    console.log('Transcribing audio from:', audioUrl);
    
    // Use open-source transcription service
    try {
      // For now, return a mock response
      // In real implementation, this would use the open-source service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          id: 'transcript_123',
          meetingId: 'meeting_456',
          segments: [
            {
              id: 'seg_1',
              speaker: 'John Doe',
              text: 'Welcome everyone to our quarterly review meeting.',
              startTime: 0,
              endTime: 5,
              confidence: 0.95,
            },
            {
              id: 'seg_2',
              speaker: 'Jane Smith',
              text: 'Thank you John. Let\'s start with the Q3 results.',
              startTime: 5,
              endTime: 10,
              confidence: 0.92,
            },
          ],
          confidence: 0.93,
          language: 'en',
          createdAt: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed'
      };
    }
  }

  async startRealTimeTranscription(): Promise<ApiResponse<boolean>> {
    try {
      const success = await transcriptionService.startTranscription();
      return {
        success,
        data: success
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start transcription'
      };
    }
  }

  async stopRealTimeTranscription(): Promise<ApiResponse<void>> {
    try {
      transcriptionService.stopTranscription();
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to stop transcription'
      };
    }
  }

  async getTranscriptionStatus(transcriptionId: string): Promise<ApiResponse<{ status: string; progress: number }>> {
    // Placeholder implementation
    return {
      success: true,
      data: {
        status: 'completed',
        progress: 100,
      },
    };
  }
}

// Open Source Summary Service
export class SummaryService {
  async generateSummary(transcript: Transcript, options?: {
    includeKeyPoints?: boolean;
    includeActionItems?: boolean;
    maxLength?: number;
  }): Promise<ApiResponse<Summary>> {
    console.log('Generating summary for transcript:', transcript.id);
    
    try {
      // Use open-source summary service
      const summaryResult = await summaryService.generateSummary(transcript, {
        maxLength: options?.maxLength || 300,
        includeKeyPoints: options?.includeKeyPoints !== false,
        includeTopics: true,
        includeSentiment: true
      });
      
      return {
        success: true,
        data: {
          id: `summary_${Date.now()}`,
          meetingId: transcript.meetingId,
          content: summaryResult.summary,
          keyPoints: summaryResult.keyPoints,
          sentiment: summaryResult.sentiment,
          topics: summaryResult.topics,
          aiGenerated: true,
          createdAt: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Summary generation failed'
      };
    }
  }

  async extractActionItems(transcript: Transcript): Promise<ApiResponse<ActionItem[]>> {
    // Placeholder implementation
    return {
      success: true,
      data: [
        {
          id: 'action_1',
          meetingId: transcript.meetingId,
          description: 'Review and update project timeline by Friday',
          assignee: 'John Doe',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          priority: 'high',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'action_2',
          meetingId: transcript.meetingId,
          description: 'Prepare budget proposal for Q4',
          assignee: 'Jane Smith',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          priority: 'medium',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
  }
}

// Google Calendar Service
export class CalendarService {
  private calendarId: string;

  constructor(calendarId?: string) {
    this.calendarId = calendarId || GOOGLE_CALENDAR_ID || '';
  }

  async syncMeetings(): Promise<ApiResponse<CalendarEvent[]>> {
    // Placeholder implementation - replace with actual Google Calendar API call
    console.log('Syncing meetings from Google Calendar:', this.calendarId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock calendar events
    return {
      success: true,
      data: [
        {
          id: 'cal_event_1',
          title: 'Team Standup',
          description: 'Daily team synchronization meeting',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 minutes
          attendees: ['john@company.com', 'jane@company.com'],
          location: 'Conference Room A',
          platform: 'google',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
        },
        {
          id: 'cal_event_2',
          title: 'Client Presentation',
          description: 'Present Q3 results to client',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
          attendees: ['client@company.com', 'john@company.com'],
          location: 'Virtual',
          platform: 'google',
          meetingLink: 'https://zoom.us/j/123456789',
        },
      ],
    };
  }

  async createMeeting(meeting: Omit<CalendarEvent, 'id'>): Promise<ApiResponse<CalendarEvent>> {
    // Placeholder implementation
    return {
      success: true,
      data: {
        ...meeting,
        id: `cal_event_${Date.now()}`,
      },
    };
  }
}

// Main API service
export class EchoPilotAPI {
  private transcriptionService: TranscriptionService;
  private summaryService: SummaryService;
  private calendarService: CalendarService;

  constructor() {
    this.transcriptionService = new TranscriptionService();
    this.summaryService = new SummaryService();
    this.calendarService = new CalendarService();
  }

  // Meeting management
  async getMeetings(filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Meeting>>> {
    return apiClient.get<PaginatedResponse<Meeting>>('/meetings');
  }

  async getMeeting(id: string): Promise<ApiResponse<Meeting>> {
    return apiClient.get<Meeting>(`/meetings/${id}`);
  }

  async createMeeting(meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Meeting>> {
    return apiClient.post<Meeting>('/meetings', meeting);
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<ApiResponse<Meeting>> {
    return apiClient.put<Meeting>(`/meetings/${id}`, updates);
  }

  async deleteMeeting(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/meetings/${id}`);
  }

  // Action items
  async getActionItems(meetingId?: string): Promise<ApiResponse<ActionItem[]>> {
    const endpoint = meetingId ? `/action-items?meetingId=${meetingId}` : '/action-items';
    return apiClient.get<ActionItem[]>(endpoint);
  }

  async createActionItem(actionItem: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ActionItem>> {
    return apiClient.post<ActionItem>('/action-items', actionItem);
  }

  async updateActionItem(id: string, updates: Partial<ActionItem>): Promise<ApiResponse<ActionItem>> {
    return apiClient.put<ActionItem>(`/action-items/${id}`, updates);
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  }

  // User management
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/user/profile');
  }

  async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/user/profile', updates);
  }

  async getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
    return apiClient.get<UserPreferences>('/user/preferences');
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    return apiClient.put<UserPreferences>('/user/preferences', preferences);
  }

  // Service getters
  get transcription() {
    return this.transcriptionService;
  }

  get summary() {
    return this.summaryService;
  }

  get calendar() {
    return this.calendarService;
  }
}

// Export singleton instance
export const api = new EchoPilotAPI();
