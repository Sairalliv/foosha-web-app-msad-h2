'use server'

import { createAdminClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

export async function approveEligibilityAction(requestId: string) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('requests')
    .update({ verification_status: 'approved' })
    .eq('id', requestId)
    
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/verification')
}

export async function requestMoreInfoAction(requestId: string) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('requests')
    .update({ verification_status: 'needs_info' })
    .eq('id', requestId)
    
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/verification')
}

export async function createMatchAction(donationId: string, requestId: string) {
  const supabase = createAdminClient()

  // Simulate a transaction since we don't have the RPC
  // 1. Insert the match
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert({
      donation_id: donationId,
      request_id: requestId,
      status: 'pending',
      verification_code: Math.random().toString(36).substring(2, 8).toUpperCase()
    })
    .select()
    .single()

  if (matchError) throw new Error(matchError.message)

  // 2. Update donation status
  const { error: donationError } = await supabase
    .from('donations')
    .update({ status: 'matching' })
    .eq('id', donationId)
    
  if (donationError) throw new Error(donationError.message)

  // 3. Update request status
  const { error: requestError } = await supabase
    .from('requests')
    .update({ status: 'matching' })
    .eq('id', requestId)
    
  if (requestError) throw new Error(requestError.message)

  revalidatePath('/admin/matching')
  return match
}

export async function confirmMatchPickupAction(matchId: string, code: string) {
  const supabase = createAdminClient()

  // 1. Get the match and verify the code
  const { data: match, error: fetchError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single()

  if (fetchError) throw new Error(fetchError.message)
  if (!match) throw new Error('Match not found')
  if (match.verification_code !== code) throw new Error('Invalid verification code')

  // 2. Update match status
  const { error: matchError } = await supabase
    .from('matches')
    .update({ status: 'confirmed' })
    .eq('id', matchId)

  if (matchError) throw new Error(matchError.message)

  // 3. Update donation status
  const { error: donationError } = await supabase
    .from('donations')
    .update({ status: 'Given' })
    .eq('id', match.donation_id)
    
  if (donationError) throw new Error(donationError.message)

  // 4. Update request status
  const { error: requestError } = await supabase
    .from('requests')
    .update({ status: 'confirmed' })
    .eq('id', match.request_id)
    
  if (requestError) throw new Error(requestError.message)

  revalidatePath('/admin/verification')
  revalidatePath('/admin/analytics')
  return match
}
