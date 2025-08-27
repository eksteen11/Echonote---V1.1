'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Calendar, 
  Mic, 
  FileText, 
  User, 
  Shield, 
  Key,
  Globe,
  Smartphone,
  Mail,
  Slack,
  Zap,
  Save,
  ToggleLeft,
  ToggleRight,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserPreferences } from '@/types';

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

export default function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    userId: 'user_1',
    notifications: {
      email: true,
      push: true,
      slack: false,
    },
    calendar: {
      autoSync: true,
      defaultDuration: 30,
      workingHours: {
        start: '09:00',
        end: '17:00',
      },
    },
    transcription: {
      autoTranscribe: true,
      language: 'en',
      confidenceThreshold: 0.8,
    },
    summary: {
      autoGenerate: true,
      includeKeyPoints: true,
      includeActionItems: true,
      maxLength: 500,
    },
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'transcription', name: 'Transcription', icon: Mic },
    { id: 'summary', name: 'AI Summary', icon: FileText },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Zap },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message
  };

  const updatePreference = (section: keyof UserPreferences, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Customize your EchoPilot experience</p>
      </motion.div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'sidebar-item w-full justify-start',
                      activeTab === tab.id && 'active'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="card">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Notification Preferences</h2>
                </div>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Email Notifications</h3>
                        <p className="text-sm text-slate-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference('notifications', 'email', !preferences.notifications.email)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ backgroundColor: preferences.notifications.email ? '#0ea5e9' : '#cbd5e1' }}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          preferences.notifications.email ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Push Notifications</h3>
                        <p className="text-sm text-slate-600">Receive push notifications on your device</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference('notifications', 'push', !preferences.notifications.push)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ backgroundColor: preferences.notifications.push ? '#0ea5e9' : '#cbd5e1' }}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          preferences.notifications.push ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Slack Notifications */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Slack className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Slack Notifications</h3>
                        <p className="text-sm text-slate-600">Send notifications to Slack channels</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference('notifications', 'slack', !preferences.notifications.slack)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ backgroundColor: preferences.notifications.slack ? '#0ea5e9' : '#cbd5e1' }}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          preferences.notifications.slack ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Calendar Settings</h2>
                </div>

                <div className="space-y-6">
                  {/* Auto Sync */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Auto Sync</h3>
                        <p className="text-sm text-slate-600">Automatically sync with your calendar</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference('calendar', 'autoSync', !preferences.calendar.autoSync)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ backgroundColor: preferences.calendar.autoSync ? '#0ea5e9' : '#cbd5e1' }}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          preferences.calendar.autoSync ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Default Duration */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Default Meeting Duration (minutes)
                    </label>
                    <select
                      value={preferences.calendar.defaultDuration}
                      onChange={(e) => updatePreference('calendar', 'defaultDuration', parseInt(e.target.value))}
                      className="input-field max-w-xs"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  {/* Working Hours */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={preferences.calendar.workingHours.start}
                        onChange={(e) => updatePreference('calendar', 'workingHours', {
                          ...preferences.calendar.workingHours,
                          start: e.target.value
                        })}
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={preferences.calendar.workingHours.end}
                        onChange={(e) => updatePreference('calendar', 'workingHours', {
                          ...preferences.calendar.workingHours,
                          end: e.target.value
                        })}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transcription Tab */}
            {activeTab === 'transcription' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Mic className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Transcription Settings</h2>
                </div>

                <div className="space-y-6">
                  {/* Auto Transcribe */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Auto Transcribe</h3>
                        <p className="text-sm text-slate-600">Automatically transcribe meetings</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference('transcription', 'autoTranscribe', !preferences.transcription.autoTranscribe)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ backgroundColor: preferences.transcription.autoTranscribe ? '#0ea5e9' : '#cbd5e1' }}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          preferences.transcription.autoTranscribe ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Language */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Language
                    </label>
                    <select
                      value={preferences.transcription.language}
                      onChange={(e) => updatePreference('transcription', 'language', e.target.value)}
                      className="input-field max-w-xs"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>

                  {/* Confidence Threshold */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Confidence Threshold: {preferences.transcription.confidenceThreshold}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.1"
                      value={preferences.transcription.confidenceThreshold}
                      onChange={(e) => updatePreference('transcription', 'confidenceThreshold', parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Lower accuracy</span>
                      <span>Higher accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-slate-900">AI Summary Settings</h2>
                </div>

                <div className="space-y-6">
                  {/* Auto Generate */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Auto Generate</h3>
                        <p className="text-sm text-slate-600">Automatically generate summaries after meetings</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference('summary', 'autoGenerate', !preferences.summary.autoGenerate)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ backgroundColor: preferences.summary.autoGenerate ? '#0ea5e9' : '#cbd5e1' }}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          preferences.summary.autoGenerate ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Include Key Points */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Include Key Points</h3>
                        <p className="text-sm text-slate-600">Extract and highlight key discussion points</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference('summary', 'includeKeyPoints', !preferences.summary.includeKeyPoints)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ backgroundColor: preferences.summary.includeKeyPoints ? '#0ea5e9' : '#cbd5e1' }}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          preferences.summary.includeKeyPoints ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Include Action Items */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Include Action Items</h3>
                        <p className="text-sm text-slate-600">Extract action items and assignments</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreference('summary', 'includeActionItems', !preferences.summary.includeActionItems)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      style={{ backgroundColor: preferences.summary.includeActionItems ? '#0ea5e9' : '#cbd5e1' }}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          preferences.summary.includeActionItems ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  {/* Max Length */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Maximum Summary Length (words)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="1000"
                      step="50"
                      value={preferences.summary.maxLength}
                      onChange={(e) => updatePreference('summary', 'maxLength', parseInt(e.target.value))}
                      className="input-field max-w-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Profile Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@company.com"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Company
                    </label>
                    <input
                      type="text"
                      defaultValue="TechCorp Inc."
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Role
                    </label>
                    <input
                      type="text"
                      defaultValue="Product Manager"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Security Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="input-field"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-slate-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button className="btn-secondary">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Integrations</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Google Calendar</h3>
                        <p className="text-sm text-slate-600">Sync meetings and events</p>
                      </div>
                    </div>
                    <button className="btn-primary">
                      Connect
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Slack className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Slack</h3>
                        <p className="text-sm text-slate-600">Send notifications and updates</p>
                      </div>
                    </div>
                    <button className="btn-secondary">
                      Connect
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-600" />
                      <div>
                        <h3 className="font-medium text-slate-900">Email (SMTP)</h3>
                        <p className="text-sm text-slate-600">Send email notifications</p>
                      </div>
                    </div>
                    <button className="btn-secondary">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-slate-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
