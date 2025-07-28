# ngrok Setup for Webhook Testing

## What is ngrok?
ngrok creates a secure tunnel to your local development server, making it accessible from the internet. This is essential for testing webhooks from DodoPayments.

## Setup Steps

### 1. Start Your Next.js App
```bash
npm run dev
# Your app will be running on http://localhost:3000
```

### 2. Start ngrok Tunnel
In a new terminal window:
```bash
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Account                       (Plan: Free)
Version                       3.25.0
Region                        United States (us)
Latency                       51ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

### 3. Copy Your ngrok URL
Use the `https://abc123.ngrok.io` URL (your URL will be different).

### 4. Configure DodoPayments Webhook
1. Go to your DodoPayments dashboard
2. Navigate to Webhooks section
3. Add a new webhook endpoint:
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/dodo
   ```
4. Select these events:
   - `subscription.created`
   - `subscription.activated`
   - `subscription.trial_ended`
   - `subscription.cancelled`
   - `subscription.payment_failed`
   - `subscription.payment_succeeded`

### 5. Update Environment Variables
Add your ngrok URL to your `.env.local`:
```bash
NEXTAUTH_URL=https://your-ngrok-url.ngrok.io
```

## Testing Webhooks

### 1. Monitor Webhook Events
- Open http://127.0.0.1:4040 in your browser
- This shows all incoming webhook requests
- You can inspect the request/response data

### 2. Test Subscription Flow
1. Start your Next.js app: `npm run dev`
2. Start ngrok: `ngrok http 3000`
3. Update DodoPayments webhook URL with your ngrok URL
4. Try creating a subscription
5. Check the ngrok web interface for webhook events

### 3. Debug Webhook Issues
- Check ngrok web interface for failed requests
- Look at your Next.js server logs
- Verify webhook URL is correct in DodoPayments dashboard

## Important Notes

### Free ngrok Limitations
- Free plan has limited connections per minute
- URLs change each time you restart ngrok
- You'll need to update DodoPayments webhook URL each time

### Production
- For production, use your actual domain instead of ngrok
- Set up proper webhook endpoints on your production server
- Use HTTPS in production

## Troubleshooting

### Webhook Not Receiving Events
1. Check ngrok is running and forwarding correctly
2. Verify webhook URL in DodoPayments dashboard
3. Check your Next.js app is running on port 3000
4. Look for errors in ngrok web interface

### ngrok URL Changes
- Each time you restart ngrok, you get a new URL
- You must update the webhook URL in DodoPayments dashboard
- Consider using ngrok with a custom domain for development

### Common Commands
```bash
# Start ngrok
ngrok http 3000

# Start ngrok with custom subdomain (requires paid plan)
ngrok http 3000 --subdomain=habitly-dev

# View ngrok web interface
open http://127.0.0.1:4040
```

## Next Steps
1. Test the complete subscription flow with webhooks
2. Verify subscription status updates correctly
3. Test cancellation and other webhook events
4. Move to production when ready 