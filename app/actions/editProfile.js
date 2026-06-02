'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

async function saveAvatarImage(file) {
  if (!file || file.size === 0) return null
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Only JPG, PNG and WebP images are allowed.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Image must be under 5MB.')

  // ── NSFW filtering ──────────────────────────────────────────────
  // To enable content moderation, add SIGHTENGINE_USER and
  // SIGHTENGINE_SECRET to your .env and uncomment the block below.
  //
  // const buffer = Buffer.from(await file.arrayBuffer())
  // const formData = new FormData()
  // formData.append('media', new Blob([buffer]), file.name)
  // formData.append('models', 'nudity,offensive')
  // formData.append('api_user', process.env.SIGHTENGINE_USER)
  // formData.append('api_secret', process.env.SIGHTENGINE_SECRET)
  // const res = await fetch('https://api.sightengine.com/1.0/check.json', { method: 'POST', body: formData })
  // const result = await res.json()
  // if (result.nudity?.safe < 0.85 || result.offensive?.prob > 0.5) {
  //   throw new Error('Image was flagged as inappropriate and could not be uploaded.')
  // }
  // ────────────────────────────────────────────────────────────────

  const ext = file.type.split('/')[1]
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const dir = join(process.cwd(), 'public', 'uploads', 'avatars')
  await mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(join(dir, filename), buffer)
  return `/uploads/avatars/${filename}`
}

export async function editProfile(prevState, formData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Not signed in.' }

  const username = formData.get('username')?.trim()
  const platform = formData.get('platform') || 'PC'
  const bio = formData.get('bio')?.trim() || null
  const avatarIconKey = formData.get('avatar') || null
  const avatarFile = formData.get('avatarFile')

  if (!username) return { error: 'Username is required.' }
  if (username.length < 3) return { error: 'Username must be at least 3 characters.' }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return { error: 'Username may only contain letters, numbers, underscores, and hyphens.' }

  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: session.user.id } },
  })
  if (existing) return { error: 'That username is already taken.' }

  // Determine avatar value: uploaded image takes priority over icon key
  let avatar = avatarIconKey
  try {
    const uploadedUrl = await saveAvatarImage(avatarFile)
    if (uploadedUrl) avatar = uploadedUrl
  } catch (err) {
    return { error: err.message }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username, platform, avatar, bio },
  })

  revalidatePath(`/profile/${username}`)
  return { success: true, username }
}
