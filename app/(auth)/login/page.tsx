import { LoginForm } from '@/components/auth/LoginForm'
import { getUserOrNull } from '@/lib/auth/guards'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Login - Foosha',
  description: 'Sign in to your Foosha account',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getUserOrNull()
  
  if (user) {
    redirect('/dashboard')
  }

  const { next } = await searchParams
  const nextUrl = typeof next === 'string' ? next : undefined

  return <LoginForm nextUrl={nextUrl} />
}
