'use client'
import { useState } from 'react'
import { GEAR_SETS, GEAR_SLOTS, WEAPONS, ARMOR_SLOTS } from '@/lib/gearData'

const PRIORITY_COLORS = { low: '#22c55e', medium: '#f97316', high: '#ef4444' }
const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' }

function getItemOptions(itemType, slot) {
  if (itemType === 'gear_set') return GEAR_SETS
  if (itemType === 'armor' && slot && GEAR_SLOTS[slot]) {
    const s = GEAR_SLOTS[slot]
    return [...(s.exotics || []), ...(s.named || []), '— Brand Piece —', '— Gear Set Piece —']
  }
  if (itemType === 'weapon' && slot && WEAPONS[slot]) {
    const w = WEAPONS[slot]
    return [...(w.exotic || []), ...(w.named || []), ...(w.standard || [])]
  }
  return []
}

export default function WishlistClient({ initialItems, currentUserId, currentUsername }) {
  const [items, setItems] = useState(initialItems)
  const [form, setForm] = useState({ itemType: 'armor', slot: 'Mask', itemName: '', priority: 'medium', notes: '' })
  const [saving, setSaving] = useState(false)

  const myItems = items.filter(i => i.userId === currentUserId)
  const othersMap = items
    .filter(i => i.userId !== currentUserId)
    .reduce((acc, i) => {
      const u = i.user.username
      if (!acc[u]) acc[u] = []
      acc[u].push(i)
      return acc
    }, {})

  const refresh = async () => {
    const res = await fetch('/api/wishlist')
    setItems(await res.json())
  }

  const slotOptions = form.itemType === 'armor' ? ARMOR_SLOTS : (form.itemType === 'weapon' ? Object.keys(WEAPONS) : [])
  const itemOptions = getItemOptions(form.itemType, form.slot)

  const handleTypeChange = (itemType) => {
    const newSlot = itemType === 'armor' ? 'Mask' : itemType === 'weapon' ? 'Assault Rifles' : ''
    setForm(f => ({ ...f, itemType, slot: newSlot, itemName: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.itemName) return
    setSaving(true)
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    await refresh()
    setForm(f => ({ ...f, itemName: '', notes: '' }))
    setSaving(false)
  }

  const toggleAcquired = async (id, acquired) => {
    await fetch(`/api/wishlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acquired: !acquired }),
    })
    setItems(prev => prev.map(i => i.id === id ? { ...i, acquired: !acquired } : i))
  }

  const deleteItem = async (id) => {
    await fetch(`/api/wishlist/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <p className="eyebrow mb-1">Gear Tracker</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--text)' }}>Wishlist</h1>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Track the gear you're hunting. Check off what you find.</p>
      </div>

      <div className="flex gap-6 items-start flex-wrap lg:flex-nowrap">
        {/* My list */}
        <div className="flex-1 min-w-0" style={{ minWidth: 300 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 12 }}>
            My List — {currentUsername}
          </h2>

          {/* Add form */}
          <form onSubmit={handleSubmit} className="card p-4 mb-4 space-y-3">
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Add Item</p>
            <div className="flex gap-2 flex-wrap">
              <select value={form.itemType} onChange={e => handleTypeChange(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 bg-white" style={{ minWidth: 110 }}>
                <option value="armor">Armor</option>
                <option value="weapon">Weapon</option>
                <option value="gear_set">Gear Set</option>
              </select>
              {slotOptions.length > 0 && (
                <select value={form.slot} onChange={e => setForm(f => ({ ...f, slot: e.target.value, itemName: '' }))} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 bg-white" style={{ minWidth: 110 }}>
                  {slotOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>
            <select value={form.itemName} onChange={e => setForm(f => ({ ...f, itemName: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 bg-white" required>
              <option value="">Select item...</option>
              {itemOptions.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <div className="flex gap-2">
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 bg-white">
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes (optional)" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white" />
            </div>
            <button type="submit" disabled={saving || !form.itemName} className="btn-primary w-full justify-center" style={{ opacity: saving || !form.itemName ? 0.5 : 1 }}>
              {saving ? 'Adding...' : '+ Add to Wishlist'}
            </button>
          </form>

          {/* My items */}
          <div className="space-y-2">
            {myItems.length === 0 && (
              <div className="card p-6 text-center" style={{ color: '#9ca3af' }}>
                <p style={{ fontSize: '2rem', marginBottom: 8 }}>📋</p>
                <p style={{ fontWeight: 700 }}>No items yet</p>
                <p style={{ fontSize: '0.85rem' }}>Add gear you want to hunt above</p>
              </div>
            )}
            {myItems.map(item => (
              <WishlistCard key={item.id} item={item} isOwn onToggle={toggleAcquired} onDelete={deleteItem} />
            ))}
          </div>
        </div>

        {/* Others' lists */}
        <div className="flex-1 min-w-0" style={{ minWidth: 300 }}>
          {Object.keys(othersMap).length === 0 ? (
            <div className="card p-6 text-center" style={{ color: '#9ca3af' }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>👥</p>
              <p style={{ fontWeight: 700 }}>No one else has a wishlist yet</p>
              <p style={{ fontSize: '0.85rem' }}>Invite your buddy to create an account</p>
            </div>
          ) : (
            Object.entries(othersMap).map(([username, userItems]) => (
              <div key={username} className="mb-6">
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 12 }}>
                  {username}'s List
                </h2>
                <div className="space-y-2">
                  {userItems.map(item => (
                    <WishlistCard key={item.id} item={item} isOwn={false} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function WishlistCard({ item, isOwn, onToggle, onDelete }) {
  const typeColors = { armor: '#3b82f6', weapon: '#8b5cf6', gear_set: '#f97316' }
  return (
    <div className="card p-3 flex items-start gap-3" style={{ opacity: item.acquired ? 0.5 : 1 }}>
      {isOwn && (
        <input type="checkbox" checked={item.acquired} onChange={() => onToggle(item.id, item.acquired)}
          style={{ marginTop: 2, width: 16, height: 16, accentColor: '#f97316', flexShrink: 0, cursor: 'pointer' }} />
      )}
      {!isOwn && (
        <div style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, borderRadius: '50%', background: item.acquired ? '#22c55e' : '#d1d5db' }} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', textDecoration: item.acquired ? 'line-through' : 'none' }} className="truncate">{item.itemName}</p>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: typeColors[item.itemType] || '#6b7280', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>{item.itemType.replace('_', ' ')}</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: PRIORITY_COLORS[item.priority], color: 'white', flexShrink: 0 }}>{PRIORITY_LABELS[item.priority]}</span>
        </div>
        {item.slot && <p style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>{item.slot}</p>}
        {item.notes && <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 2 }}>{item.notes}</p>}
      </div>
      {isOwn && (
        <button onClick={() => onDelete(item.id)} style={{ color: '#9ca3af', flexShrink: 0, padding: 4, lineHeight: 1 }} className="hover:text-red-500 transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      )}
    </div>
  )
}
