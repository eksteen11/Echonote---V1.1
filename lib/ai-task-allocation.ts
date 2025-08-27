import { ActionItem, Meeting, User, Transcript } from '@/types';

export interface TaskAllocationContext {
  meeting: Meeting;
  transcript: Transcript;
  participants: User[];
  organizationalStructure: OrganizationalStructure;
  historicalData: HistoricalTaskData;
}

export interface OrganizationalStructure {
  departments: Department[];
  roles: Role[];
  reportingLines: ReportingLine[];
}

export interface Department {
  id: string;
  name: string;
  members: string[]; // user IDs
  responsibilities: string[];
}

export interface Role {
  id: string;
  name: string;
  departmentId: string;
  responsibilities: string[];
  skillTags: string[];
}

export interface ReportingLine {
  managerId: string;
  employeeId: string;
  relationshipType: 'direct' | 'matrix' | 'project';
}

export interface HistoricalTaskData {
  userTaskHistory: Record<string, UserTaskStats>;
  departmentTaskHistory: Record<string, DepartmentTaskStats>;
  projectTaskHistory: Record<string, ProjectTaskStats>;
}

export interface UserTaskStats {
  userId: string;
  completedTasks: number;
  averageCompletionTime: number; // in hours
  skillProficiency: Record<string, number>; // skill -> proficiency score (0-1)
  currentWorkload: number; // current active tasks
  preferredTaskTypes: string[];
}

export interface DepartmentTaskStats {
  departmentId: string;
  totalTasks: number;
  averageCompletionTime: number;
  commonTaskTypes: string[];
}

export interface ProjectTaskStats {
  projectId: string;
  totalTasks: number;
  teamMembers: string[];
  currentPhase: string;
  deadline: Date;
}

export class AITaskAllocationEngine {
  private organizationalStructure: OrganizationalStructure;
  private historicalData: HistoricalTaskData;

  constructor(orgStructure: OrganizationalStructure, history: HistoricalTaskData) {
    this.organizationalStructure = orgStructure;
    this.historicalData = history;
  }

