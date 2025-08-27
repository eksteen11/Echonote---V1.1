import { Meeting, ActionItem, User, Summary } from '@/types';

export interface Prediction {
  id: string;
  type: 'resource' | 'timeline' | 'risk' | 'opportunity' | 'workload';
  title: string;
  description: string;
  confidence: number; // 0-1
  probability: number; // 0-1
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
  resourceType: 'personnel' | 'budget' | 'time' | 'equipment';
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
  currentDeadline: Date;
  predictedCompletion: Date;
  confidence: number;
  riskFactors: string[];
  mitigationStrategies: string[];
}

export interface WorkloadPrediction {
  userId: string;
  currentWorkload: number;
  predictedWorkload: number;
  workloadTrend: 'increasing' | 'stable' | 'decreasing';
  burnoutRisk: 'low' | 'medium' | 'high';
  recommendations: string[];
  timeframe: Date;
}

export interface MeetingOptimization {
  id: string;
  meetingType: string;
  currentDuration: number;
  recommendedDuration: number;
  participantOptimization: string[];
  agendaOptimization: string[];
  expectedOutcome: string;
  confidence: number;
}

export class PredictiveAnalyticsEngine {
  private meetings: Meeting[] = [];
  private actionItems: ActionItem[] = [];
  private users: User[] = [];
  private summaries: Summary[] = [];
  private predictions: Prediction[] = [];
  private resourceForecasts: ResourceForecast[] = [];
  private timelinePredictions: TimelinePrediction[] = [];
  private workloadPredictions: WorkloadPrediction[] = [];

  constructor() {
    this.initializePredictions();
  }

  /**
   * Add new data to the prediction engine
   */
  async addData(meeting: Meeting, actionItems: ActionItem[], summary: Summary) {
    this.meetings.push(meeting);
    this.actionItems.push(...actionItems);
    this.summaries.push(summary);

    // Update predictions based on new data
    await this.updatePredictions();
    
    // Generate new predictions
    await this.generateNewPredictions();
  }

  /**
   * Generate comprehensive predictions
   */
  async generatePredictions(): Promise<{
    predictions: Prediction[];
    resourceForecasts: ResourceForecast[];
    timelinePredictions: TimelinePrediction[];
    workloadPredictions: WorkloadPrediction[];
    meetingOptimizations: MeetingOptimization[];
  }> {
    const predictions = await this.generateAllPredictions();
    const resourceForecasts = await this.generateResourceForecasts();
    const timelinePredictions = await this.generateTimelinePredictions();
    const workloadPredictions = await this.generateWorkloadPredictions();
    const meetingOptimizations = await this.generateMeetingOptimizations();

    return {
      predictions,
      resourceForecasts,
      timelinePredictions,
      workloadPredictions,
      meetingOptimizations
    };
  }

  /**
   * Generate all types of predictions
   */
  private async generateAllPredictions(): Promise<Prediction[]> {
    const predictions: Prediction[] = [];

    // 1. Resource predictions
    predictions.push(...await this.generateResourcePredictions());

    // 2. Timeline predictions
    predictions.push(...await this.generateTimelinePredictions());

    // 3. Risk predictions
    predictions.push(...await this.generateRiskPredictions());

    // 4. Opportunity predictions
    predictions.push(...await this.generateOpportunityPredictions());

    // 5. Workload predictions
    predictions.push(...await this.generateWorkloadPredictions());

    return predictions;
  }

