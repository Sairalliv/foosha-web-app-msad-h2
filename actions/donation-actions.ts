'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Donation, DonationType } from '@/lib/supabase/types'

// The shape of data submitted by the frontend DonationForm
export interface DonationInput {
  type: DonationType
  category?: string | null
  description?: string | null
  quantity?: number | null
  amount?: number | null
  location: string
}

export async function createDonationAction(input: DonationInput) {
  const supabase = await createClient()

  // 1. Get the current logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // SECURITY CHECK: Reject immediately if user is not logged in
  if (!user) {
    return { success: false, error: 'Unauthorized: You must be logged in to submit a donation.' }
  }

  // 2. Resolve the donor's display name from their profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const donorName = profile?.full_name ?? user.email ?? 'Anonymous'

  // 3. Insert the data into our donations table in Supabase
  const { data, error } = await supabase
    .from('donations')
    .insert({
      donor_id: user.id,
      donor_name: donorName,
      type: input.type,
      category: input.type === 'food' ? (input.category ?? null) : null,
      description: input.type === 'food' ? (input.description?.trim() ?? null) : null,
      quantity: input.type === 'food' ? (input.quantity ?? null) : null,
      amount: input.type === 'cash' ? (input.amount ?? null) : null,
      location: input.location.trim(),
      status: 'Waiting', // all new submissions start out unconfirmed (Waiting)
    })
    .select()
    .single()

  // 4. Handle database insert errors
  if (error) {
    console.error('Error inserting donation:', error.message)
    return { success: false, error: error.message }
  }

  // 5. Force Next.js to refresh cached pages displaying donations
  revalidatePath('/donor')
  revalidatePath('/dashboard')

  return { success: true, data: data as Donation }
}
