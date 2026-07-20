'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/service'

export async function createHelpRequestAction(formData: FormData) {
  const type = formData.get('type') as string
  const reason = formData.get('reason') as string
  const familySize = formData.get('familySize') as string
  const address = formData.get('address') as string

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (!type || !reason || !address) {
    return { error: 'Please fill out all required fields.' }
  }

  console.log('Mock Help Request Created:', { type, reason, familySize, address })

  revalidatePath('/dashboard')
  return { success: true, message: 'Your request for assistance has been submitted successfully.' }
}

export async function confirmPickupByCodeAction(code: string) {
  const supabase = createAdminClient()

  // 1. Find the match by code
  const { data: match, error: fetchError } = await supabase
    .from('matches')
    .select('*')
    .eq('verification_code', code)
    .eq('status', 'pending')
    .single()

  if (fetchError || !match) {
    throw new Error('That code is invalid or has already been used.')
  }

  // 2. Update match status
  const { error: matchError } = await supabase
    .from('matches')
    .update({ status: 'confirmed' })
    .eq('id', match.id)

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

  revalidatePath('/dashboard')
  return { success: true }
}
