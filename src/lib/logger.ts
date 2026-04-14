/**
 * Error reporting service.
 *
 * In production, this would integrate with a service like Sentry:
 *   Sentry.captureException(error, { extra: context })
 *
 * For now, logs to console in development. Replace the implementations
 * below when adding a real error reporting service.
 */

export function captureError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  // TODO: Replace with Sentry.captureException(error, { extra: context })
  console.error('[Error]', error, context)
}

export function captureMessage(
  message: string,
  context?: Record<string, unknown>
): void {
  // TODO: Replace with Sentry.captureMessage(message, { extra: context })
  console.warn('[Warning]', message, context)
}
