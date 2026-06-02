import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import PostCard from '@/app/components/PostCard'
import { AvatarIcon } from '@/app/components/AvatarIcon'
import Link from 'next/link'

const PLATFORM_COLORS = {
  PC: 'text-blue-600',
  PS: 'text-indigo-600',
  Xbox: 'text-green-600',
}

export default async function ProfilePage({ params }) {
  const { username } = await params
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { username: true, platform: true, avatar: true } },
          likes: { select: { userId: true } },
          comments: { include: { author: { select: { username: true, avatar: true } } }, orderBy: { createdAt: 'asc' } },
        },
      },
      _count: { select: { followers: true, following: true, posts: true } },
    },
  })
  if (!user) notFound()
  const isOwn = session?.user?.id === user.id
  const platformColor = PLATFORM_COLORS[user.platform] || 'text-gray-600'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile card */}
      <div className="card overflow-hidden mb-5">
        {/* Cover band */}
        <div className="h-32 bg-gradient-to-r from-orange-600 to-orange-400" />
        {/* Info area */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="border-4 border-white rounded-full shadow-md">
              <AvatarIcon iconKey={user.avatar} size={80} />
            </div>
            {isOwn && (
              <Link href="/profile/edit" className="text-xs font-bold text-gray-700 border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 px-4 py-2 rounded-full transition-colors">
                ✏ Edit Profile
              </Link>
            )}
          </div>
          <h1 className="text-2xl text-gray-900 mb-0.5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase' }}>{user.username}</h1>
          <span className={`text-sm font-bold ${platformColor}`}>{user.platform}</span>
          {user.bio && <p className="font-bold text-gray-900 text-sm mt-3">{user.bio}</p>}
          <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100">
            {[
              { val: user._count.posts, label: 'Posts' },
              { val: user._count.followers, label: 'Followers' },
              { val: user._count.following, label: 'Following' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>{s.val}</p>
                <p className="text-xs font-black text-gray-900 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-xl text-gray-900 font-black mb-4" style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Posts</h2>
      {user.posts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="font-bold text-gray-700">No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {user.posts.map(post => <PostCard key={post.id} post={post} currentUserId={session?.user?.id || null} />)}
        </div>
      )}
    </div>
  )
}
