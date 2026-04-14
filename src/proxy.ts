import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function proxy(
  ...args: Parameters<typeof intlMiddleware>
): ReturnType<typeof intlMiddleware> {
  return intlMiddleware(...args)
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|api).*)'],
}
