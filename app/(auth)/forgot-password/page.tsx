import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { getUserOrNull } from '@/lib/auth/guards'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Forgot Password - Foosha',
  description: 'Reset your Foosha password',
}

export default async function ForgotPasswordPage() {
  const user = await getUserOrNull()
  
  if (user) {
    redirect('/dashboard')
  }

  return <ForgotPasswordForm />
}
