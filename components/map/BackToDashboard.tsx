'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BackToDashboardProps {
  /** Override the default destination (defaults to /dashboard) */
  href?: string
}

export default function BackToDashboard({ href = '/dashboard' }: BackToDashboardProps) {
  return (
    <Link
      href={href}
      className="back-to-dashboard-btn"
      aria-label="Back to Dashboard"
    >
      <ArrowLeft size={18} strokeWidth={2.5} />
      <span>Back to Dashboard</span>
    </Link>
  )
}
