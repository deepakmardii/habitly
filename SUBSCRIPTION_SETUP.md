# DodoPayments Subscription Setup Guide

## Environment Variables

Add these variables to your `.env.local` file:

```bash
# DodoPayments Configuration
DODO_API_KEY=sk_test_your_test_key
DODO_API_URL=https://test.dodopayments.com
DODO_PRO_PRODUCT_ID=your_pro_product_id
```

## Setup Steps

### 1. Get Your DodoPayments API Key
1. Log into your DodoPayments dashboard
2. Go to Developer → API Keys
3. Click "Add API Key"
4. Enter a name (e.g., "Habitly Integration")
5. Copy the generated API key

### 2. Get Your Product ID
1. In your DodoPayments dashboard, go to Products
2. Find your "Pro" product
3. Copy the Product ID (this is what you'll use for `DODO_PRO_PRODUCT_ID`)

### 3. Configure Webhooks (Optional but Recommended)
1. In your DodoPayments dashboard, go to Webhooks
2. Add a new webhook endpoint: `https://yourdomain.com/api/webhooks/dodo`
3. Select these events:
   - `subscription.created`
   - `subscription.activated`
   - `subscription.trial_ended`
   - `subscription.canceled`
   - `subscription.payment_failed`
   - `subscription.payment_succeeded`

### 4. Test the Integration
1. Start your development server
2. Create a test user account
3. Try to create more than 5 habits (should show upgrade prompt)
4. Test the upgrade flow
5. Check that subscription status updates correctly

## API Endpoints Created

- `POST /api/subscribe` - Start a subscription
- `GET /api/subscription-status` - Get current subscription status
- `POST /api/cancel-subscription` - Cancel subscription
- `POST /api/webhooks/dodo` - Handle DodoPayments webhooks

## Features Implemented

### Backend
- ✅ Database schema with subscription fields
- ✅ DodoPayments API integration
- ✅ Subscription creation and management
- ✅ Webhook handling for subscription events
- ✅ Feature gating (5-habit limit for free users)

### Frontend
- ✅ Subscription status hook (`useSubscription`)
- ✅ Subscription management component
- ✅ Upgrade prompts throughout the app
- ✅ Integration with habit creation modal
- ✅ Settings page with subscription management

## Testing

### Test Scenarios
1. **Free User Limit**: Try to create 6th habit → Should show upgrade prompt
2. **Upgrade Flow**: Click upgrade → Should redirect to DodoPayments checkout
3. **Trial Period**: New Pro users should get 5-day trial
4. **Subscription Management**: Users can view and cancel subscriptions
5. **Webhook Events**: Test subscription lifecycle events

### Common Issues
- **API Key Issues**: Make sure your API key is correct and has proper permissions
- **Product ID**: Ensure the product ID matches your DodoPayments product
- **Webhook URL**: Must be publicly accessible for DodoPayments to send events
- **Environment**: Use test keys for development, live keys for production

## Production Deployment

1. **Update Environment Variables**:
   - Use live DodoPayments API keys
   - Update webhook URLs to your production domain
   - Set `NEXTAUTH_URL` to your production URL

2. **Database Migration**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Test Everything**:
   - Test subscription creation
   - Test webhook events
   - Test feature gating
   - Test upgrade/cancel flows

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement webhook signature verification (if DodoPayments provides it)
- Validate all webhook data before processing
- Use HTTPS in production for all webhook endpoints 