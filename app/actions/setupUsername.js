'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function setupUsername(prevState, formData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Not signed in.' }

  const username = formData.get('username')?.trim()
  const platform = formData.get('platform') || 'PC'

  if (!username) return { error: 'Username is required.' }
  if (username.length < 3) return { error: 'Username must be at least 3 characters.' }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return { error: 'Username may only contain letters, numbers, underscores, and hyphens.' }

  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: session.user.id } },
  })
  if (existing) return { error: 'That username is already taken.' }

  const avatar = formData.get('avatar') || null

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username, platform, avatar, needsUsernameSetup: false },
  })

  revalidatePath('/feed')
  return { success: true }
}
