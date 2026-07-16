import { Suspense } from 'react'
import { RoleAuth } from '@/components/auth/RoleAuth'
import { getUserOrNull } from '@/lib/auth/guards'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Sign Up & Login - Foosha',
  description: 'Select your role and sign in to Foosha',
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoleAuth />
    </Suspense>
  )
}
