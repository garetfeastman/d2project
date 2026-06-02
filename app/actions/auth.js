'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function registerUser(formData) {
  const username = formData.get('username')?.trim()
  const email = formData.get('email')?.trim()
  const password = formData.get('password')
  const platform = formData.get('platform') || 'PC'

  if (!username || !email || !password) {
    return { error: 'All fields are required.' }
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })
  if (existing) {
    return { error: 'Email or username already taken.' }
  }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: { username, email, password: hashed, platform },
  })

  redirect('/login?registered=1')
}
