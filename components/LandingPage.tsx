"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Sparkles, 
  Rocket, 
  ArrowRight, 
  Play,
  Users,
  Target,
  Zap,
  Shield,
  Globe,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const router = useRouter();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Task Allocation",
      description: "Automatically assign tasks based on skills, workload, and organizational context"
    },
    {
      icon: Calendar,
      title: "Cross-Meeting Intelligence",
      description: "Connect insights across meetings and build institutional memory"
    },
    {
      icon: Target,
      title: "Predictive Analytics",
      description: "Anticipate team needs and optimize workflows proactively"
    },
    {
      icon: Shield,
      title: "Open Source AI",
      description: "Zero API costs with privacy-first local processing"
    }
  ];

  const stats = [
    { number: "50%", label: "Faster Task Completion" },
    { number: "3x", label: "Better Meeting ROI" },
    { number: "100%", label: "Privacy Guaranteed" },
    { number: "24/7", label: "AI Intelligence" }
  ];

  const handleGetStarted = () => {
    router.push('/demo');
  };

  const handleTryDemo = () => {
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">EP</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                EchoPilot
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">About</a>
              <button 
                onClick={handleTryDemo}
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Try Demo
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/auth')}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Meetings into
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> Actionable Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              EchoPilot is the world's first Team Intelligence Platform that goes beyond simple meeting transcription 
              to provide comprehensive AI-powered insights and predictive analytics.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-200 flex items-center space-x-2 hover:scale-105"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={handleTryDemo}
                className="border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all duration-200 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Teams Choose EchoPilot
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for modern teams who want to work smarter, not harder
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Team's Intelligence?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of teams who are already working smarter with EchoPilot
            </p>
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto hover:scale-105"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EP</span>
                </div>
                <span className="text-lg font-bold">EchoPilot</span>
              </div>
              <p className="text-gray-400">
                Transforming meetings into actionable intelligence with AI-powered insights.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/demo" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/product-hunt" className="hover:text-white transition-colors">Product Hunt</a></li>
                <li><a href="/settings" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EchoPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
