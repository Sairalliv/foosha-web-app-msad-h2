'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Define the shape of data coming from the frontend form
interface DonationInput {
    foodName: string;
    category: string;
    quantity: string;
    expiryDate: string;
    pickupAddress: string;
    contactNumber: string;
    pickupTime: string;
}

export async function createDonationAction(formData: DonationInput) {
    const supabase = await createClient()

    // 1. Get the current logged-in user
    const { data: { user } } = await supabase.auth.getUser()

    // SECURITY CHECK: Reject immediately if user is not logged in
    if (!user) {
        return { success: false, error: 'Unauthorized: You must be logged in to submit a donation.' }
    }

    // 2. Insert the data into our donations table in Supabase
    const { data, error } = await supabase
        .from('donations')
        .insert([
            {
                food_name: formData.foodName,
                category: formData.category,
                quantity: formData.quantity,
                expiry_date: formData.expiryDate,
                pickup_address: formData.pickupAddress,
                contact_number: formData.contactNumber,
                pickup_time: formData.pickupTime,
                donor_id: user.id, // Assured to be defined because of the check above
                status: 'pending'
            }
        ])
        .select()

    // 3. Handle database insert errors
    if (error) {
        console.error('Error inserting donation:', error.message)
        return { success: false, error: error.message }
    }

    // 4. Force Next.js to refresh cached pages displaying donations
    revalidatePath('/')
    return { success: true, data }
}
