import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import dodoAPI from "../../../../lib/dodo";

// Simple in-memory rate limiting (TODO: use Redis in production)
const webhookRequests = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10; // Max 10 requests per minute

  if (!webhookRequests.has(ip)) {
    webhookRequests.set(ip, []);
  }

  const requests = webhookRequests.get(ip);
  const validRequests = requests.filter((time) => now - time < windowMs);
  webhookRequests.set(ip, validRequests);

  if (validRequests.length >= maxRequests) {
    return true;
  }

  validRequests.push(now);
  return false;
}

export async function POST(req) {
  console.log("🔔 DodoPayments webhook received!");

  // Get client IP for rate limiting
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";

  // Rate limiting
  if (isRateLimited(ip)) {
    console.warn(`Rate limited webhook request from IP: ${ip}`);
    return new Response("Too many requests", { status: 429 });
  }

  try {
    const body = await req.text();
    console.log("📨 Webhook body:", body);

    // Get signature from DodoPayments header
    const signature = req.headers.get("x-dodo-signature");
    console.log("🔐 Webhook signature:", signature);

    // Verify webhook signature (optional for development)
    const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET;
    
    if (signature && DODO_WEBHOOK_SECRET) {
      // Only verify if signature is provided and secret is configured
      if (!dodoAPI.verifyWebhookSignature(body, signature)) {
        console.error("❌ Invalid webhook signature");
        return new Response("Invalid signature", { 
          status: 401,
          headers: {
            "Content-Type": "text/plain",
          }
        });
      }
      console.log("✅ Webhook signature verified successfully");
    } else {
      console.log("⚠️ Skipping signature verification (no signature or secret)");
    }

    // Parse the JSON body
    let event;
    try {
      event = JSON.parse(body);
      console.log("📋 Parsed webhook event:", event);
    } catch (error) {
      console.error("❌ Failed to parse webhook JSON:", error);
      return new Response("Invalid JSON", { 
        status: 400,
        headers: {
          "Content-Type": "text/plain",
        }
      });
    }

    console.log("🎯 Processing webhook event type:", event.type);

    // Handle different event types
    switch (event.type) {
      // Subscription events
      case "subscription.created":
        console.log("📝 Processing subscription.created event");
        await handleSubscriptionCreated(event.data);
        break;
      case "subscription.active":
        console.log("✅ Processing subscription.active event");
        await handleSubscriptionActive(event.data);
        break;
      case "subscription.on_hold":
        console.log("⏸️ Processing subscription.on_hold event");
        await handleSubscriptionOnHold(event.data);
        break;
      case "subscription.renewed":
        console.log("🔄 Processing subscription.renewed event");
        await handleSubscriptionRenewed(event.data);
        break;
      case "subscription.plan_changed":
        console.log("🔀 Processing subscription.plan_changed event");
        await handleSubscriptionPlanChanged(event.data);
        break;
      case "subscription.cancelled":
        console.log("❌ Processing subscription.cancelled event");
        await handleSubscriptionCanceled(event.data);
        break;
      case "subscription.failed":
        console.log("❗ Processing subscription.failed event");
        await handleSubscriptionFailed(event.data);
        break;
      case "subscription.expired":
        console.log("⌛ Processing subscription.expired event");
        await handleSubscriptionExpired(event.data);
        break;
      // Payment events
      case "payment.succeeded":
        console.log("💰 Processing payment.succeeded event");
        await handlePaymentSucceeded(event.data);
        break;
      case "payment.failed":
        console.log("💸 Processing payment.failed event");
        await handlePaymentFailed(event.data);
        break;
      case "payment.processing":
        console.log("⏳ Processing payment.processing event");
        break;
      case "payment.cancelled":
        console.log("🚫 Processing payment.cancelled event");
        break;
      default:
        console.log("❓ Unknown webhook event type:", event.type);
    }

    console.log("✅ Webhook processed successfully");
    return new Response("OK", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "X-Webhook-Processed": "true",
      },
    });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return new Response("Internal server error", { 
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      }
    });
  }
}

async function handleSubscriptionCreated(data) {
  // Subscription was created (usually during trial)
  const subscription = data;

  // Find user by subscription ID and update status
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.subscription_id },
    data: {
      subscriptionStatus: "trialing",
      subscriptionPlan: "pro",
      subscriptionExpiresAt: subscription.next_billing_date ? new Date(subscription.next_billing_date) : null,
      customerId: subscription.customer?.customer_id,
    },
  });
}

async function handleSubscriptionActive(data) {
  // Subscription is now active
  const subscription = data;
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.subscription_id },
    data: {
      subscriptionStatus: "active",
      subscriptionPlan: "pro",
      subscriptionExpiresAt: subscription.next_billing_date ? new Date(subscription.next_billing_date) : null,
      customerId: subscription.customer?.customer_id,
    },
  });
}

async function handleSubscriptionOnHold(data) {
  // Subscription is on hold
  const subscription = data;

  await prisma.user.updateMany({
    where: { subscriptionId: subscription.subscription_id },
    data: {
      subscriptionStatus: "on_hold",
      subscriptionExpiresAt: subscription.next_billing_date ? new Date(subscription.next_billing_date) : null,
    },
  });
}

async function handleSubscriptionRenewed(data) {
  // Subscription was renewed
  const subscription = data;

  await prisma.user.updateMany({
    where: { subscriptionId: subscription.subscription_id },
    data: {
      subscriptionStatus: "active",
      subscriptionPlan: "pro",
      subscriptionExpiresAt: subscription.next_billing_date ? new Date(subscription.next_billing_date) : null,
    },
  });
}

async function handleSubscriptionPlanChanged(data) {
  // Subscription plan changed
  const subscription = data;
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.subscription_id },
    data: {
      subscriptionStatus: "active",
      subscriptionPlan: "pro",
      subscriptionExpiresAt: subscription.next_billing_date ? new Date(subscription.next_billing_date) : null,
    },
  });
}

async function handleSubscriptionCanceled(data) {
  // Subscription was cancelled
  const subscription = data;
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.subscription_id },
    data: {
      subscriptionStatus: "cancelled",
      subscriptionPlan: "free",
      subscriptionExpiresAt: null,
    },
  });
}

async function handleSubscriptionFailed(data) {
  // Subscription failed
  const subscription = data;
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.subscription_id },
    data: {
      subscriptionStatus: "failed",
      subscriptionExpiresAt: null,
    },
  });
}

async function handleSubscriptionExpired(data) {
  // Subscription expired
  const subscription = data;
  await prisma.user.updateMany({
    where: { subscriptionId: subscription.subscription_id },
    data: {
      subscriptionStatus: "expired",
      subscriptionExpiresAt: null,
    },
  });
}

async function handlePaymentSucceeded(data) {
  // Payment succeeded
  const payment = data;
  await prisma.user.updateMany({
    where: { subscriptionId: payment.subscription_id },
    data: {
      subscriptionStatus: "active",
      subscriptionPlan: "pro",
    },
  });
}

async function handlePaymentFailed(data) {
  // Payment failed
  const payment = data;
  await prisma.user.updateMany({
    where: { subscriptionId: payment.subscription_id },
    data: {
      subscriptionStatus: "past_due",
    },
  });
}
