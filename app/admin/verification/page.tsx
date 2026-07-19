import { getSupabaseService } from '@/lib/supabaseService.server'
import { VerificationClient } from '@/components/admin/VerificationClient'
import type { VerificationItem, EligibilityReviewItem } from '@/lib/supabaseService'

export const metadata = {
  title: 'Verification Center - Foosha Admin',
}

export default async function VerificationPage() {
  const supabaseService = await getSupabaseService()
  const [feed, eligibilityReview] = await Promise.all([
    supabaseService.getVerificationFeed().catch((err) => {
      console.error('Failed to load verification feed:', err)
      return [] as VerificationItem[]
    }),
    supabaseService.getEligibilityReview().catch((err) => {
      console.error('Failed to load eligibility review:', err)
      return [] as EligibilityReviewItem[]
    }),
  ])
  return <VerificationClient initialFeed={feed} initialEligibilityReview={eligibilityReview} />
}
