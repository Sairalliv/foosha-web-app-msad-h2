import { supabaseService } from '@/lib/supabaseService'
import { VerificationClient } from '@/components/admin/VerificationClient'

export const metadata = {
  title: 'Verification Center - Foosha Admin',
}

export default async function VerificationPage() {
  const [feed, eligibilityReview] = await Promise.all([
    supabaseService.getVerificationFeed(),
    supabaseService.getEligibilityReview(),
  ])
  return <VerificationClient initialFeed={feed} initialEligibilityReview={eligibilityReview} />
}
