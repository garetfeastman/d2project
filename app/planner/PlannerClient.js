'use client'
import { useState } from 'react'
import { GEAR_SLOTS, ARMOR_SLOTS, WEAPONS, GEAR_SETS, BRANDS } from '@/lib/gearData'

const ROLES = ['DPS', 'Tank', 'Healer', 'Support', 'Skill', 'Hybrid']

function getArmorOptions(slot) {
  const s = GEAR_SLOTS[slot] || {}
  return [
    { label: '— Exotics —', options: s.exotics || [] },
    { label: '— Named —', options: s.named || [] },
    { label: '— Brands —', options: BRANDS },
    { label: '— Gear Sets —', options: GEAR_SETS },
  ]
}

function getWeaponOptions(category) {
  const w = WEAPONS[category] || {}
  return [
    { label: '— Exotics —', options: w.exotic || [] },
    { label: '— Named —', options: w.named || [] },
    { label: '— Standard —', options: w.standard || [] },
  ]
}

const WEAPON_SLOTS = ['Primary', 'Secondary', 'Sidearm']

export default function PlannerClient({ initialPlans, currentUserId, currentUsername }) {
  const [plans, setPlans] = useState(initialPlans)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    role: 'DPS',
    description: '',
    loadout: {
      Mask: '', Backpack: '', Chest: '', Gloves: '', Holster: '', Kneepads: '',
      PrimaryCategory: 'Assault Rifles', Primary: '',
      SecondaryCategory: 'Submachine Guns', Secondary: '',
      SidearmCategory: 'Pistols', Sidearm: '',
    },
  })
  const [saving, setSaving] = useState(false)

  const setSlot = (slot, val) => setForm(f => ({ ...f, loadout: { ...f.loadout, [slot]: val } }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const res = await fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const plan = await res.json()
    setPlans(prev => [plan, ...prev])
    setForm({ name: '', role: 'DPS', description: '', loadout: { Mask: '', Backpack: '', Chest: '', Gloves: '', Holster: '', Kneepads: '', PrimaryCategory: 'Assault Rifles', Primary: '', SecondaryCategory: 'Submachine Guns', Secondary: '', SidearmCategory: 'Pistols', Sidearm: '' } })
    setShowForm(false)
    setSaving(false)
  }

  const deletePlan = async (id) => {
    await fetch(`/api/planner/${id}`, { method: 'DELETE' })
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-1">Build Planner</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--text)' }}>Builds</h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Plan and share build ideas with your squad.</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Build'}
        </button>
      </div>

      {/* New build form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6 space-y-4">
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', color: '#374151' }}>New Build Plan</p>
          <div className="flex gap-3 flex-wrap">
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Build name (e.g. Glass Cannon DPS)" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900" style={{ minWidth: 200 }} />
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 bg-white">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description / notes (optional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900" />

          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em', marginBottom: 8 }}>Armor</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ARMOR_SLOTS.map(slot => (
                <div key={slot}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 3 }}>{slot}</label>
                  <select value={form.loadout[slot]} onChange={e => setSlot(slot, e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-900 bg-white">
                    <option value="">— Empty —</option>
                    {getArmorOptions(slot).map(group => (
                      group.options.length > 0 && (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </optgroup>
                      )
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em', marginBottom: 8 }}>Weapons</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {WEAPON_SLOTS.map(slot => (
                <div key={slot}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 3 }}>{slot}</label>
                  <select value={form.loadout[`${slot}Category`]} onChange={e => { setSlot(`${slot}Category`, e.target.value); setSlot(slot, '') }} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-900 bg-white mb-1">
                    {Object.keys(WEAPONS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select value={form.loadout[slot]} onChange={e => setSlot(slot, e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-900 bg-white">
                    <option value="">— None —</option>
                    {getWeaponOptions(form.loadout[`${slot}Category`]).map(group => (
                      group.options.length > 0 && (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </optgroup>
                      )
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save Build'}
          </button>
        </form>
      )}

      {/* Build cards */}
      {plans.length === 0 ? (
        <div className="card p-10 text-center" style={{ color: '#9ca3af' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔧</p>
          <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>No builds yet</p>
          <p style={{ fontSize: '0.85rem' }}>Click "New Build" to plan your first loadout</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(plan => <BuildCard key={plan.id} plan={plan} isOwn={plan.userId === currentUserId} onDelete={deletePlan} />)}
        </div>
      )}
    </div>
  )
}

function BuildCard({ plan, isOwn, onDelete }) {
  const loadout = (() => { try { return JSON.parse(plan.loadout) } catch { return {} } })()
  const roleColors = { DPS: '#ef4444', Tank: '#3b82f6', Healer: '#22c55e', Support: '#8b5cf6', Skill: '#06b6d4', Hybrid: '#f97316' }

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', color: '#111827' }}>{plan.name}</h3>
            {plan.role && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: roleColors[plan.role] || '#6b7280', color: 'white', textTransform: 'uppercase' }}>{plan.role}</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>by {plan.user.username}</p>
          {plan.description && <p style={{ fontSize: '0.85rem', color: '#374151', marginTop: 4 }}>{plan.description}</p>}
        </div>
        {isOwn && (
          <button onClick={() => onDelete(plan.id)} style={{ color: '#9ca3af', flexShrink: 0 }} className="hover:text-red-500 transition-colors p-1">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
        {['Mask','Backpack','Chest','Gloves','Holster','Kneepads'].map(slot => (
          <div key={slot} className="flex justify-between text-xs">
            <span style={{ color: '#9ca3af', fontWeight: 600 }}>{slot}</span>
            <span style={{ color: loadout[slot] ? '#111827' : '#d1d5db', fontWeight: 700 }} className="truncate ml-2">{loadout[slot] || '—'}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-2 space-y-1">
        {['Primary','Secondary','Sidearm'].map(slot => (
          <div key={slot} className="flex justify-between text-xs">
            <span style={{ color: '#9ca3af', fontWeight: 600 }}>{slot}</span>
            <span style={{ color: loadout[slot] ? '#111827' : '#d1d5db', fontWeight: 700 }} className="truncate ml-2">{loadout[slot] || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
