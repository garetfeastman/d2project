import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const items = await prisma.wishlistItem.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { username: true, avatar: true } } },
  })
  return NextResponse.json(items)
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const item = await prisma.wishlistItem.create({
    data: {
      userId: session.user.id,
      itemType: body.itemType,
      itemName: body.itemName,
      slot: body.slot || null,
      notes: body.notes || null,
      priority: body.priority || 'medium',
    },
    include: { user: { select: { username: true, avatar: true } } },
  })
  return NextResponse.json(item)
}
