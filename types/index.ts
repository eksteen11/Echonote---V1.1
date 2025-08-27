export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  company?: string;
  role: 'admin' | 'user' | 'viewer' | 'executive' | 'director' | 'manager' | 'lead';
  createdAt: Date;
  updatedAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  participants: string[];
  platform: 'zoom' | 'teams' | 'meet' | 'webex' | 'other';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  recordingUrl?: string;
  transcriptUrl?: string;
  summary?: string;
  actionItems: ActionItem[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  assignee: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transcript {
  id: string;
  meetingId: string;
  segments: TranscriptSegment[];
  confidence: number;
  language: string;
  createdAt: Date;
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  confidence: number;
}

export interface Summary {
  id: string;
  meetingId: string;
  content: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  aiGenerated: boolean;
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  location?: string;
  platform: 'google' | 'outlook' | 'other';
  meetingLink?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'meeting_reminder' | 'action_item_due' | 'summary_ready' | 'transcript_ready';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  query?: string;
  dateFrom?: Date;
  dateTo?: Date;
  platform?: string;
  status?: string;
  tags?: string[];
  participants?: string[];
}

export interface DashboardStats {
  totalMeetings: number;
  upcomingMeetings: number;
  completedMeetings: number;
  totalActionItems: number;
  pendingActionItems: number;
  averageMeetingDuration: number;
  topPlatforms: Array<{ platform: string; count: number }>;
  recentActivity: Array<{ type: string; description: string; timestamp: Date }>;
}

export interface UserPreferences {
  userId: string;
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
  };
  calendar: {
    autoSync: boolean;
    defaultDuration: number;
    workingHours: {
      start: string;
      end: string;
    };
  };
  transcription: {
    autoTranscribe: boolean;
    language: string;
    confidenceThreshold: number;
  };
  summary: {
    autoGenerate: boolean;
    includeKeyPoints: boolean;
    includeActionItems: boolean;
    maxLength: number;
  };
}

// AI Task Allocation Types
export interface TaskAllocationContext {
  meetingId: string;
  participants: string[];
  actionItems: string[];
  meetingContext: string;
  organizationalStructure: OrganizationalStructure;
  historicalData: HistoricalTaskData;
}

export interface OrganizationalStructure {
  departments: Department[];
  roles: Role[];
  reportingStructure: ReportingRelationship[];
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  members: string[];
  skills: string[];
}

export interface Role {
  id: string;
  title: string;
  department: string;
  requiredSkills: string[];
  preferredSkills: string[];
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager';
}

export interface ReportingRelationship {
  employeeId: string;
  managerId: string;
  department: string;
}

export interface HistoricalTaskData {
  userId: string;
  completedTasks: number;
  averageCompletionTime: number; // in days
  successRate: number; // 0-1
  skills: string[];
  workload: number; // 0-1, where 1 is maximum capacity
  lastUpdated: Date;
}

// Cross-Meeting Intelligence Types
export interface CrossMeetingInsight {
  id: string;
  type: 'pattern' | 'decision' | 'dependency' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  relatedMeetings: string[];
  participants: string[];
  tags: string[];
  createdAt: Date;
  lastUpdated: Date;
  status: string;
}

export interface DecisionTracker {
  decisions: Decision[];
  implementationStatus: Record<string, string>;
  dependencies: Record<string, string[]>;
}

export interface Decision {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
}

export interface MeetingPattern {
  type: string;
  frequency: number;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  metadata: KnowledgeGraphMetadata;
}

export interface KnowledgeNode {
  id: string;
  type: 'meeting' | 'person' | 'topic' | 'decision' | 'project' | 'department' | 'insight';
  label: string;
  metadata: any;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface KnowledgeGraphMetadata {
  totalMeetings: number;
  totalParticipants: number;
  totalDecisions: number;
  lastUpdated: Date;
}

// Predictive Analytics Types
export interface Prediction {
  id: string;
  type: 'resource' | 'timeline' | 'workload' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number; // 0-1
  probability: number;
  impact: 'low' | 'medium' | 'high';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  affectedUsers: string[];
  affectedDepartments: string[];
  recommendations: string[];
  createdAt: Date;
  expiresAt: Date;
}

export interface ResourceForecast {
  id: string;
  resourceType: 'personnel' | 'time' | 'budget' | 'equipment';
  currentCapacity: number;
  predictedDemand: number;
  capacityGap: number;
  timeframe: Date;
  confidence: number;
  recommendations: string[];
}

export interface TimelinePrediction {
  id: string;
  projectId: string;
  currentProgress: number; // 0-1
  currentDeadline: Date;
  predictedCompletion: Date;
  confidence: number;
  riskFactors: string[];
  mitigationStrategies: string[];
  recommendations: string[];
  createdAt: Date;
  expiresAt: Date;
}

export interface WorkloadPrediction {
  userId: string;
  currentWorkload: number; // 0-1
  predictedWorkload: number; // 0-1
  workloadTrend: string;
  timeframe: Date;
  burnoutRisk: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface MeetingOptimization {
  meetingId: string;
  currentEffectiveness: number; // 0-1
  suggestedImprovements: string[];
  estimatedImpact: 'low' | 'medium' | 'high';
  implementationEffort: 'low' | 'medium' | 'high';
}

// Transcription and Summary Types
export interface TranscriptionOptions {
  language: string;
  enableSpeakerIdentification: boolean;
  confidenceThreshold: number;
  enableRealTime: boolean;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
  segments: TranscriptionSegment[];
  speakers: string[];
  duration: number; // in seconds
}

export interface TranscriptionSegment {
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface SummaryOptions {
  maxLength: number;
  includeKeyPoints: boolean;
  includeTopics: boolean;
  includeSentiment: boolean;
  style: 'executive' | 'technical' | 'meeting';
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  wordCount: number;
}
