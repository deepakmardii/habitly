import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export async function POST(req) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Manually update subscription status to active (for testing)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'active',
        subscriptionPlan: 'pro',
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }
    });

    console.log('✅ Manually updated subscription for user:', user.email);
    console.log('📊 New subscription status:', updatedUser.subscriptionStatus);
    console.log('📊 New subscription plan:', updatedUser.subscriptionPlan);

    return new Response(JSON.stringify({
      success: true,
      message: "Subscription manually updated to active",
      subscription: {
        status: updatedUser.subscriptionStatus,
        plan: updatedUser.subscriptionPlan,
        expiresAt: updatedUser.subscriptionExpiresAt
      }
    }), { status: 200 });

  } catch (error) {
    console.error('Manual update error:', error);
    return new Response(JSON.stringify({ 
      error: "Failed to update subscription" 
    }), { status: 500 });
  }
} 