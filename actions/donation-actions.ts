'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Matches the two donation types from the frontend toggle
type DonationKind = 'food' | 'cash'

// The shape of data submitted by the frontend /donor/new form
export interface DonationInput {
    kind: DonationKind
    description: string         // "What are you giving?" — e.g. "Rice (5kg), canned sardines"
    amountPhp?: number          // Only for cash donations — e.g. 200, 500, 1000
    barangay?: string           // Donor's barangay, resolved from profile
}

export async function createDonationAction(input: DonationInput) {
    const supabase = await createClient()

    // 1. Get the current logged-in user
    const { data: { user } } = await supabase.auth.getUser()

    // SECURITY CHECK: Reject immediately if user is not logged in
    if (!user) {
        return { success: false, error: 'Unauthorized: You must be logged in to submit a donation.' }
    }

    // 2. Resolve the donor's display name from their profile
    const { data: profile } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single()

    const donorName = profile?.full_name ?? user.email ?? 'Anonymous'

    // 3. Insert the data into our donations table in Supabase
    const { data, error } = await supabase
        .from('donations')
        .insert([
            {
                donor_id: user.id,
                donor_name: donorName,
                kind: input.kind,
                description: input.description,
                amount_php: input.kind === 'cash' ? (input.amountPhp ?? null) : null,
                barangay: input.barangay ?? null,
                status: 'matching',         // Initial status after submission
            }
        ])
        .select()

    // 4. Handle database insert errors
    if (error) {
        console.error('Error inserting donation:', error.message)
        return { success: false, error: error.message }
    }

    // 5. Force Next.js to refresh cached pages displaying donations
    revalidatePath('/donor/history')
    revalidatePath('/donor')

    return { success: true, data }
}
