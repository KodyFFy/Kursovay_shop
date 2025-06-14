
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AntivirusPage() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на страницу продуктов с фильтром по категории "Антивирусы"
    router.push('/products?category=cmbw9psjj0002v94vwxogqvi9')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)] mx-auto"></div>
        <p className="mt-4 text-[var(--text-secondary)]">Перенаправление...</p>
      </div>
    </div>
  )
}
