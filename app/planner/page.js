import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PlannerClient from './PlannerClient'

export default async function PlannerPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const plans = await prisma.buildPlan.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { username: true } } },
  })

  return <PlannerClient initialPlans={plans} currentUserId={session.user.id} currentUsername={session.user.username} />
}
