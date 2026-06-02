'use client'
import { useActionState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { setupUsername } from '@/app/actions/setupUsername'
import { AVATAR_ICONS, MASK_ICONS, AvatarIcon } from '@/app/components/AvatarIcon'

const PLATFORMS = [
  { id: 'PC', label: 'PC' },
  { id: 'PS', label: 'PlayStation' },
  { id: 'Xbox', label: 'Xbox' },
]

export default function SetupUsernamePage() {
  const { update } = useSession()
  const router = useRouter()
  const [state, formAction, pending] = useActionState(setupUsername, null)
  const [selectedIcon, setSelectedIcon] = useState('shd')

  useEffect(() => {
    if (state?.success) {
      update().then(() => {
        router.refresh()
        router.push('/feed')
      })
    }
  }, [state, update, router])

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <h1 className="text-4xl text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase' }}>
          Welcome, Agent
        </h1>
        <p className="font-bold text-gray-700">Choose your callsign and icon to join the network</p>
      </div>
      <div className="card p-8">
        <form action={formAction} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-1.5">Callsign / Username</label>
            <input name="username" type="text" required className="field" placeholder="AgentCallsign"
              pattern="[a-zA-Z0-9_\-]+" minLength={3} />
            <p className="text-xs font-bold text-gray-600 mt-1">Letters, numbers, underscores and hyphens only</p>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">Platform</label>
            <div className="flex gap-3">
              {PLATFORMS.map((p, i) => (
                <label key={p.id} className="cursor-pointer flex-1">
                  <input type="radio" name="platform" value={p.id} defaultChecked={i === 0} className="sr-only peer" />
                  <div className="flex items-center justify-center py-3 px-2 rounded-lg border-2 border-gray-200 bg-white cursor-pointer transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                    <span className="text-sm font-black text-gray-900">{p.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-1">Agent Icon</label>
            <p className="text-xs font-bold text-gray-600 mb-3">Hunter Masks</p>
            <input type="hidden" name="avatar" value={selectedIcon} />
            <div className="grid grid-cols-5 gap-3 mb-4">
              {MASK_ICONS.map(icon => (
                <button key={icon.key} type="button" onClick={() => setSelectedIcon(icon.key)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    selectedIcon === icon.key ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <AvatarIcon iconKey={icon.key} size={48} />
                  <span className="text-xs font-bold text-gray-900 text-center leading-tight">{icon.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-gray-600 mb-3">SHD Icons</p>
            <div className="grid grid-cols-5 gap-3">
              {AVATAR_ICONS.map(icon => (
                <button key={icon.key} type="button" onClick={() => setSelectedIcon(icon.key)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    selectedIcon === icon.key ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <AvatarIcon iconKey={icon.key} size={48} />
                  <span className="text-xs font-bold text-gray-900 text-center leading-tight">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-3 rounded-lg">{state.error}</div>
          )}
          <button type="submit" disabled={pending} className="btn-primary w-full justify-center py-3 disabled:opacity-50"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
            {pending ? 'Saving...' : 'Set Callsign'}
          </button>
        </form>
      </div>
    </div>
  )
}
