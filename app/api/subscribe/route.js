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

    // Check if user already has an active subscription
    if (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing') {
      return new Response(JSON.stringify({ 
        error: "You already have an active subscription" 
      }), { status: 400 });
    }

    // Get your Pro product ID from DodoPayments
    // You'll need to replace this with your actual product ID
    const PRO_PRODUCT_ID = process.env.DODO_PRO_PRODUCT_ID;
    if (!PRO_PRODUCT_ID) {
      return new Response(JSON.stringify({ 
        error: "Product ID not configured" 
      }), { status: 500 });
    }

    let customerId = user.customerId; // Use the new customerId field

    // Create customer if doesn't exist
    if (!customerId) {
      try {
        const customer = await dodoAPI.createCustomer(user.email, user.name || user.email);
        console.log('DodoPayments createCustomer response:', customer);
        // Use the correct field for customer ID
        customerId = customer.customer_id || customer.id;
        if (!customerId) {
          return new Response(JSON.stringify({ error: "Failed to get customer ID from DodoPayments" }), { status: 500 });
        }
        // Store customer ID in user record
        await prisma.user.update({
          where: { id: user.id },
          data: { customerId }
        });
      } catch (error) {
        console.error('Error creating customer:', error);
        return new Response(JSON.stringify({ 
          error: "Failed to create customer" 
        }), { status: 500 });
      }
    }

    // Create subscription
    try {
      const subscription = await dodoAPI.createSubscription(
        customerId, 
        PRO_PRODUCT_ID, 
        5 // 5-day trial
      );

      console.log('DodoPayments subscription response:', subscription); // Log the full response

      // Store the subscription ID, let webhooks handle status updates
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionId: subscription.subscription_id || subscription.id // Store subscription ID
        }
      });

      // Check if we have a payment link or need to construct one
      let checkoutUrl = subscription.payment_link || subscription.checkout_url || subscription.url;
      
      // If no direct payment link, try to construct one using client_secret
      if (!checkoutUrl && subscription.client_secret) {
        // DodoPayments might use client_secret for payment links
        checkoutUrl = `${process.env.DODO_API_URL || 'https://test.dodopayments.com'}/pay/${subscription.client_secret}`;
      }
      
      // If still no checkout URL, return an error
      if (!checkoutUrl) {
        console.error('No checkout URL available in subscription response:', subscription);
        return new Response(JSON.stringify({ 
          error: "No payment link available from DodoPayments" 
        }), { status: 500 });
      }

      return new Response(JSON.stringify({
        success: true,
        checkoutUrl: checkoutUrl,
        subscriptionId: subscription.subscription_id || subscription.id
      }), { status: 200 });

    } catch (error) {
      console.error('Error creating subscription:', error);
      return new Response(JSON.stringify({ 
        error: "Failed to create subscription" 
      }), { status: 500 });
    }

  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), { status: 500 });
  }
} 