  /**
   * Main method to allocate tasks from a meeting
   */
  async allocateTasksFromMeeting(context: TaskAllocationContext): Promise<ActionItem[]> {
    const { meeting, transcript, participants } = context;
    
    // Extract action items from transcript
    const extractedTasks = await this.extractActionItemsFromTranscript(transcript);
    
    // Allocate each task to the best person
    const allocatedTasks: ActionItem[] = [];
    
    for (const task of extractedTasks) {
      const bestAssignee = await this.findBestAssignee(task, participants, context);
      const priority = await this.calculateTaskPriority(task, context);
      const dueDate = await this.suggestDueDate(task, context);
      
      allocatedTasks.push({
        ...task,
        assignee: bestAssignee.id,
        priority,
        dueDate,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    return allocatedTasks;
  }

  /**
   * Extract action items from meeting transcript using AI
   */
  private async extractActionItemsFromTranscript(transcript: Transcript): Promise<Omit<ActionItem, 'id' | 'assignee' | 'priority' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt'>[]> {
    // This would integrate with your ChatGPT plan for intelligent extraction
    const actionItems: Omit<ActionItem, 'id' | 'assignee' | 'priority' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt'>[] = [];
    
    // Analyze transcript segments for action items
    for (const segment of transcript.segments) {
      const extractedItems = await this.analyzeSegmentForActionItems(segment);
      actionItems.push(...extractedItems);
    }
    
    return actionItems;
  }

  /**
   * Analyze a transcript segment for action items
   */
  private async analyzeSegmentForActionItems(segment: any): Promise<Omit<ActionItem, 'id' | 'assignee' | 'priority' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt'>[]> {
    const actionItems: Omit<ActionItem, 'id' | 'assignee' | 'priority' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt'>[] = [];
    
    // Simple keyword-based extraction (can be enhanced with ChatGPT)
    const actionKeywords = [
      'need to', 'should', 'must', 'will', 'going to', 'plan to',
      'follow up', 'review', 'prepare', 'send', 'schedule', 'meet',
      'update', 'create', 'develop', 'implement', 'test', 'deploy'
    ];
    
    const text = segment.text.toLowerCase();
    
    for (const keyword of actionKeywords) {
      if (text.includes(keyword)) {
        // Extract the action item description
        const startIndex = text.indexOf(keyword);
        const endIndex = text.indexOf('.', startIndex);
        const description = text.substring(startIndex, endIndex > startIndex ? endIndex : text.length);
        
        if (description.length > 10) { // Minimum meaningful length
          actionItems.push({
            meetingId: segment.meetingId || 'unknown',
            description: description.charAt(0).toUpperCase() + description.slice(1),
          });
        }
      }
    }
    
    return actionItems;
  }

  /**
   * Find the best person to assign a task to
   */
  private async findBestAssignee(task: any, participants: User[], context: TaskAllocationContext): Promise<User> {
    let bestScore = 0;
    let bestAssignee = participants[0];
    
    for (const participant of participants) {
      const score = await this.calculateAssignmentScore(task, participant, context);
      
      if (score > bestScore) {
        bestScore = score;
        bestAssignee = participant;
      }
    }
    
    return bestAssignee;
  }

  /**
   * Calculate how well a person fits for a specific task
   */
  private async calculateAssignmentScore(task: any, user: User, context: TaskAllocationContext): Promise<number> {
    let score = 0;
    
    // 1. Skill match (40% weight)
    const skillScore = this.calculateSkillMatch(task, user, context);
    score += skillScore * 0.4;
    
    // 2. Workload balance (30% weight)
    const workloadScore = this.calculateWorkloadScore(user, context);
    score += workloadScore * 0.3;
    
    // 3. Historical performance (20% weight)
    const performanceScore = this.calculatePerformanceScore(user, context);
    score += performanceScore * 0.2;
    
    // 4. Department alignment (10% weight)
    const departmentScore = this.calculateDepartmentAlignment(task, user, context);
    score += departmentScore * 0.1;
    
    return score;
  }

  /**
   * Calculate skill match between task and user
   */
  private calculateSkillMatch(task: any, user: User, context: TaskAllocationContext): number {
    const userStats = this.historicalData.userTaskHistory[user.id];
    if (!userStats) return 0.5; // Default score for new users
    
    // Extract keywords from task description
    const taskKeywords = this.extractKeywords(task.description);
    
    let totalScore = 0;
    let keywordCount = 0;
    
    for (const keyword of taskKeywords) {
      if (userStats.skillProficiency[keyword] !== undefined) {
        totalScore += userStats.skillProficiency[keyword];
        keywordCount++;
      }
    }
    
    return keywordCount > 0 ? totalScore / keywordCount : 0.5;
  }

  /**
   * Calculate workload score (lower workload = higher score)
   */
  private calculateWorkloadScore(user: User, context: TaskAllocationContext): number {
    const userStats = this.historicalData.userTaskHistory[user.id];
    if (!userStats) return 0.5;
    
    // Normalize workload (0-1 scale, where 1 is optimal workload)
    const maxOptimalWorkload = 5; // Assume 5 tasks is optimal
    const workload = Math.min(userStats.currentWorkload / maxOptimalWorkload, 1);
    
    // Invert the score (lower workload = higher score)
    return 1 - workload;
  }

  /**
   * Calculate historical performance score
   */
  private calculatePerformanceScore(user: User, context: TaskAllocationContext): number {
    const userStats = this.historicalData.userTaskHistory[user.id];
    if (!userStats) return 0.5;
    
    // Calculate completion rate and speed
    const completionRate = userStats.completedTasks / Math.max(userStats.completedTasks + 1, 1);
    const speedScore = Math.min(24 / Math.max(userStats.averageCompletionTime, 1), 1); // 24 hours as baseline
    
    return (completionRate + speedScore) / 2;
  }

  /**
   * Calculate department alignment score
   */
  private calculateDepartmentAlignment(task: any, user: User, context: TaskAllocationContext): number {
    const userRole = this.organizationalStructure.roles.find(r => r.id === user.role);
    if (!userRole) return 0.5;
    
    const userDepartment = this.organizationalStructure.departments.find(d => d.id === userRole.departmentId);
    if (!userDepartment) return 0.5;
    
    // Check if task keywords match department responsibilities
    const taskKeywords = this.extractKeywords(task.description);
    const departmentResponsibilities = userDepartment.responsibilities.map(r => r.toLowerCase());
    
    let matches = 0;
    for (const keyword of taskKeywords) {
      if (departmentResponsibilities.some(resp => resp.includes(keyword))) {
        matches++;
      }
    }
    
    return matches / Math.max(taskKeywords.length, 1);
  }

  /**
   * Calculate task priority based on context
   */
  private async calculateTaskPriority(task: any, context: TaskAllocationContext): Promise<'low' | 'medium' | 'high' | 'urgent'> {
    let priorityScore = 0;
    
    // 1. Time-sensitive keywords (40% weight)
    const timeKeywords = ['urgent', 'asap', 'today', 'tomorrow', 'deadline', 'critical'];
    const timeScore = timeKeywords.some(keyword => 
      task.description.toLowerCase().includes(keyword)
    ) ? 1 : 0;
    priorityScore += timeScore * 0.4;
    
    // 2. Stakeholder importance (30% weight)
    const stakeholderScore = this.calculateStakeholderImportance(context);
    priorityScore += stakeholderScore * 0.3;
    
    // 3. Project phase (20% weight)
    const projectScore = this.calculateProjectPhaseScore(context);
    priorityScore += projectScore * 0.2;
    
    // 4. Resource dependency (10% weight)
    const dependencyScore = this.calculateDependencyScore(task, context);
    priorityScore += dependencyScore * 0.1;
    
    // Convert score to priority
    if (priorityScore >= 0.8) return 'urgent';
    if (priorityScore >= 0.6) return 'high';
    if (priorityScore >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * Suggest due date based on task complexity and context
   */
  private async suggestDueDate(task: any, context: TaskAllocationContext): Promise<Date> {
    const baseDate = new Date();
    
    // Simple due date logic (can be enhanced with AI)
    const priority = await this.calculateTaskPriority(task, context);
    
    let daysToAdd = 7; // Default: 1 week
    
    switch (priority) {
      case 'urgent':
        daysToAdd = 1; // Tomorrow
        break;
      case 'high':
        daysToAdd = 3; // 3 days
        break;
      case 'medium':
        daysToAdd = 7; // 1 week
        break;
      case 'low':
        daysToAdd = 14; // 2 weeks
        break;
    }
    
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    return baseDate;
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Only words longer than 3 characters
    
    // Remove common stop words
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return words.filter(word => !stopWords.includes(word));
  }

  /**
   * Calculate stakeholder importance
   */
  private calculateStakeholderImportance(context: TaskAllocationContext): number {
    // Simple logic - can be enhanced
    const participants = context.participants;
    const hasExecutives = participants.some(p => p.role === 'executive' || p.role === 'director');
    const hasManagers = participants.some(p => p.role === 'manager' || p.role === 'lead');
    
    if (hasExecutives) return 1.0;
    if (hasManagers) return 0.7;
    return 0.4;
  }

  /**
   * Calculate project phase score
   */
  private calculateProjectPhaseScore(context: TaskAllocationContext): number {
    // Simple logic - can be enhanced
    return 0.5; // Default medium priority
  }

  /**
   * Calculate dependency score
   */
  private calculateDependencyScore(task: any, context: TaskAllocationContext): number {
    // Simple logic - can be enhanced
    return 0.5; // Default medium priority
  }
}

// Export utility functions for testing
export const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  return words.filter(word => !stopWords.includes(word));
};
