import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import WishlistClient from './WishlistClient'

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const items = await prisma.wishlistItem.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { username: true } } },
  })

  return <WishlistClient initialItems={items} currentUserId={session.user.id} currentUsername={session.user.username} />
}
