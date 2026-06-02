'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

async function saveImage(file) {
  if (!file || file.size === 0) return null
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Only JPG, PNG and WebP images are allowed.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Image must be under 5MB.')

  const ext = file.type.split('/')[1]
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const dir = join(process.cwd(), 'public', 'uploads', 'posts')
  await mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(join(dir, filename), buffer)
  return `/uploads/posts/${filename}`
}

export async function createPost(_prevState, formData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Not signed in.' }

  const content = formData.get('content')?.trim()
  const buildRole = formData.get('buildRole') || null
  const isLFG = formData.get('isLFG') === 'on'
  const lfgRole = isLFG ? (formData.get('lfgRole') || null) : null
  const videoUrl = formData.get('videoUrl')?.trim() || null
  const imageFile = formData.get('image')

  if (!content) return { error: 'Post content is required.' }

  let imageUrl = null
  try {
    imageUrl = await saveImage(imageFile)
  } catch (err) {
    return { error: err.message }
  }

  await prisma.post.create({
    data: {
      content,
      buildRole,
      isLFG,
      lfgRole,
      videoUrl,
      imageUrl,
      authorId: session.user.id,
    },
  })

  revalidatePath('/feed')
  return { success: true }
}

export async function toggleLike(postId) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Not logged in' }

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    await prisma.like.create({ data: { userId: session.user.id, postId } })
  }

  revalidatePath('/feed')
}

export async function addComment(formData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Not logged in' }

  const content = formData.get('content')?.trim()
  const postId = formData.get('postId')

  if (!content || !postId) return { error: 'Missing fields' }

  await prisma.comment.create({
    data: { content, postId, authorId: session.user.id },
  })

  revalidatePath('/feed')
}
