"use client";

import { useState } from "react";
import { useSubscription } from "../hooks/useSubscription";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Crown, Zap, X, CheckCircle, AlertTriangle } from "lucide-react";

export default function SubscriptionManager() {
  const {
    subscription,
    loading,
    error,
    startSubscription,
    cancelSubscription,
    canCreateHabit,
    getUpgradeMessage,
  } = useSubscription();

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Error loading subscription: {error}</AlertDescription>
      </Alert>
    );
  }

  if (!subscription) {
    return null;
  }

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      await startSubscription();
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll lose access to Pro features."
      )
    ) {
      return;
    }

    try {
      setIsCanceling(true);
      await cancelSubscription();
    } catch (error) {
      console.error("Cancel failed:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  // Temporary function for testing - manually activate Pro
  const handleManualActivate = async () => {
    try {
      setIsUpgrading(true);
      const response = await fetch("/api/manual-update-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to activate subscription");
      }

      const data = await response.json();
      console.log("Manual activation result:", data);

      // Refresh subscription status
      window.location.reload();
    } catch (error) {
      console.error("Manual activation failed:", error);
      alert("Failed to activate subscription: " + error.message);
    } finally {
      setIsUpgrading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trialing":
        return "bg-blue-100 text-blue-800";
      case "past_due":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "trialing":
        return <Zap className="h-4 w-4" />;
      case "past_due":
        return <AlertTriangle className="h-4 w-4" />;
      case "canceled":
        return <X className="h-4 w-4" />;
      default:
        return <X className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {subscription.plan === "pro" ? (
              <>
                <Crown className="h-5 w-5 text-yellow-500" />
                Pro Plan
              </>
            ) : (
              "Free Plan"
            )}
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={getStatusColor(subscription.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(subscription.status)}
                {subscription.status.replace("_", " ")}
              </span>
            </Badge>
          </div>

          {/* Trial Info */}
          {subscription.status === "trialing" &&
            subscription.trialDaysRemaining > 0 && (
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>{subscription.trialDaysRemaining} days</strong>{" "}
                  remaining in your free trial. You'll be charged $6.99/month
                  after the trial ends.
                </AlertDescription>
              </Alert>
            )}

          {/* Expiration Date */}
          {subscription.expiresAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {subscription.status === "trialing"
                  ? "Trial ends:"
                  : "Next billing:"}
              </span>
              <span className="text-sm text-gray-600">
                {new Date(subscription.expiresAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Habit Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Habits:</span>
            <span className="text-sm text-gray-600">
              {subscription.habitCount} / {subscription.maxHabits}
            </span>
          </div>

          {/* Upgrade Message */}
          {getUpgradeMessage() && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{getUpgradeMessage()}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {subscription.plan === "free" ? (
              <>
                <Button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="flex-1"
                >
                  {isUpgrading ? "Processing..." : "Upgrade to Pro"}
                </Button>
                {/* Temporary button for testing */}
                {/* <Button 
                  onClick={handleManualActivate} 
                  disabled={isUpgrading}
                  variant="outline"
                  className="text-xs"
                >
                  {isUpgrading ? 'Activating...' : 'Test: Activate Pro'}
                </Button> */}
              </>
            ) : (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isCanceling}
                className="flex-1"
              >
                {isCanceling ? "Processing..." : "Cancel Subscription"}
              </Button>
            )}
          </div>

          {/* Plan Features */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Plan Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {subscription.plan === "pro" ? (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Unlimited habits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Priority support
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Up to 5 habits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Basic analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-3 w-3 text-gray-400" />
                    Advanced analytics (Pro)
                  </li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
