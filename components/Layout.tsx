'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Settings, 
  LogOut,
  User,
  Bell,
  Search,
  Plus,
  Brain,
  Sparkles,
  Rocket,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Team Intelligence', href: '/team-intelligence', icon: Brain },
  { name: 'Meetings', href: '/meetings', icon: Calendar },
  { name: 'Summaries', href: '/summaries', icon: FileText },
  { name: 'Action Items', href: '/action-items', icon: CheckSquare },
  { name: 'Demo', href: '/demo', icon: Sparkles },
  { name: 'Product Hunt', href: '/product-hunt', icon: Rocket },
              { name: 'Settings', href: '/settings', icon: Settings },
            { name: 'Subscription', href: '/subscription', icon: CreditCard },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : (isMobile ? '-100%' : 0),
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-white/30',
          'transform transition-transform duration-300 ease-in-out',
          isMobile ? 'lg:hidden' : 'lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="text-xl font-bold text-gradient">EchoPilot</span>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  'sidebar-item w-full justify-start',
                  isActive(item.href) && 'active'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/30">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/20 transition-colors cursor-pointer">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <button 
            onClick={signOut}
            className="sidebar-item w-full justify-start mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className={cn('transition-all duration-300', isMobile ? 'lg:ml-0' : 'lg:ml-64')}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/30">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search meetings, summaries, action items..."
                  className="input-field pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-white/20 transition-colors relative">
                <Bell className="w-6 h-6 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="btn-primary px-4 py-2 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Meeting
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
