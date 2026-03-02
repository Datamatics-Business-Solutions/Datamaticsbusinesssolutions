# EmailJS Setup Instructions

The feedback form is now configured to send emails directly to your inbox using EmailJS. Follow these steps to set it up:

## Step 1: Create a Free EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account (100 emails/month free)
3. Verify your email address

## Step 2: Add an Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection instructions
5. **Important:** Copy your **Service ID** (e.g., `service_abc123`)

## Step 3: Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template format:

```
Subject: [{{feedback_type}}] {{subject}} - Priority: {{priority}}

New Feedback Received from DatamaticsBPM Client Portal
==================================================

From: {{from_name}}
Email: {{from_email}}
User Role: {{user_role}}
User ID: {{user_id}}
Submitted: {{submitted_at}}

Feedback Type: {{feedback_type}}
Priority: {{priority}}

Subject: {{subject}}

Message:
{{message}}

--
This feedback was submitted via the DatamaticsBPM Client Portal feedback form.
```

4. **Important:** Copy your **Template ID** (e.g., `template_xyz456`)

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in the EmailJS dashboard
2. Find your **Public Key** (e.g., `abc123xyz456`)
3. Copy it

## Step 5: Update the Feedback Component

Open `/src/app/pages/Feedback.tsx` and replace these three values at the top of the file:

```typescript
const EMAILJS_SERVICE_ID = 'service_abc123'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz456'; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'abc123xyz456'; // Replace with your Public Key
```

## Step 6: Test It!

1. Navigate to the Feedback page in your portal (`/feedback`)
2. Fill out the form
3. Submit it
4. Check your email inbox - you should receive the feedback!

## Email Template Variables

The form sends these variables to your email template:

- `{{from_name}}` - User's name
- `{{from_email}}` - User's email address
- `{{feedback_type}}` - Type of feedback (BUG, FEATURE, IMPROVEMENT, GENERAL)
- `{{priority}}` - Priority level (LOW, MEDIUM, HIGH)
- `{{subject}}` - Feedback subject line
- `{{message}}` - Detailed feedback message
- `{{user_role}}` - User's role in the portal
- `{{user_id}}` - User's ID
- `{{submitted_at}}` - Date and time of submission

## Troubleshooting

### Not receiving emails?

1. Check your EmailJS dashboard's **Logs** section for error messages
2. Verify your Service ID, Template ID, and Public Key are correct
3. Make sure your email service is connected and active
4. Check your spam folder
5. Verify you haven't exceeded the 100 emails/month limit on the free plan

### Getting errors in the console?

1. Open browser DevTools (F12) and check the Console tab
2. Look for EmailJS-specific errors
3. Verify all three configuration values are set correctly

## Security Note

The Public Key is safe to expose in client-side code - it's designed for that purpose. Your private API key remains secure in EmailJS's servers.

## Upgrade Options

If you need more than 100 emails/month, EmailJS offers paid plans starting at $7/month for 1,000 emails.

---

**Need help?** Check the [EmailJS Documentation](https://www.emailjs.com/docs/) or contact their support team.