  /**
   * Generate resource-related predictions
   */
  private async generateResourcePredictions(): Promise<Prediction[]> {
    const predictions: Prediction[] = [];

    // Analyze action item patterns to predict resource needs
    const upcomingDeadlines = this.actionItems.filter(item => 
      item.dueDate && 
      new Date() < item.dueDate && 
      new Date(item.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
    );

    if (upcomingDeadlines.length > 10) {
      predictions.push({
        id: `pred_${Date.now()}_${Math.random()}`,
        type: 'resource',
        title: 'High Resource Demand Predicted',
        description: `${upcomingDeadlines.length} tasks are due in the next 30 days, indicating potential resource constraints.`,
        confidence: 0.8,
        probability: 0.7,
        impact: 'high',
        timeframe: 'short_term',
        affectedUsers: [...new Set(upcomingDeadlines.map(item => item.assignee))],
        affectedDepartments: this.getDepartmentsFromUsers([...new Set(upcomingDeadlines.map(item => item.assignee))]),
        recommendations: [
          'Consider redistributing workload',
          'Prioritize tasks by business impact',
          'Evaluate need for additional resources'
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      });
    }

    return predictions;
  }

  /**
   * Generate timeline-related predictions
   */
  private async generateTimelinePredictions(): Promise<Prediction[]> {
    const predictions: Prediction[] = [];

    // Analyze meeting patterns to predict timeline issues
    const recentMeetings = this.meetings.filter(m => 
      new Date(m.startTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    );

    if (recentMeetings.length > 5) {
      const avgDuration = recentMeetings.reduce((sum, m) => sum + m.duration, 0) / recentMeetings.length;
      
      if (avgDuration > 60) {
        predictions.push({
          id: `pred_${Date.now()}_${Math.random()}`,
          type: 'timeline',
          title: 'Meeting Duration Optimization Opportunity',
          description: `Recent meetings are averaging ${Math.round(avgDuration)} minutes, above the optimal 45-60 minute range.`,
          confidence: 0.7,
          probability: 0.8,
          impact: 'medium',
          timeframe: 'immediate',
          affectedUsers: this.getUniqueParticipants(recentMeetings),
          affectedDepartments: this.getDepartmentsFromMeetings(recentMeetings),
          recommendations: [
            'Set stricter time limits for meetings',
            'Use time-boxing techniques',
            'Prepare detailed agendas in advance'
          ],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Expires in 14 days
        });
      }
    }

    return predictions;
  }

  /**
   * Generate risk-related predictions
   */
  private async generateRiskPredictions(): Promise<Prediction[]> {
    const predictions: Prediction[] = [];

    // Analyze overdue tasks to predict risks
    const overdueTasks = this.actionItems.filter(item => 
      item.dueDate && new Date() > item.dueDate && item.status !== 'completed'
    );

    if (overdueTasks.length > 3) {
      predictions.push({
        id: `pred_${Date.now()}_${Math.random()}`,
        type: 'risk',
        title: 'Task Completion Risk Detected',
        description: `${overdueTasks.length} tasks are overdue, indicating potential project delays and resource allocation issues.`,
        confidence: 0.9,
        probability: 0.8,
        impact: 'high',
        timeframe: 'immediate',
        affectedUsers: [...new Set(overdueTasks.map(item => item.assignee))],
        affectedDepartments: this.getDepartmentsFromUsers([...new Set(overdueTasks.map(item => item.assignee))]),
        recommendations: [
          'Review and reprioritize overdue tasks',
          'Assess resource availability',
          'Communicate delays to stakeholders',
          'Implement catch-up plans'
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Expires in 3 days
      });
    }

    // Analyze meeting effectiveness trends
    const lowEffectivenessMeetings = this.meetings.filter(m => {
      const actionItems = this.actionItems.filter(item => item.meetingId === m.id);
      return actionItems.length < 2; // Low action item output
    });

    if (lowEffectivenessMeetings.length > 5) {
      predictions.push({
        id: `pred_${Date.now()}_${Math.random()}`,
        type: 'risk',
        title: 'Meeting Effectiveness Declining',
        description: `${lowEffectivenessMeetings.length} recent meetings produced few action items, indicating declining meeting productivity.`,
        confidence: 0.6,
        probability: 0.7,
        impact: 'medium',
        timeframe: 'short_term',
        affectedUsers: this.getUniqueParticipants(lowEffectivenessMeetings),
        affectedDepartments: this.getDepartmentsFromMeetings(lowEffectivenessMeetings),
        recommendations: [
          'Review meeting formats and agendas',
          'Implement meeting effectiveness metrics',
          'Provide facilitation training',
          'Consider canceling low-value meetings'
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      });
    }

    return predictions;
  }

  /**
   * Generate opportunity-related predictions
   */
  private async generateOpportunityPredictions(): Promise<Prediction[]> {
    const predictions: Prediction[] = [];

    // Analyze successful meeting patterns
    const successfulMeetings = this.meetings.filter(m => {
      const actionItems = this.actionItems.filter(item => item.meetingId === m.id);
      return actionItems.length >= 3 && m.duration <= 60; // High output, reasonable duration
    });

    if (successfulMeetings.length > 3) {
      predictions.push({
        id: `pred_${Date.now()}_${Math.random()}`,
        type: 'opportunity',
        title: 'High-Performance Meeting Pattern Identified',
        description: `${successfulMeetings.length} meetings achieved high output with optimal duration, creating a replicable success pattern.`,
        confidence: 0.8,
        probability: 0.9,
        impact: 'medium',
        timeframe: 'immediate',
        affectedUsers: this.getUniqueParticipants(successfulMeetings),
        affectedDepartments: this.getDepartmentsFromMeetings(successfulMeetings),
        recommendations: [
          'Document successful meeting format',
          'Train other teams on this approach',
          'Standardize agenda templates',
          'Share best practices across organization'
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Expires in 30 days
      });
    }

    return predictions;
  }

  /**
   * Generate workload-related predictions
   */
  private async generateWorkloadPredictions(): Promise<Prediction[]> {
    const predictions: Prediction[] = [];

    // Analyze individual workload patterns
    const userWorkloads = this.calculateUserWorkloads();
    
    for (const [userId, workload] of Object.entries(userWorkloads)) {
      if (workload.current > 8) { // High current workload
        predictions.push({
          id: `pred_${Date.now()}_${Math.random()}`,
          type: 'workload',
          title: 'High Workload Risk for User',
          description: `User has ${workload.current} active tasks, which may lead to burnout or missed deadlines.`,
          confidence: 0.7,
          probability: 0.6,
          impact: 'medium',
          timeframe: 'short_term',
          affectedUsers: [userId],
          affectedDepartments: this.getDepartmentsFromUsers([userId]),
          recommendations: [
            'Redistribute some tasks to other team members',
            'Extend deadlines for non-urgent tasks',
            'Provide additional support or resources',
            'Schedule workload review meeting'
          ],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // Expires in 5 days
        });
      }
    }

    return predictions;
  }

  /**
   * Generate resource forecasts
   */
  private async generateResourceForecasts(): Promise<ResourceForecast[]> {
    const forecasts: ResourceForecast[] = [];

    // Personnel forecast
    const upcomingTasks = this.actionItems.filter(item => 
      item.dueDate && 
      new Date() < item.dueDate && 
      new Date(item.dueDate) <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Next 14 days
    );

    const currentCapacity = this.users.length;
    const predictedDemand = Math.ceil(upcomingTasks.length / 3); // Assume 3 tasks per person per day
    const capacityGap = Math.max(0, predictedDemand - currentCapacity);

    if (capacityGap > 0) {
      forecasts.push({
        id: `forecast_${Date.now()}_${Math.random()}`,
        resourceType: 'personnel',
        currentCapacity,
        predictedDemand,
        capacityGap,
        timeframe: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        confidence: 0.7,
        recommendations: [
          'Consider temporary contractors',
          'Redistribute workload across team',
          'Extend non-critical deadlines',
          'Prioritize high-impact tasks'
        ]
      });
    }

    // Time forecast
    const totalTaskHours = upcomingTasks.length * 2; // Assume 2 hours per task
    const availableHours = currentCapacity * 8 * 10; // 8 hours/day * 10 working days
    const timeGap = Math.max(0, totalTaskHours - availableHours);

    if (timeGap > 0) {
      forecasts.push({
        id: `forecast_${Date.now()}_${Math.random()}`,
        resourceType: 'time',
        currentCapacity: availableHours,
        predictedDemand: totalTaskHours,
        capacityGap: timeGap,
        timeframe: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        confidence: 0.8,
        recommendations: [
          'Extend project timelines',
          'Reduce scope of non-critical tasks',
          'Increase team size temporarily',
          'Implement overtime or weekend work'
        ]
      });
    }

    return forecasts;
  }

  /**
   * Generate timeline predictions
   */
  private async generateTimelinePredictions(): Promise<TimelinePrediction[]> {
    const predictions: TimelinePrediction[] = [];

    // Group action items by project (simplified - using meeting as project)
    const projectGroups = this.groupActionItemsByProject();
    
    for (const [projectId, items] of Object.entries(projectGroups)) {
      const completedItems = items.filter(item => item.status === 'completed');
      const pendingItems = items.filter(item => item.status === 'pending');
      
      if (pendingItems.length > 0) {
        const completionRate = completedItems.length / (completedItems.length + pendingItems.length);
        const avgCompletionTime = this.calculateAverageCompletionTime(completedItems);
        
        // Predict completion time based on historical data
        const predictedCompletion = new Date(Date.now() + (pendingItems.length * avgCompletionTime * 24 * 60 * 60 * 1000));
        
        predictions.push({
          id: `timeline_${Date.now()}_${Math.random()}`,
          projectId,
          currentDeadline: this.getProjectDeadline(projectId),
          predictedCompletion,
          confidence: Math.min(0.9, completionRate + 0.3), // Base confidence on completion rate
          riskFactors: this.identifyTimelineRiskFactors(items),
          mitigationStrategies: this.generateTimelineMitigationStrategies(items)
        });
      }
    }

    return predictions;
  }

  /**
   * Generate workload predictions
   */
  private async generateWorkloadPredictions(): Promise<WorkloadPrediction[]> {
    const predictions: WorkloadPrediction[] = [];

    const userWorkloads = this.calculateUserWorkloads();
    
    for (const [userId, workload] of Object.entries(userWorkloads)) {
      const trend = this.calculateWorkloadTrend(userId);
      const burnoutRisk = this.calculateBurnoutRisk(workload);
      
      predictions.push({
        userId,
        currentWorkload: workload.current,
        predictedWorkload: workload.predicted,
        workloadTrend: trend,
        burnoutRisk,
        recommendations: this.generateWorkloadRecommendations(workload, burnoutRisk),
        timeframe: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next week
      });
    }

    return predictions;
  }

  /**
   * Generate meeting optimizations
   */
  private async generateMeetingOptimizations(): Promise<MeetingOptimization[]> {
    const optimizations: MeetingOptimization[] = [];

    // Analyze meeting types and their effectiveness
    const meetingTypes = this.analyzeMeetingTypes();
    
    for (const [type, data] of Object.entries(meetingTypes)) {
      if (data.avgDuration > 45) { // Meetings running long
        optimizations.push({
          id: `opt_${Date.now()}_${Math.random()}`,
          meetingType: type,
          currentDuration: data.avgDuration,
          recommendedDuration: Math.max(30, data.avgDuration * 0.8), // Reduce by 20%
          participantOptimization: this.optimizeParticipants(data.participants),
          agendaOptimization: this.optimizeAgenda(data.actionItems),
          expectedOutcome: `Reduce meeting duration by ${Math.round(data.avgDuration * 0.2)} minutes while maintaining effectiveness`,
          confidence: 0.7
        });
      }
    }

    return optimizations;
  }

  /**
   * Calculate user workloads
   */
  private calculateUserWorkloads(): Record<string, { current: number; predicted: number }> {
    const workloads: Record<string, { current: number; predicted: number }> = {};
    
    for (const user of this.users) {
      const currentTasks = this.actionItems.filter(item => 
        item.assignee === user.id && item.status === 'pending'
      ).length;
      
      const upcomingTasks = this.actionItems.filter(item => 
        item.assignee === user.id && 
        item.dueDate && 
        new Date() < item.dueDate && 
        new Date(item.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ).length;
      
      workloads[user.id] = {
        current: currentTasks,
        predicted: currentTasks + upcomingTasks
      };
    }
    
    return workloads;
  }

  /**
   * Calculate workload trend for a user
   */
  private calculateWorkloadTrend(userId: string): 'increasing' | 'stable' | 'decreasing' {
    const recentTasks = this.actionItems.filter(item => 
      item.assignee === userId && 
      new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const previousTasks = this.actionItems.filter(item => 
      item.assignee === userId && 
      new Date(item.createdAt) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) &&
      new Date(item.createdAt) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    if (recentTasks > previousTasks * 1.2) return 'increasing';
    if (recentTasks < previousTasks * 0.8) return 'decreasing';
    return 'stable';
  }

  /**
   * Calculate burnout risk
   */
  private calculateBurnoutRisk(workload: { current: number; predicted: number }): 'low' | 'medium' | 'high' {
    const totalWorkload = workload.predicted;
    
    if (totalWorkload <= 5) return 'low';
    if (totalWorkload <= 8) return 'medium';
    return 'high';
  }

  /**
   * Generate workload recommendations
   */
  private generateWorkloadRecommendations(workload: { current: number; predicted: number }, burnoutRisk: string): string[] {
    const recommendations: string[] = [];
    
    if (burnoutRisk === 'high') {
      recommendations.push('Immediate workload reduction required');
      recommendations.push('Consider task delegation to other team members');
      recommendations.push('Schedule workload review with manager');
    } else if (burnoutRisk === 'medium') {
      recommendations.push('Monitor workload closely');
      recommendations.push('Consider extending non-urgent deadlines');
    } else {
      recommendations.push('Workload is manageable');
      recommendations.push('Continue current pace');
    }
    
    return recommendations;
  }

  /**
   * Group action items by project
   */
  private groupActionItemsByProject(): Record<string, ActionItem[]> {
    const groups: Record<string, ActionItem[]> = {};
    
    for (const item of this.actionItems) {
      if (!groups[item.meetingId]) groups[item.meetingId] = [];
      groups[item.meetingId].push(item);
    }
    
    return groups;
  }

  /**
   * Calculate average completion time
   */
  private calculateAverageCompletionTime(completedItems: ActionItem[]): number {
    if (completedItems.length === 0) return 3; // Default 3 days
    
    let totalDays = 0;
    let count = 0;
    
    for (const item of completedItems) {
      if (item.createdAt && item.updatedAt) {
        const days = Math.ceil((item.updatedAt.getTime() - item.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += days;
        count++;
      }
    }
    
    return count > 0 ? totalDays / count : 3;
  }

  /**
   * Get project deadline
   */
  private getProjectDeadline(projectId: string): Date {
    const items = this.actionItems.filter(item => item.meetingId === projectId);
    const latestDueDate = items.reduce((latest, item) => {
      if (item.dueDate && item.dueDate > latest) return item.dueDate;
      return latest;
    }, new Date(0));
    
    return latestDueDate.getTime() > 0 ? latestDueDate : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  /**
   * Identify timeline risk factors
   */
  private identifyTimelineRiskFactors(items: ActionItem[]): string[] {
    const riskFactors: string[] = [];
    
    const overdueItems = items.filter(item => 
      item.dueDate && new Date() > item.dueDate && item.status !== 'completed'
    );
    
    if (overdueItems.length > 0) {
      riskFactors.push(`${overdueItems.length} overdue tasks`);
    }
    
    const highPriorityItems = items.filter(item => item.priority === 'high' || item.priority === 'urgent');
    if (highPriorityItems.length > 3) {
      riskFactors.push('High concentration of high-priority tasks');
    }
    
    return riskFactors;
  }

  /**
   * Generate timeline mitigation strategies
   */
  private generateTimelineMitigationStrategies(items: ActionItem[]): string[] {
    const strategies: string[] = [];
    
    const overdueItems = items.filter(item => 
      item.dueDate && new Date() > item.dueDate && item.status !== 'completed'
    );
    
    if (overdueItems.length > 0) {
      strategies.push('Immediately address overdue tasks');
      strategies.push('Reassess priorities and deadlines');
    }
    
    strategies.push('Implement daily progress tracking');
    strategies.push('Consider additional resources if needed');
    
    return strategies;
  }

  /**
   * Analyze meeting types
   */
  private analyzeMeetingTypes(): Record<string, { avgDuration: number; participants: string[]; actionItems: number }> {
    const types: Record<string, { avgDuration: number; participants: string[]; actionItems: number }> = {};
    
    for (const meeting of this.meetings) {
      const type = meeting.type || 'general';
      const actionItems = this.actionItems.filter(item => item.meetingId === meeting.id).length;
      
      if (!types[type]) {
        types[type] = { avgDuration: 0, participants: [], actionItems: 0 };
      }
      
      types[type].avgDuration = (types[type].avgDuration + meeting.duration) / 2;
      types[type].participants.push(...meeting.participants);
      types[type].actionItems = Math.max(types[type].actionItems, actionItems);
    }
    
    return types;
  }

  /**
   * Optimize participants for a meeting type
   */
  private optimizeParticipants(participants: string[]): string[] {
    // Simple optimization - limit to key stakeholders
    if (participants.length > 8) {
      return participants.slice(0, 8); // Limit to 8 participants
    }
    return participants;
  }

  /**
   * Optimize agenda based on action items
   */
  private optimizeAgenda(actionItems: number): string[] {
    const optimizations: string[] = [];
    
    if (actionItems === 0) {
      optimizations.push('Consider if meeting is necessary');
      optimizations.push('Focus on information sharing only');
    } else if (actionItems > 5) {
      optimizations.push('Break into multiple focused meetings');
      optimizations.push('Prioritize top 3 action items');
    }
    
    return optimizations;
  }

  /**
   * Get unique participants from meetings
   */
  private getUniqueParticipants(meetings: Meeting[]): string[] {
    const participants = new Set<string>();
    
    for (const meeting of meetings) {
      meeting.participants.forEach(p => participants.add(p));
    }
    
    return Array.from(participants);
  }

  /**
   * Get departments from meetings
   */
  private getDepartmentsFromMeetings(meetings: Meeting[]): string[] {
    // Simplified - return common departments
    return ['Engineering', 'Product', 'Sales', 'Marketing'];
  }

  /**
   * Get departments from users
   */
  private getDepartmentsFromUsers(userIds: string[]): string[] {
    // Simplified - return common departments
    return ['Engineering', 'Product', 'Sales', 'Marketing'];
  }

  /**
   * Update predictions based on new data
   */
  private async updatePredictions() {
    // Remove expired predictions
    this.predictions = this.predictions.filter(p => new Date() < p.expiresAt);
    
    // Update confidence scores based on new data
    for (const prediction of this.predictions) {
      prediction.confidence = Math.min(0.95, prediction.confidence + 0.05);
    }
  }

  /**
   * Generate new predictions
   */
  private async generateNewPredictions() {
    // This would trigger new prediction generation
    // For now, it's a placeholder
  }

  /**
   * Initialize basic predictions
   */
  private initializePredictions() {
    this.predictions = [
      {
        id: 'pred_initial',
        type: 'resource',
        title: 'Initial System Setup',
        description: 'Predictive analytics system is now active and learning from your data.',
        confidence: 0.5,
        probability: 0.8,
        impact: 'low',
        timeframe: 'immediate',
        affectedUsers: [],
        affectedDepartments: [],
        recommendations: ['Continue using the system to improve predictions'],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];
  }
}

// Export utility functions
export const calculatePredictionConfidence = (dataPoints: number, accuracy: number): number => {
  // Simple confidence calculation based on data volume and accuracy
  return Math.min(0.95, (dataPoints / 100) * accuracy + 0.3);
};
