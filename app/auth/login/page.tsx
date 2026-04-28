import { LoginForm } from './login-form'

// Skip static prerender so we don't try to read NEXT_PUBLIC_SUPABASE_*
// during build time when env vars aren't inlined.
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return <LoginForm />
}
