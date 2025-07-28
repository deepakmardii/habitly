const DODO_API_URL =
  process.env.DODO_API_URL || "https://test.dodopayments.com";
const DODO_API_KEY = process.env.DODO_API_KEY;

class DodoPaymentsAPI {
  constructor() {
    if (!DODO_API_KEY) {
      throw new Error("DODO_API_KEY is required");
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${DODO_API_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${DODO_API_KEY}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `DodoPayments API Error: ${response.status} - ${
          error.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  // Create a customer
  async createCustomer(email, name) {
    return this.makeRequest("/customers", {
      method: "POST",
      body: JSON.stringify({
        email,
        name,
      }),
    });
  }

  // Create a subscription
  async createSubscription(customerId, productId, trialDays = 5) {
    // Try both approaches: customer as object, then as top-level field if error persists
    const body1 = {
      customer: { customer_id: customerId },
      product_id: productId,
      quantity: 1,
      billing: {
        city: "Unknown",
        country: "IN",
        state: "Unknown",
        street: "Unknown",
        zipcode: "000000",
      },
      trial_period_days: trialDays,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`, // NEXTAUTH_URL must be set to your production domain in Vercel
      cancel_url: `${process.env.NEXTAUTH_URL}/settings`, // NEXTAUTH_URL must be set to your production domain in Vercel
      payment_link: true, // Ensure payment link is generated
    };
    console.log("DodoPayments subscription body (customer object):", body1);
    try {
      return await this.makeRequest("/subscriptions", {
        method: "POST",
        body: JSON.stringify(body1),
      });
    } catch (err) {
      // Try top-level customer_id if the first fails
      const body2 = {
        customer_id: customerId,
        product_id: productId,
        quantity: 1,
        billing: {
          city: "Unknown",
          country: "IN",
          state: "Unknown",
          street: "Unknown",
          zipcode: "000000",
        },
        trial_period_days: trialDays,
        return_url: `${process.env.NEXTAUTH_URL}/dashboard`, // NEXTAUTH_URL must be set to your production domain in Vercel
        cancel_url: `${process.env.NEXTAUTH_URL}/settings`, // NEXTAUTH_URL must be set to your production domain in Vercel
        payment_link: true, // Ensure payment link is generated
      };
      console.log(
        "DodoPayments subscription body (top-level customer_id):",
        body2
      );
      return await this.makeRequest("/subscriptions", {
        method: "POST",
        body: JSON.stringify(body2),
      });
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    return this.makeRequest(`/subscriptions/${subscriptionId}`);
  }

  // Update subscription (cancel, change plan, etc.)
  async updateSubscription(subscriptionId, updates) {
    return this.makeRequest(`/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    return this.updateSubscription(subscriptionId, {
      status: "cancelled", // DodoPayments expects 'cancelled' not 'canceled'
    });
  }

  // Get customer details
  async getCustomer(customerId) {
    return this.makeRequest(`/customers/${customerId}`);
  }

  // Create customer portal session
  async createCustomerPortalSession(customerId) {
    return this.makeRequest("/customers/portal", {
      method: "POST",
      body: JSON.stringify({
        customer_id: customerId,
        return_url: `${process.env.NEXTAUTH_URL}/dashboard`, // NEXTAUTH_URL must be set to your production domain in Vercel
      }),
    });
  }

  // Verify webhook signature (if DodoPayments provides webhook signing)
  verifyWebhookSignature(payload, signature) {
    // TODO: Implement webhook signature verification if DodoPayments provides it
    // For now, we'll trust the webhook (you should implement proper verification)
    return true;
  }
}

// Export a singleton instance
const dodoAPI = new DodoPaymentsAPI();
export default dodoAPI;
