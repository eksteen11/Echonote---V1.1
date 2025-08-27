export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxUsers: number;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  dueDate: string;
  paidAt?: string;
  description: string;
}

export class MockPaymentService {
  private paymentMethods: PaymentMethod[] = [];
  private invoices: Invoice[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock payment methods
    this.paymentMethods = [
      {
        id: 'pm_1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
      {
        id: 'pm_2',
        type: 'card',
        last4: '5555',
        brand: 'mastercard',
        expiryMonth: 8,
        expiryYear: 2026,
        isDefault: false,
      },
    ];

    // Mock invoices
    this.invoices = [
      {
        id: 'inv_1',
        amount: 49.00,
        currency: 'USD',
        status: 'paid',
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Professional Plan - Monthly',
      },
      {
        id: 'inv_2',
        amount: 49.00,
        currency: 'USD',
        status: 'pending',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Professional Plan - Monthly',
      },
    ];
  }

  // Get available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return [
      {
        id: 'plan_starter',
        name: 'Starter',
        price: 29.00,
        currency: 'USD',
        interval: 'month',
        features: [
          'Up to 10 users',
          'AI transcription',
          'Smart summaries',
          'Basic analytics',
          'Email support',
        ],
        maxUsers: 10,
      },
      {
        id: 'plan_professional',
        name: 'Professional',
        price: 49.00,
        currency: 'USD',
        interval: 'month',
        features: [
          'Up to 50 users',
          'Advanced AI insights',
          'Predictive analytics',
          'Team intelligence',
          'Priority support',
          'Custom integrations',
        ],
        maxUsers: 50,
      },
      {
        id: 'plan_enterprise',
        name: 'Enterprise',
        price: 79.00,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited users',
          'Custom AI models',
          'Advanced security',
          'White-label options',
          'Dedicated support',
          'SLA guarantee',
        ],
        maxUsers: -1, // Unlimited
      },
    ];
  }

  // Create a subscription
  async createSubscription(planId: string, paymentMethodId: string): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful subscription creation
    if (planId && paymentMethodId) {
      const subscriptionId = `sub_${Date.now()}`;
      return {
        success: true,
        subscriptionId,
      };
    }

    return {
      success: false,
      error: 'Failed to create subscription',
    };
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (subscriptionId) {
      return { success: true };
    }

    return {
      success: false,
      error: 'Failed to cancel subscription',
    };
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, planId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (subscriptionId && planId) {
      return { success: true };
    }

    return {
      success: false,
      error: 'Failed to update subscription',
    };
  }

  // Get payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.paymentMethods;
  }

  // Add payment method
  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<{ success: boolean; paymentMethodId?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPaymentMethod: PaymentMethod = {
      ...paymentMethod,
      id: `pm_${Date.now()}`,
    };

    this.paymentMethods.push(newPaymentMethod);

    return {
      success: true,
      paymentMethodId: newPaymentMethod.id,
    };
  }

  // Remove payment method
  async removePaymentMethod(paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = this.paymentMethods.findIndex(pm => pm.id === paymentMethodId);
    if (index !== -1) {
      this.paymentMethods.splice(index, 1);
      return { success: true };
    }

    return {
      success: false,
      error: 'Payment method not found',
    };
  }

  // Set default payment method
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    this.paymentMethods.forEach(pm => {
      pm.isDefault = pm.id === paymentMethodId;
    });

    return { success: true };
  }

  // Get invoices
  async getInvoices(): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.invoices;
  }

  // Process payment
  async processPayment(amount: number, currency: string, paymentMethodId: string, description: string): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      const transactionId = `txn_${Date.now()}`;
      
      // Add new invoice
      const newInvoice: Invoice = {
        id: `inv_${Date.now()}`,
        amount,
        currency,
        status: 'paid',
        dueDate: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        description,
      };
      
      this.invoices.push(newInvoice);

      return {
        success: true,
        transactionId,
      };
    }

    return {
      success: false,
      error: 'Payment failed. Please try again.',
    };
  }

  // Get payment status
  async getPaymentStatus(transactionId: string): Promise<{ status: 'pending' | 'completed' | 'failed'; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock payment status
    if (transactionId.includes('txn_')) {
      return { status: 'completed' };
    }

    return { status: 'failed', error: 'Transaction not found' };
  }

  // Validate card details
  async validateCard(cardNumber: string, expiryMonth: number, expiryYear: number, cvc: string): Promise<{ valid: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Basic validation
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return { valid: false, error: 'Invalid card number' };
    }

    if (expiryMonth < 1 || expiryMonth > 12) {
      return { valid: false, error: 'Invalid expiry month' };
    }

    if (expiryYear < new Date().getFullYear()) {
      return { valid: false, error: 'Card has expired' };
    }

    if (cvc.length < 3 || cvc.length > 4) {
      return { valid: false, error: 'Invalid CVC' };
    }

    return { valid: true };
  }

  // Get billing history
  async getBillingHistory(): Promise<{ transactions: any[]; totalAmount: number; currency: string }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const totalAmount = this.invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return {
      transactions: this.invoices.map(inv => ({
        id: inv.id,
        amount: inv.amount,
        status: inv.status,
        date: inv.paidAt || inv.dueDate,
        description: inv.description,
      })),
      totalAmount,
      currency: 'USD',
    };
  }
}

// Export singleton instance
export const paymentService = new MockPaymentService();
