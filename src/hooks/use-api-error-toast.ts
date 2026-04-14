'use client'

import { isAxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function useApiErrorToast(error: Error | null): void {
  const t = useTranslations('error')

  useEffect(() => {
    if (!error) return

    if (isAxiosError(error) && error.response?.status === 429) {
      toast.error(t('rateLimited'))
      return
    }

    toast.error(t('weatherFetchFailed'), {
      description: t('tryAgainLater'),
    })
  }, [error, t])
}
