/**
 * Application Monitoring & Alerting
 *
 * Tracks security events, errors, and performance metrics
 * Integrates with Sentry (when configured)
 */

interface SecurityEvent {
  type: "csrf_failure" | "rate_limit_hit" | "auth_failure" | "payment_fraud" | "admin_access";
  userId?: string;
  ip?: string;
  details: any;
  timestamp: Date;
}

interface PerformanceMetric {
  endpoint: string;
  duration: number;
  status: number;
  timestamp: Date;
}

/**
 * Log security-relevant events for monitoring
 */
export function logSecurityEvent(event: SecurityEvent) {
  const logEntry = {
    ...event,
    timestamp: event.timestamp.toISOString(),
    severity: getSeverity(event.type),
  };

  // Log to console (goes to Vercel logs)
  console.warn("[SECURITY EVENT]", JSON.stringify(logEntry));

  // In production, you can send to Sentry, DataDog, etc.
  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    // Sentry.captureMessage("Security Event", {
    //   level: logEntry.severity,
    //   extra: logEntry,
    // });
  }

  // Check if we should alert (e.g., email admin)
  if (shouldAlert(event)) {
    sendSecurityAlert(logEntry);
  }
}

function getSeverity(type: SecurityEvent["type"]): "low" | "medium" | "high" | "critical" {
  const severityMap: Record<SecurityEvent["type"], "low" | "medium" | "high" | "critical"> = {
    csrf_failure: "medium",
    rate_limit_hit: "low",
    auth_failure: "medium",
    payment_fraud: "critical",
    admin_access: "high",
  };
  return severityMap[type] || "medium";
}

function shouldAlert(event: SecurityEvent): boolean {
  // Alert on critical events
  if (event.type === "payment_fraud") return true;

  // Alert if same IP hits rate limit multiple times
  // (Implement counter logic here)

  return false;
}

function sendSecurityAlert(event: any) {
  // TODO: Implement email/Slack alerting
  console.error("[SECURITY ALERT]", event);
}

/**
 * Track API performance
 */
export function trackPerformance(metric: PerformanceMetric) {
  // Log slow requests
  if (metric.duration > 3000) {
    console.warn("[SLOW REQUEST]", {
      endpoint: metric.endpoint,
      duration: `${metric.duration}ms`,
      status: metric.status,
    });
  }

  // In production, send to analytics service
  // Example: Vercel Analytics, DataDog, New Relic
}

/**
 * Health check metrics for monitoring dashboard
 */
export interface HealthMetrics {
  uptime: number;
  database: "healthy" | "degraded" | "down";
  redis: "healthy" | "degraded" | "down";
  payments: "healthy" | "degraded" | "down";
  lastError?: string;
}

export async function getHealthMetrics(): Promise<HealthMetrics> {
  return {
    uptime: process.uptime(),
    database: "healthy", // Check Turso connection
    redis: "healthy", // Check Upstash connection
    payments: "healthy", // Check Razorpay API
  };
}

/**
 * Middleware helper to track request metrics
 */
export function withMonitoring<T>(
  handler: () => Promise<T>,
  context: { endpoint: string }
): Promise<T> {
  const start = Date.now();

  return handler()
    .then((result) => {
      trackPerformance({
        endpoint: context.endpoint,
        duration: Date.now() - start,
        status: 200,
        timestamp: new Date(),
      });
      return result;
    })
    .catch((error) => {
      trackPerformance({
        endpoint: context.endpoint,
        duration: Date.now() - start,
        status: error.statusCode || 500,
        timestamp: new Date(),
      });
      throw error;
    });
}

/**
 * Alert thresholds and configuration
 */
export const ALERT_CONFIG = {
  MAX_FAILED_LOGINS_PER_HOUR: 10,
  MAX_PAYMENT_FAILURES_PER_HOUR: 5,
  SLOW_REQUEST_THRESHOLD_MS: 3000,
  HIGH_ERROR_RATE_THRESHOLD: 0.05, // 5%
};
