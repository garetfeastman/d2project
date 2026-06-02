import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const plans = await prisma.buildPlan.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { username: true, avatar: true } } },
  })
  return NextResponse.json(plans)
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const plan = await prisma.buildPlan.create({
    data: {
      userId: session.user.id,
      name: body.name,
      description: body.description || null,
      role: body.role || null,
      loadout: JSON.stringify(body.loadout || {}),
    },
    include: { user: { select: { username: true, avatar: true } } },
  })
  return NextResponse.json(plan)
}
