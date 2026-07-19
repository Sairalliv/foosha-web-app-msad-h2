'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/dashboard'

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(next)
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const role = formData.get('role') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  })

  if (error) {
    console.error('Signup error:', error)
    const rawMsg = error.message
    const errorMessage = typeof rawMsg === 'string' && rawMsg.length > 0 && rawMsg !== '{}'
      ? rawMsg 
      : JSON.stringify(error) !== '{}' ? JSON.stringify(error) : 'Database error: Ensure the "full_name" column exists in profiles.'
    return { error: errorMessage }
  }

  // Usually users need to confirm their email depending on Supabase settings.
  // For this example, we'll redirect them to dashboard (if auto-confirm is enabled)
  // or they'll be asked to check their email.
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
