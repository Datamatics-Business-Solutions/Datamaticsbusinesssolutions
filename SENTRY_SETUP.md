# 🐛 Sentry Setup Instructions

Sentry has been installed and configured in your DatamaticsBPM Client Portal! Here's how to complete the setup:

---

## Step 1: Create a Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Click **"Sign Up"** (it's free!)
3. Choose **"React"** as your project type
4. Give your project a name: **"datamatics-client-portal"**

---

## Step 2: Get Your DSN (Data Source Name)

After creating your project:

1. Sentry will show you a **DSN** that looks like this:
   ```
   https://abc123def456@o123456.ingest.sentry.io/7891011
   ```
2. **Copy this DSN** - you'll need it next!

You can also find it later at:
- Sentry Dashboard → Settings → Projects → Your Project → Client Keys (DSN)

---

## Step 3: Add DSN to Your Environment Variables

### For Local Development:

Create a `.env` file in your project root:

```bash
VITE_SENTRY_DSN=https://your-dsn-here@o123456.ingest.sentry.io/7891011
```

### For Production (Vercel/Netlify):

1. Go to your deployment dashboard (Vercel or Netlify)
2. Navigate to: **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `VITE_SENTRY_DSN`
   - **Value:** Your DSN from Sentry
4. Redeploy your site

---

## Step 4: Test Sentry

Once deployed, Sentry will automatically:
- ✅ Catch all JavaScript errors
- ✅ Track performance metrics
- ✅ Record user sessions when errors occur

To test it manually, add this button temporarily to any page:

```tsx
<button onClick={() => { throw new Error('Test Sentry!'); }}>
  Test Error
</button>
```

Click the button, then check your Sentry dashboard - you should see the error!

---

## What Sentry Tracks Automatically

✅ **JavaScript Errors:**
- Unhandled exceptions
- Promise rejections
- Component errors

✅ **Performance:**
- Page load times
- API call durations
- React component render times

✅ **User Actions (Breadcrumbs):**
- Button clicks
- Page navigation
- Console logs

✅ **Session Replay:**
- Video-like replay of user sessions when errors occur
- See exactly what the user did before the error

---

## How to Use Sentry in Your Code

### 1. Track User After Login

The login page already tracks users! After successful login:

```tsx
setSentryUser({
  id: user.id,
  email: user.email,
  username: user.name
});
```

### 2. Manually Capture Errors

```tsx
import { captureError } from './sentry';

try {
  // Your code
} catch (error) {
  captureError(error, { 
    campaignId: '123',
    action: 'export_leads' 
  });
}
```

### 3. Track Important Events

```tsx
import { addBreadcrumb } from './sentry';

addBreadcrumb(
  'User exported leads', 
  'user_action',
  { campaignId: '123', leadCount: 150 }
);
```

### 4. Log Custom Messages

```tsx
import { captureMessage } from './sentry';

captureMessage('Campaign launch failed', 'error');
```

---

## Sentry Dashboard Features

### Issues Tab
- See all errors grouped by type
- Know how many users are affected
- See stack traces and user context

### Performance Tab
- Monitor page load times
- Track slow API calls
- Identify bottlenecks

### Releases Tab (Optional)
- Track which version has which bugs
- Deploy with confidence

### Alerts (Optional)
- Get email/Slack when critical errors occur
- Set thresholds: "Alert me if error rate > 1%"

---

## Cost & Limits

**Free Tier Includes:**
- 5,000 errors per month
- 10,000 performance transactions
- 50 session replays
- 1 user

**Perfect for:**
- MVP & prototypes
- Small B2B dashboards
- Testing & development

**Upgrade Later:**
- Paid plans start at $26/month
- More errors, users, and features

---

## Best Practices

### ✅ DO:
- Set user context after login
- Add breadcrumbs for important actions
- Review Sentry dashboard weekly
- Fix high-frequency errors first

### ❌ DON'T:
- Log sensitive data (passwords, credit cards)
- Ignore low-frequency errors
- Disable Sentry in production

---

## Troubleshooting

### "I don't see any errors in Sentry"

1. Make sure you deployed with the DSN environment variable
2. Check browser console - is Sentry initialized?
3. Trigger a test error (button above)
4. Check Sentry filters - make sure nothing is filtered out

### "Too many errors!"

This is good - you found bugs! Prioritize:
1. High-frequency errors (affecting many users)
2. Errors on critical pages (login, checkout)
3. Errors with high user impact

---

## Support

- **Sentry Docs:** [docs.sentry.io](https://docs.sentry.io)
- **React Guide:** [docs.sentry.io/platforms/javascript/guides/react](https://docs.sentry.io/platforms/javascript/guides/react)
- **Discord:** [discord.gg/sentry](https://discord.gg/sentry)

---

## Next Steps

1. ✅ Sentry is installed
2. ⏳ Get your DSN from sentry.io
3. ⏳ Add DSN to environment variables
4. ⏳ Deploy and test
5. ⏳ Monitor your dashboard!

**Questions?** Let me know and I can help! 🚀
