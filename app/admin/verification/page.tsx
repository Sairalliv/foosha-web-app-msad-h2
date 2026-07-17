import { getSupabaseService } from '@/lib/supabaseService.server'
import { VerificationClient } from '@/components/admin/VerificationClient'

export const metadata = {
  title: 'Verification Center - Foosha Admin',
}

export default async function VerificationPage() {
  const supabaseService = await getSupabaseService()
  const [feed, eligibilityReview] = await Promise.all([
    supabaseService.getVerificationFeed(),
    supabaseService.getEligibilityReview(),
  ])
  return <VerificationClient initialFeed={feed} initialEligibilityReview={eligibilityReview} />
}
