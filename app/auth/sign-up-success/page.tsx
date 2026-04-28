import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] text-center">
        <div className="w-12 h-12 border border-border flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-foreground mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {"We've sent you a confirmation link. Click the link to verify your account."}
        </p>

        <Link
          href="/auth/login"
          className="inline-block w-full h-11 leading-[44px] bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Back to login
        </Link>
      </div>
    </main>
  )
}
