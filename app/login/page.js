'use client'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.target)
    const result = await signIn('credentials', { email: fd.get('email'), password: fd.get('password'), redirect: false })
    setLoading(false)
    if (result?.error) setError('Wrong email or password. Please try again.')
    else { router.push('/feed'); router.refresh() }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/feed' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase' }}>
            Division<span style={{ color: '#f97316' }}>Hub</span>
          </h1>
          <p className="font-bold text-gray-700">Sign in to connect with the community</p>
        </div>
        <div className="card p-8">
          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-bold px-4 py-3 rounded-lg mb-5">
              ✓ Account created — sign in below.
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-900 text-sm mb-5 disabled:opacity-50"
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black text-gray-900 mb-1.5">Email Address</label>
              <input name="email" type="email" required autoComplete="email" className="field" placeholder="agent@example.com" />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-900 mb-1.5">Password</label>
              <input name="password" type="password" required autoComplete="current-password" className="field" placeholder="••••••••" />
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-3 rounded-lg">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-50" style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="font-bold text-gray-700 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-orange-500 hover:text-orange-600 font-black transition-colors">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
