import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import dodoAPI from '../../../../lib/dodo';

export async function POST(req) {
  console.log('🔔 DodoPayments webhook received!');
  
  try {
    const body = await req.text();
    console.log('📨 Webhook body:', body);
    
    const signature = req.headers.get('x-dodo-signature') || req.headers.get('x-signature');
    console.log('🔐 Webhook signature:', signature);
    
    // Parse the JSON body
    let event;
    try {
      event = JSON.parse(body);
      console.log('📋 Parsed webhook event:', event);
    } catch (error) {
      console.error('❌ Failed to parse webhook JSON:', error);
      return new Response('Invalid JSON', { status: 400 });
    }
    
    // Verify webhook signature (if DodoPayments provides signature verification)
    if (signature && !dodoAPI.verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }
    
    console.log('🎯 Processing webhook event type:', event.type);
    
    // Handle different event types
    switch (event.type) {
      // Subscription events
      case 'subscription.created':
        console.log('📝 Processing subscription.created event');
        await handleSubscriptionCreated(event.data);
        break;
      case 'subscription.active':
        console.log('✅ Processing subscription.active event');
        await handleSubscriptionActive(event.data);
        break;
      case 'subscription.on_hold':
        console.log('⏸️ Processing subscription.on_hold event');
        await handleSubscriptionOnHold(event.data);
        break;
      case 'subscription.renewed':
        console.log('🔄 Processing subscription.renewed event');
        await handleSubscriptionRenewed(event.data);
        break;
      case 'subscription.plan_changed':
        console.log('🔀 Processing subscription.plan_changed event');
        await handleSubscriptionPlanChanged(event.data);
        break;
      case 'subscription.cancelled':
        console.log('❌ Processing subscription.cancelled event');
        await handleSubscriptionCanceled(event.data);
        break;
      case 'subscription.failed':
        console.log('❗ Processing subscription.failed event');
        await handleSubscriptionFailed(event.data);
        break;
      case 'subscription.expired':
        console.log('⌛ Processing subscription.expired event');
        await handleSubscriptionExpired(event.data);
        break;
      // Payment events
      case 'payment.succeeded':
        console.log('💰 Processing payment.succeeded event');
        await handlePaymentSucceeded(event.data);
        break;
      case 'payment.failed':
        console.log('💸 Processing payment.failed event');
        await handlePaymentFailed(event.data);
        break;
      case 'payment.processing':
        console.log('⏳ Processing payment.processing event');
        break;
      case 'payment.cancelled':
        console.log('🚫 Processing payment.cancelled event');
        break;
      default:
        console.log('❓ Unknown webhook event type:', event.type);
    }
    
    console.log('✅ Webhook processed successfully');
    return new Response('OK', { status: 200 });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

async function handleSubscriptionCreated(data) {
  // Subscription was created (usually during trial)
  const subscription = data.object;
  
  // Find user by subscription ID and update status
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.id },
    data: {
      subscriptionStatus: 'trialing',
      subscriptionPlan: 'pro',
      subscriptionExpiresAt: new Date(subscription.trial_end * 1000) // Convert timestamp to Date
    }
  });
}

async function handleSubscriptionActive(data) {
  // Subscription is now active
  const subscriptionId = data.subscription_id;
  await prisma.user.updateMany({
    where: { subscriptionId },
    data: {
      subscriptionStatus: 'active',
      subscriptionPlan: 'pro',
      subscriptionExpiresAt: data.next_billing_date ? new Date(data.next_billing_date) : null
    }
  });
}

async function handleSubscriptionOnHold(data) {
  // Subscription is on hold
  const subscription = data.object;
  
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.id },
    data: {
      subscriptionStatus: 'on_hold',
      subscriptionExpiresAt: new Date(subscription.current_period_end * 1000)
    }
  });
}

async function handleSubscriptionRenewed(data) {
  // Subscription was renewed
  const subscription = data.object;
  
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.id },
    data: {
      subscriptionStatus: 'active',
      subscriptionPlan: 'pro',
      subscriptionExpiresAt: new Date(subscription.current_period_end * 1000)
    }
  });
}

async function handleSubscriptionPlanChanged(data) {
  // Subscription plan changed
  const subscription = data.object;
  
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.id },
    data: {
      subscriptionStatus: 'active',
      subscriptionPlan: subscription.plan.nickname,
      subscriptionExpiresAt: new Date(subscription.current_period_end * 1000)
    }
  });
}

async function handleSubscriptionCanceled(data) {
  // Subscription was canceled
  const subscriptionId = data.subscription_id;
  await prisma.user.updateMany({
    where: { subscriptionId },
    data: {
      subscriptionStatus: 'cancelled', // Use 'cancelled' not 'canceled'
      subscriptionPlan: 'free',
      subscriptionExpiresAt: null
    }
  });
}

async function handleSubscriptionFailed(data) {
  // Subscription failed
  const subscription = data.object;
  
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.id },
    data: {
      subscriptionStatus: 'failed',
      subscriptionExpiresAt: null
    }
  });
}

async function handleSubscriptionExpired(data) {
  // Subscription expired
  const subscription = data.object;
  
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.id },
    data: {
      subscriptionStatus: 'expired',
      subscriptionExpiresAt: null
    }
  });
}

async function handlePaymentSucceeded(data) {
  // Payment succeeded
  const subscriptionId = data.subscription_id;
  await prisma.user.updateMany({
    where: { subscriptionId },
    data: {
      subscriptionStatus: 'active',
      subscriptionPlan: 'pro',
      subscriptionExpiresAt: data.next_billing_date ? new Date(data.next_billing_date) : null
    }
  });
}

async function handlePaymentFailed(data) {
  // Payment failed
  const subscriptionId = data.subscription_id;
  await prisma.user.updateMany({
    where: { subscriptionId },
    data: {
      subscriptionStatus: 'past_due',
      subscriptionExpiresAt: data.next_billing_date ? new Date(data.next_billing_date) : null
    }
  });
} 