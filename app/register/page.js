'use client'
import { useActionState } from 'react'
import { registerUser } from '@/app/actions/auth'
import Link from 'next/link'

const PLATFORMS = [
  { id: 'PC', label: 'PC' },
  { id: 'PS', label: 'PlayStation' },
  { id: 'Xbox', label: 'Xbox' },
]

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerUser, null)
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase' }}>
            Division<span style={{ color: '#f97316' }}>Hub</span>
          </h1>
          <p className="font-bold text-gray-700">Join the Division 2 community — it&apos;s free</p>
        </div>
        <div className="card p-8">
          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username / Callsign</label>
              <input name="username" type="text" required className="field" placeholder="AgentCallsign" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input name="email" type="email" required className="field" placeholder="agent@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input name="password" type="password" required className="field" placeholder="Minimum 6 characters" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((p, i) => (
                  <label key={p.id} className="cursor-pointer">
                    <input type="radio" name="platform" value={p.id} defaultChecked={i === 0} className="sr-only peer" />
                    <div className="flex items-center justify-center py-3 px-2 rounded-lg border-2 border-gray-200 bg-white cursor-pointer transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 text-center">
                      <span className="text-sm font-black text-gray-900">{p.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {state?.error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{state.error}</div>}
            <button type="submit" disabled={pending} className="btn-primary w-full justify-center py-3 disabled:opacity-50" style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
              {pending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Already an agent?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
