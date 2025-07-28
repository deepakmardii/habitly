import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export async function GET(req) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    console.log('Session in subscription-status:', session);
    
    if (!session?.user?.email) {
      console.log('No session or user email found');
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionExpiresAt: true,
        subscriptionId: true,
        habits: {
          select: {
            id: true
          }
        }
      }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Calculate trial days remaining
    let trialDaysRemaining = 0;
    if (user.subscriptionStatus === 'trialing' && user.subscriptionExpiresAt) {
      const now = new Date();
      const expiresAt = new Date(user.subscriptionExpiresAt);
      const diffTime = expiresAt - now;
      trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      trialDaysRemaining = Math.max(0, trialDaysRemaining);
    }

    // Check if user is over the free plan limit
    const habitCount = user.habits.length;
    const isOverLimit = user.subscriptionPlan === 'free' && habitCount > 5;

    return new Response(JSON.stringify({
      subscription: {
        status: user.subscriptionStatus,
        plan: user.subscriptionPlan,
        expiresAt: user.subscriptionExpiresAt,
        trialDaysRemaining,
        isOverLimit,
        habitCount,
        maxHabits: user.subscriptionPlan === 'pro' ? 'unlimited' : 5
      }
    }), { status: 200 });

  } catch (error) {
    console.error('Subscription status error:', error);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), { status: 500 });
  }
} 