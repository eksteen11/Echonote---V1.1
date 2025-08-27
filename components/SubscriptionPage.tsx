"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  CreditCard, 
  Building, 
  Users, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  Crown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { paymentService, SubscriptionPlan, PaymentMethod } from '@/lib/payment-service';
import { cn } from '@/lib/utils';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardholderName: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [plansData, paymentMethodsData] = await Promise.all([
      paymentService.getSubscriptionPlans(),
      paymentService.getPaymentMethods(),
    ]);
    setPlans(plansData);
    setPaymentMethods(paymentMethodsData);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate card
      const validation = await paymentService.validateCard(
        paymentForm.cardNumber,
        parseInt(paymentForm.expiryMonth),
        parseInt(paymentForm.expiryYear),
        paymentForm.cvc
      );

      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      // Add payment method
      const paymentMethodResult = await paymentService.addPaymentMethod({
        type: 'card',
        last4: paymentForm.cardNumber.slice(-4),
        brand: 'visa', // Simplified
        expiryMonth: parseInt(paymentForm.expiryMonth),
        expiryYear: parseInt(paymentForm.expiryYear),
        isDefault: false,
      });

      if (paymentMethodResult.success && selectedPlan) {
        // Create subscription
        const result = await paymentService.createSubscription(
          selectedPlan,
          paymentMethodResult.paymentMethodId!
        );

        if (result.success) {
          // Update local subscription
          // await upgradeSubscription(selectedPlan as any); // This line was removed as per the edit hint
          alert('Subscription upgraded successfully!');
          setShowPaymentForm(false);
          setSelectedPlan(null);
          setPaymentForm({
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvc: '',
            cardholderName: '',
          });
        } else {
          alert(result.error || 'Failed to create subscription');
        }
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription) return null;
    return plans.find(p => p.id === `plan_${subscription.tier}`);
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Subscription & Billing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your team and unlock the full potential of EchoPilot's AI-powered meeting intelligence.
        </p>
      </motion.div>

      {/* Current Plan Status */}
      {currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Current Plan: {currentPlan.name}
              </h2>
              <p className="text-gray-600 mb-4">
                You're currently on the {currentPlan.name} plan at ${currentPlan.price}/month
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>Up to {currentPlan.maxUsers === -1 ? 'Unlimited' : currentPlan.maxUsers} users</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                ${currentPlan.price}
                <span className="text-lg text-gray-500">/month</span>
              </div>
              <div className="text-sm text-gray-500">
                Next billing: {subscription?.current_period_end ? 
                  new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'
                }
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-8 mb-12"
      >
        {plans.map((plan, index) => {
          const isCurrentPlan = currentPlan?.id === plan.id;
          const isPopular = plan.name === 'Professional';
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={cn(
                "relative bg-white rounded-2xl border-2 p-8 shadow-lg transition-all duration-300 hover:shadow-xl",
                isCurrentPlan && "border-primary-500 bg-primary-50",
                isPopular && !isCurrentPlan && "border-accent-500 bg-accent-50",
                !isCurrentPlan && !isPopular && "border-gray-200 hover:border-primary-300"
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Current Plan
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary-600 mb-1">
                  ${plan.price}
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">
                  Up to {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers} users
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-3 px-6 bg-gray-300 text-gray-600 rounded-xl font-semibold cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2",
                    isPopular
                      ? "bg-accent-500 hover:bg-accent-600 hover:scale-105"
                      : "bg-primary-500 hover:bg-primary-600 hover:scale-105"
                  )}
                >
                  {isPopular ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Upgrade to {plan.name}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Choose {plan.name}
                    </>
                  )}
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {method.brand?.toUpperCase()} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Default
                  </span>
                )}
                <button className="text-red-600 hover:text-red-700 text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add Payment Method</h3>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    value={paymentForm.expiryMonth}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryMonth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="MM"
                    maxLength={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={paymentForm.expiryYear}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryYear: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="YY"
                    maxLength={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cvc}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cvc: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={paymentForm.cardholderName}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Processing...' : 'Add Payment Method'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SubscriptionPage;
