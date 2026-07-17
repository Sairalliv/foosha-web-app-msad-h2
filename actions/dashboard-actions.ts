'use server'

import { revalidatePath } from 'next/cache'

// Mock actions since there are no DB tables yet
export async function createDonationAction(formData: FormData) {
  const type = formData.get('type') as string
  const amount = formData.get('amount') as string
  const pickup = formData.get('pickup') as string
  const notes = formData.get('notes') as string

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (!type || !amount) {
    return { error: 'Please provide the donation type and amount.' }
  }

  console.log('Mock Donation Created:', { type, amount, pickup, notes })

  revalidatePath('/dashboard')
  return { success: true, message: 'Thank you! Your donation pledge has been recorded.' }
}

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
