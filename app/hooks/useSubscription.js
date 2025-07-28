import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useSubscription() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    // Don't fetch if not authenticated
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }
    
    // Wait for session to load
    if (status === 'loading') {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/subscription-status');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }
      const data = await response.json();
      setSubscription(data.subscription);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching subscription status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start subscription
  const startSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start subscription');
      }

      const data = await response.json();
      
      // Redirect to checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error starting subscription:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      const data = await response.json();
      
      // Refresh subscription status
      await fetchSubscriptionStatus();
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error canceling subscription:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user can create more habits
  const canCreateHabit = () => {
    if (!subscription) return false;
    if (subscription.plan === 'pro') return true;
    return subscription.habitCount < 5;
  };

  // Get upgrade message
  const getUpgradeMessage = () => {
    if (!subscription) return '';
    if (subscription.plan === 'pro') return '';
    if (subscription.habitCount >= 5) {
      return 'You\'ve reached the free plan limit. Upgrade to Pro for unlimited habits!';
    }
    return `You have ${5 - subscription.habitCount} habits remaining on the free plan.`;
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubscriptionStatus();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  return {
    subscription,
    loading,
    error,
    fetchSubscriptionStatus,
    startSubscription,
    cancelSubscription,
    canCreateHabit,
    getUpgradeMessage,
  };
} 