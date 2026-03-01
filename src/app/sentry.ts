import * as Sentry from '@sentry/react';

export function initSentry() {
  // Only initialize Sentry in production
  if (import.meta.env.MODE === 'production') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
      
      // Performance Monitoring
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      
      // Performance Monitoring - Sample rate for performance
      tracesSampleRate: 1.0, // Capture 100% of transactions for monitoring
      
      // Session Replay - Sample rate for replays
      replaysSessionSampleRate: 0.1, // 10% of sessions will be replayed
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors will be replayed
      
      // Set environment
      environment: import.meta.env.MODE,
      
      // Release tracking (optional - set in your build process)
      // release: 'datamatics-portal@1.0.0',
      
      // Ignore specific errors (optional)
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random plugins/extensions
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        // Facebook
        'fb_xd_fragment',
        // Network errors that are expected
        'NetworkError',
        'Network request failed',
      ],
      
      // Add user context (set after login)
      beforeSend(event, hint) {
        // Filter out any sensitive data if needed
        return event;
      },
    });
  }
}

// Helper to set user context after login
export function setSentryUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

// Helper to clear user context on logout
export function clearSentryUser() {
  Sentry.setUser(null);
}

// Helper to manually capture errors
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Helper to capture messages/logs
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}

// Helper to add breadcrumbs (user actions tracking)
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}
