'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string
}

export function SubmitButton({ children, pendingText = 'Submitting...', ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      {...props}
      type="submit"
      disabled={pending || props.disabled}
      className={`auth-submit${pending ? ' loading' : ''} ${props.className || ''}`}
    >
      {pending ? pendingText : children}
    </button>
  )
}
