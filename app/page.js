import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const FEATURES = [
  { icon: '🔫', title: 'Share Builds', desc: 'Post your loadouts, gear stats, and breakdowns. Get feedback from the community.' },
  { icon: '🤝', title: 'Find Teammates', desc: 'Post LFG requests and squad up for heroic missions, raids, and Dark Zone runs.' },
  { icon: '🎬', title: 'Watch Footage', desc: 'Embed YouTube clips — highlight reels, build breakdowns, and field recordings.' },
]

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/feed')
  return (
    <div>
      {/* Hero - dark band */}
      <section style={{ background: '#0f1827', borderBottom: '1px solid #1e2d42' }} className="py-20 md:py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow mb-4">The Division 2 Community</p>
          <h1 className="text-5xl md:text-6xl text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, lineHeight: 1, textTransform: 'uppercase' }}>
            The Facebook for<br /><span style={{ color: '#f97316' }}>Division 2</span>
          </h1>
          <p className="text-zinc-300 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Share builds, find teammates, and connect with agents across Washington D.C.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}>Create Free Account</Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white rounded-lg font-semibold transition-colors text-base">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">What You Can Do</p>
            <h2 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)' }}>Built for Division Agents</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-8">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl text-gray-900 font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ background: '#f97316' }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase' }}>Ready to Join?</h2>
          <p className="text-orange-100 mb-8 text-lg">Free to join. Start posting builds and finding teammates today.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-orange-500 font-black rounded-lg transition-colors text-base" style={{ fontFamily: 'var(--font-heading)' }}>
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}
