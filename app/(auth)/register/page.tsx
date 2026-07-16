import { RegisterForm } from '@/components/auth/RegisterForm'
import { getUserOrNull } from '@/lib/auth/guards'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Register - Foosha',
  description: 'Create a new Foosha account',
}

export default async function RegisterPage() {
  const user = await getUserOrNull()
  
  if (user) {
    redirect('/dashboard')
  }

  return <RegisterForm />
}
