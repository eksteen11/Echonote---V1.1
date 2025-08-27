"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  Calendar,
  Target,
  BarChart3,
  Zap,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Play,
  Pause,
  Mic,
  FileText,
  Sparkles,
  Star,
  Rocket,
  Shield,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductHuntDemo: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'demo' | 'pricing'>('hero');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Task Allocation",
      description: "Automatically assigns tasks based on skills, workload, and context",
      color: "from-purple-500 to-pink-500",
      demo: "Smart task assignment using organizational intelligence"
    },
    {
      icon: TrendingUp,
      title: "Cross-Meeting Intelligence",
      description: "Connects insights across meetings and builds institutional memory",
      color: "from-blue-500 to-cyan-500",
      demo: "Pattern recognition and trend analysis"
    },
    {
      icon: Target,
      title: "Predictive Analytics",
      description: "Anticipates needs and optimizes team workflows proactively",
      color: "from-green-500 to-emerald-500",
      demo: "Resource forecasting and risk detection"
    },
    {
      icon: Shield,
      title: "Open Source AI",
      description: "Zero API costs with privacy-first local processing",
      color: "from-orange-500 to-red-500",
      demo: "Local transcription and summary generation"
    }
  ];

  // Simulate real-time transcription
  const startTranscriptionDemo = () => {
    setIsTranscribing(true);
    setTranscriptText('');
    
    const demoTexts = [
      "Welcome to our quarterly planning meeting.",
      "Today we'll discuss the Q4 roadmap and budget allocation.",
      "I think we should focus on the mobile app development first.",
      "That's a great point, Sarah. What's your timeline estimate?",
      "We need to allocate at least 3 developers to this project.",
      "I agree, and we should also consider the marketing budget.",
      "Let's set a deadline for the end of November.",
      "Perfect, I'll create action items for everyone."
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < demoTexts.length) {
        setTranscriptText(prev => prev + (prev ? ' ' : '') + demoTexts[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTranscribing(false);
      }
    }, 1500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10"></div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        />
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl"
        />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-6">
              <Rocket className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">Launching on Product Hunt</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              EchoPilot
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The world's first <span className="font-semibold text-primary-600">Team Intelligence Platform</span> that transforms meetings into actionable insights and predictive analytics
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setActiveSection('demo')}
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Try Live Demo
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm border border-white/30 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setActiveSection('features')}
              >
                <Eye className="w-5 h-5 inline mr-2" />
                See Features
              </motion.button>
            </div>
          </motion.div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br mx-auto mb-4 flex items-center justify-center",
                  feature.color
                )}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {activeSection === 'features' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Revolutionary AI Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                EchoPilot goes beyond simple meeting transcription to provide comprehensive team intelligence
              </p>
            </div>

            <div className="space-y-20">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className={cn(
                    "flex flex-col lg:flex-row items-center gap-12",
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  )}
                >
                  <div className="flex-1">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl bg-gradient-to-br mb-6 flex items-center justify-center",
                      feature.color
                    )}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 font-medium">Demo:</p>
                      <p className="text-gray-700">{feature.demo}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-8 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl bg-gradient-to-br mx-auto mb-4 flex items-center justify-center",
                          feature.color
                        )}>
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-600">Interactive Demo</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Live Demo Section */}
      {activeSection === 'demo' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Experience EchoPilot Live
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                See how our AI transforms meetings in real-time
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Transcription Demo */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Live Transcription</h3>
                    <p className="text-gray-600">Web Speech API powered</p>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    onClick={startTranscriptionDemo}
                    disabled={isTranscribing}
                    className={cn(
                      "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300",
                      isTranscribing
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg"
                    )}
                  >
                    {isTranscribing ? (
                      <>
                        <Pause className="w-5 h-5 inline mr-2" />
                        Transcribing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 inline mr-2" />
                        Start Demo
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 h-32 overflow-y-auto">
                  {transcriptText ? (
                    <p className="text-gray-700 text-sm leading-relaxed">{transcriptText}</p>
                  ) : (
                    <p className="text-gray-400 text-sm">Click "Start Demo" to see live transcription...</p>
                  )}
                </div>
              </div>

              {/* AI Insights Demo */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">AI Insights</h3>
                    <p className="text-gray-600">Real-time analysis</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">Pattern Detected</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Budget discussions appear in 80% of meetings - consider dedicated budget sessions
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Efficiency Opportunity</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Meetings could be 20% shorter with better agenda management
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">Resource Risk</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Multiple high-priority projects may compete for the same resources
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-12 py-4 rounded-xl font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setActiveSection('pricing')}
              >
                <Star className="w-6 h-6 inline mr-3" />
                Get Started Today
              </motion.button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Pricing Section */}
      {activeSection === 'pricing' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Start free and scale as your team grows
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-8 relative"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Starter</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-2">$29</div>
                  <div className="text-gray-600">per month</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Up to 10 users</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">AI transcription</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Smart summaries</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Basic analytics</span>
                  </li>
                </ul>

                <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  Start Free Trial
                </button>
              </motion.div>

              {/* Professional Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-2xl p-8 relative transform scale-105"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Professional</h3>
                  <div className="text-4xl font-bold mb-2">$49</div>
                  <div className="text-primary-100">per month</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Up to 50 users</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Advanced AI insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Predictive analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Team intelligence</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Priority support</span>
                  </li>
                </ul>

                <button className="w-full bg-white text-primary-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Start Free Trial
                </button>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-8 relative"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-2">$79</div>
                  <div className="text-gray-600">per month</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Unlimited users</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Custom AI models</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Advanced security</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">White-label options</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                </ul>

                <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  Contact Sales
                </button>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mt-16">
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>GDPR Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Enterprise Security</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 flex gap-2">
          {[
            { id: 'hero', label: 'Home', icon: Rocket },
            { id: 'features', label: 'Features', icon: Star },
            { id: 'demo', label: 'Demo', icon: Play },
            { id: 'pricing', label: 'Pricing', icon: Target }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeSection === item.id
                  ? "bg-primary-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductHuntDemo;
