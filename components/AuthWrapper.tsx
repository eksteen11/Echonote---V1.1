"use client";

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import AuthPage from './AuthPage';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Meetings from './Meetings';
import ActionItems from './ActionItems';
import Summaries from './Summaries';
import Settings from './Settings';
import SubscriptionPage from './SubscriptionPage';
import TeamIntelligenceDashboard from './TeamIntelligenceDashboard';
import AdvancedFeaturesDemo from './AdvancedFeaturesDemo';
import ProductHuntDemo from './ProductHuntDemo';

const AuthWrapper: React.FC = () => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">EP</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            EchoPilot
          </h1>
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Render different content based on the current route
  const renderContent = () => {
    switch (pathname) {
      case '/':
        return <Dashboard />;
      case '/meetings':
        return <Meetings />;
      case '/action-items':
        return <ActionItems />;
      case '/summaries':
        return <Summaries />;
      case '/settings':
        return <Settings />;
      case '/subscription':
        return <SubscriptionPage />;
      case '/team-intelligence':
        return <TeamIntelligenceDashboard />;
      case '/demo':
        return <AdvancedFeaturesDemo />;
      case '/product-hunt':
        return <ProductHuntDemo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default AuthWrapper;
