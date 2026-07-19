'use server'

import { revalidatePath } from 'next/cache'

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
