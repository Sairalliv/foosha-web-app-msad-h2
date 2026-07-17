'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function DemoRoleSwitcher() {
  const searchParams = useSearchParams()
  const currentRole = searchParams.get('demo_role') || 'donor'

  return (
    <div className="fixed bottom-4 right-4 z-50 glassmorphism rounded-full p-2 flex gap-2 shadow-lg items-center text-sm">
      <span className="font-semibold text-xs ml-2 uppercase opacity-70">Demo Mode:</span>
      <Link 
        href="?demo_role=donor" 
        className={`px-3 py-1.5 rounded-full transition-all ${currentRole === 'donor' ? 'bg-primary text-white font-medium' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
      >
        Donor
      </Link>
      <Link 
        href="?demo_role=recipient" 
        className={`px-3 py-1.5 rounded-full transition-all ${currentRole === 'recipient' ? 'bg-primary text-white font-medium' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
      >
        Recipient
      </Link>
      <Link 
        href="?demo_role=admin" 
        className={`px-3 py-1.5 rounded-full transition-all ${currentRole === 'admin' ? 'bg-primary text-white font-medium' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
      >
        Admin
      </Link>
    </div>
  )
}
