import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] text-center">
        <div className="w-12 h-12 border border-destructive flex items-center justify-center mx-auto mb-6">
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
            className="text-destructive"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-foreground mb-2">Authentication error</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Something went wrong during authentication. Please try again.
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
