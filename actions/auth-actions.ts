'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

type RegistrationState = {
  error?: string
  success?: string
}

function registrationErrorMessage(error: { message?: string; status?: number }) {
  const message = error.message?.toLowerCase() ?? ''

  if (error.status === 429 || message.includes('rate limit')) {
    return 'Too many sign-up attempts. Please wait a few minutes and try again.'
  }

  if (
    error.status === 500 ||
    /smtp|mailer|confirmation email|send.*email|email.*(send|deliver)|email provider/.test(message)
  ) {
    return 'Unable to send the verification email right now. Please try again shortly or contact the administrator.'
  }

  if (message.includes('invalid email')) {
    return 'Please enter a valid email address.'
  }

  return 'We could not create your account right now. Please try again later.'
}

async function getEmailRedirectUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (configuredSiteUrl) return `${configuredSiteUrl}/auth/callback`

  const origin = (await headers()).get('origin')
  return origin ? `${origin}/auth/callback` : undefined
}

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

export async function registerAction(formData: FormData): Promise<RegistrationState> {
  const email = (formData.get('email') as string | null)?.trim()
  const password = formData.get('password') as string | null
  const fullName = (formData.get('full_name') as string | null)?.trim()
  const role = formData.get('role') as string | null

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  if (!fullName || !role) {
    return { error: 'Full name and account type are required' }
  }

  const supabase = await createClient()
  const emailRedirectTo = await getEmailRedirectUrl()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      ...(emailRedirectTo ? { emailRedirectTo } : {}),
      data: {
        full_name: fullName,
        role: role,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    },
  })

  if (error) {
    console.error('Signup error:', error)
    
    let errorMessage = 'An unexpected error occurred during sign up.'
    if (error.message && error.message !== '{}') {
      errorMessage = error.message
    } else if (error.status === 500) {
      errorMessage = 'Server configuration error: Unable to send confirmation email. Please check SMTP settings.'
    }
    
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
  redirect('/')
}
