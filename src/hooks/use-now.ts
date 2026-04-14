import { useSyncExternalStore } from 'react'

let nowMs = 0
let interval: ReturnType<typeof setInterval> | null = null
const listeners = new Set<() => void>()

function startInterval(): void {
  if (interval) return
  nowMs = Date.now()
  interval = setInterval(() => {
    nowMs = Date.now()
    listeners.forEach((l) => l())
  }, 1_000)
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  if (listeners.size === 1) startInterval()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && interval) {
      clearInterval(interval)
      interval = null
    }
  }
}

function getSnapshot(): number {
  return nowMs
}

function getServerSnapshot(): number {
  return 0
}

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
