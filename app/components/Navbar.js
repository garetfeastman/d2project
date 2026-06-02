'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { AvatarIcon } from './AvatarIcon'
import NewPostModal from './NewPostModal'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [postOpen, setPostOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ height: '60px', background: '#000000', borderBottom: '1px solid #1e2d42', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-1.5 flex-shrink-0">
          <Image src="/SHDlogo.png" alt="SHD Logo" width={42} height={42} style={{ display: 'block' }} />
          <span className="text-white text-2xl tracking-widest leading-none" style={{ fontFamily: 'var(--font-logo)' }}>
            DIVISION<span style={{ color: '#f97316' }}>HUB</span>
          </span>
        </Link>
        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          <Link href="/feed" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors">Feed</Link>
          <Link href="/feed?filter=builds" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors">Builds</Link>
          <Link href="/feed?filter=videos" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors">Videos</Link>
          <Link href="/feed?filter=lfg" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors">Looking for Group</Link>
          <Link href="/feed?filter=discussion" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors">Discussion</Link>
          <Link href="/wishlist" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors">Wishlist</Link>
          <Link href="/planner" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors">Planner</Link>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {session ? (
            <>
              {session.user.needsUsernameSetup && (
                <Link href="/setup-username" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-white text-xs font-bold rounded-lg transition-colors">
                  ⚠ Set Username
                </Link>
              )}
              <button onClick={() => setPostOpen(true)} className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold rounded-lg transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="text-base leading-none">+</span> New Post
              </button>
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <AvatarIcon iconKey={session.user.avatar} size={36} />
                  <span className="hidden md:block text-white text-sm font-semibold">{session.user.username}</span>
                  <svg className="w-4 h-4 text-zinc-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-52 rounded-xl shadow-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #dce3ed' }}>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-gray-900 font-black text-sm">{session.user.username}</p>
                    </div>
                    <Link href={`/profile/${session.user.username}`} className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(false)}>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Profile
                    </Link>
                    {session.user.needsUsernameSetup && (
                      <Link href="/setup-username" className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-yellow-600 hover:bg-yellow-50 transition-colors" onClick={() => setMenuOpen(false)}>
                        ⚠ Set Your Username
                      </Link>
                    )}
                    <button onClick={() => { setMenuOpen(false); setPostOpen(true) }} className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors md:hidden text-left">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      New Post
                    </button>
                    <Link href="/wishlist" className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(false)}>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Wishlist
                    </Link>
                    <Link href="/planner" className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(false)}>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                      Planner
                    </Link>
                    <div className="border-t border-gray-100">
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-zinc-300 hover:text-white text-sm font-semibold transition-colors">Sign In</Link>
              <Link href="/register" className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold rounded-lg transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>Enlist</Link>
            </div>
          )}
        </div>
      </div>
      <NewPostModal isOpen={postOpen} onClose={() => setPostOpen(false)} />
    </nav>
  )
}
