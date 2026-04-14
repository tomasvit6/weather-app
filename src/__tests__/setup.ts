import '@testing-library/jest-dom/vitest'

import { vi } from 'vitest'

vi.mock('motion/react', async () => {
  const actual =
    await vi.importActual<typeof import('motion/react')>('motion/react')
  return {
    ...actual,
    AnimatePresence: ({
      children,
    }: {
      children: React.ReactNode
    }): React.ReactNode => children,
  }
})
