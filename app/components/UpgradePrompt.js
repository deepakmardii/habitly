'use client';

import { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Crown, Zap, CheckCircle, X } from 'lucide-react';

export default function UpgradePrompt({ 
  title = "Upgrade to Pro", 
  description = "Unlock unlimited habits and advanced features",
  showFeatures = true,
  variant = "default" // "default", "compact", "modal"
}) {
  const { startSubscription, loading } = useSubscription();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      await startSubscription();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const features = [
    { icon: <Crown className="h-4 w-4" />, text: "Unlimited habits" },
    { icon: <Zap className="h-4 w-4" />, text: "Advanced analytics" },
    { icon: <CheckCircle className="h-4 w-4" />, text: "Priority support" },
  ];

  const freeFeatures = [
    { icon: <CheckCircle className="h-4 w-4" />, text: "Up to 5 habits" },
    { icon: <CheckCircle className="h-4 w-4" />, text: "Basic analytics" },
    { icon: <X className="h-4 w-4" />, text: "Advanced analytics (Pro)" },
  ];

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <Button 
            onClick={handleUpgrade} 
            disabled={isUpgrading || loading}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isUpgrading ? 'Processing...' : 'Upgrade'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
            <Crown className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showFeatures && (
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                Pro Features
              </h4>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    {feature.icon}
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t pt-3">
              <h4 className="font-semibold text-gray-900 mb-2">Free Plan</h4>
              <ul className="space-y-2">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    {feature.icon}
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="text-center space-y-3">
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-2xl font-bold text-gray-900">$6.99</div>
            <div className="text-sm text-gray-600">per month</div>
            <div className="text-xs text-green-600 font-medium mt-1">5-day free trial</div>
          </div>
          
          <Button 
            onClick={handleUpgrade} 
            disabled={isUpgrading || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {isUpgrading ? 'Processing...' : 'Start Free Trial'}
          </Button>
          
          <p className="text-xs text-gray-500">
            Cancel anytime. No commitment required.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 