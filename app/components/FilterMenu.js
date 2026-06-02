'use client'
import { useState } from 'react'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/feed',                    label: 'All Posts',          icon: '🏠', key: 'All' },
  { href: '/feed?filter=DPS',         label: 'DPS Builds',         icon: '🔫', key: 'DPS' },
  { href: '/feed?filter=Healer',      label: 'Healer Builds',      icon: '💊', key: 'Healer' },
  { href: '/feed?filter=Tank',        label: 'Tank Builds',        icon: '🛡️', key: 'Tank' },
  { href: '/feed?filter=Support',     label: 'Support Builds',     icon: '⚙️', key: 'Support' },
  { href: '/feed?filter=Status',      label: 'Status Builds',      icon: '☣️', key: 'Status' },
  { href: '/feed?filter=discussion',  label: 'Discussion',         icon: '💬', key: 'discussion' },
]

export default function FilterMenu({ filter }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <span className="font-black text-gray-900 text-sm uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
          Filter Posts
        </span>
        <span className="text-gray-700 font-bold text-base leading-none">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="pb-2 px-1 border-t border-gray-100">
          {NAV_ITEMS.map(item => {
            const active = filter === item.key
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  active ? 'bg-orange-500 text-white' : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
