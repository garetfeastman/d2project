import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PostCard from '@/app/components/PostCard'
import FilterMenu from '@/app/components/FilterMenu'
import { AvatarIcon } from '@/app/components/AvatarIcon'
import PostPromptCard from '@/app/components/PostPromptCard'
import NewPostButton from '@/app/components/NewPostButton'
import LFGPostButton from '@/app/components/LFGPostButton'
import Link from 'next/link'

export default async function FeedPage({ searchParams }) {
  const session = await getServerSession(authOptions)
  const params = await searchParams
  const filter = params?.filter || 'All'

  const where = {}
  if (filter === 'lfg')         where.isLFG = true
  else if (filter === 'builds') where.buildRole = { not: null }
  else if (filter === 'videos') where.videoUrl  = { not: null }
  else if (filter === 'discussion') {
    where.isLFG    = false
    where.buildRole = null
    where.videoUrl  = null
  }
  else if (!['All'].includes(filter)) where.buildRole = filter

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

  const [posts, totalPosts, totalUsers, activeAgents] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { username: true, platform: true, avatar: true } },
        likes: { select: { userId: true } },
        comments: {
          include: { author: { select: { username: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      take: 50,
    }),
    prisma.post.count(),
    prisma.user.count(),
    prisma.user.count({ where: { lastActiveAt: { gte: fifteenMinutesAgo } } }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-5 items-start">

        {/* Left sidebar */}
        <div className="w-72 flex-shrink-0 space-y-3 hidden lg:block sticky top-20">

          {/* User card */}
          {session && (
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <AvatarIcon iconKey={session.user.avatar} size={40} />
                <div>
                  <p className="font-black text-sm text-gray-900">{session.user.username}</p>
                  <p className="text-xs font-bold text-gray-700">{session.user.platform}</p>
                </div>
              </div>
              <Link href={`/profile/${session.user.username}`} className="block w-full text-center py-2 text-sm font-bold text-orange-500 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200">
                View Profile
              </Link>
            </div>
          )}

          {/* Network Stats */}
          <div className="card p-5">
            <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>Network Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900 text-sm">Total Agents</span>
                <span className="font-black text-gray-900 text-sm">{totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-900 text-sm">Total Posts</span>
                <span className="font-black text-gray-900 text-sm">{totalPosts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">ISAC Connections</span>
                <span className="font-black text-orange-500 text-sm flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  {activeAgents}
                </span>
              </div>
            </div>
          </div>

          {/* Join Community (guests only) */}
          {!session && (
            <div className="card p-5">
              <h3 className="font-black text-gray-900 mb-2 text-sm uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>Join the Community</h3>
              <p className="font-bold text-gray-900 text-sm mb-4">Create a free account to post builds and find teammates.</p>
              <Link href="/register" className="btn-primary w-full justify-center mb-2">Enlist Now</Link>
              <Link href="/login" className="block w-full text-center py-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">Already an agent? Sign in</Link>
            </div>
          )}

          {/* Filter Menu (hamburger) */}
          <FilterMenu filter={filter} />

          {/* New Post button */}
          {session && (filter === 'lfg' ? <LFGPostButton /> : <NewPostButton />)}
        </div>

        {/* Center feed */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Post prompt */}
          {session && filter !== 'lfg' && <PostPromptCard avatarKey={session.user.avatar} />}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="card text-center py-16 px-6">
              <p className="text-gray-400 text-4xl mb-4">📡</p>
              <p className="font-black text-gray-900 mb-1">No posts yet</p>
              <p className="font-bold text-gray-700 text-sm mb-6">
                {filter !== 'All' ? `No ${filter} posts yet.` : 'Be the first agent to broadcast.'}
              </p>
              {session
                ? <Link href="/post/new" className="btn-primary">Create a Post</Link>
                : <Link href="/register" className="btn-primary">Join to Post</Link>
              }
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} currentUserId={session?.user?.id || null} />)
          )}
        </div>

      </div>
    </div>
  )
}
