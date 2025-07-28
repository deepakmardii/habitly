import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";
import dodoAPI from "../../../lib/dodo";

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

    // Check if user has an active subscription to cancel
    if (user.subscriptionStatus === 'free' || user.subscriptionStatus === 'canceled') {
      return new Response(JSON.stringify({ 
        error: "No active subscription to cancel" 
      }), { status: 400 });
    }

    // Cancel subscription in DodoPayments
    if (user.subscriptionId) {
      try {
        await dodoAPI.cancelSubscription(user.subscriptionId);
      } catch (error) {
        console.error('Error canceling subscription in DodoPayments:', error);
        // Continue with local cancellation even if DodoPayments fails
      }
    }

    // Update user subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'cancelled', // Use 'cancelled' not 'canceled'
        subscriptionPlan: 'free',
        subscriptionExpiresAt: null
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Subscription canceled successfully"
    }), { status: 200 });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), { status: 500 });
  }
} 