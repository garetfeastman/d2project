import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          platform: user.platform,
          avatar: user.avatar,
          needsUsernameSetup: user.needsUsernameSetup,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existing = await prisma.user.findFirst({
          where: { OR: [{ googleId: account.providerAccountId }, { email: user.email }] },
        })

        if (existing) {
          // Link Google ID if signing in via email-matched account
          if (!existing.googleId) {
            await prisma.user.update({
              where: { id: existing.id },
              data: { googleId: account.providerAccountId },
            })
          }
          // Attach DB id so jwt callback can pick it up
          user.id = existing.id
          user.username = existing.username
          user.platform = existing.platform
          user.needsUsernameSetup = existing.needsUsernameSetup
        } else {
          // New Google user — create with temp username, flag for setup
          const tempUsername = `agent_${account.providerAccountId.slice(0, 8)}`
          const created = await prisma.user.create({
            data: {
              email: user.email,
              username: tempUsername,
              googleId: account.providerAccountId,
              avatar: user.image,
              needsUsernameSetup: true,
            },
          })
          user.id = created.id
          user.username = created.username
          user.platform = created.platform
          user.needsUsernameSetup = true
        }
      }
      return true
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.platform = user.platform
        token.avatar = user.avatar
        token.needsUsernameSetup = user.needsUsernameSetup
      }
      // Re-fetch from DB on explicit update trigger
      if (trigger === 'update' && token.id) {
        try {
          const fresh = await prisma.user.findUnique({ where: { id: token.id } })
          if (fresh) {
            token.username = fresh.username
            token.platform = fresh.platform
            token.avatar = fresh.avatar
            token.needsUsernameSetup = fresh.needsUsernameSetup
          }
        } catch (err) {
          console.error('JWT refresh failed:', err)
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.platform = token.platform
        session.user.avatar = token.avatar
        session.user.needsUsernameSetup = token.needsUsernameSetup

        // Stamp lastActiveAt — but only write to DB every 5 minutes to avoid hammering it
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        if (!token.lastActiveAt || new Date(token.lastActiveAt) < fiveMinutesAgo) {
          try {
            await prisma.user.update({
              where: { id: token.id },
              data: { lastActiveAt: new Date() },
            })
            token.lastActiveAt = new Date().toISOString()
          } catch (err) {
            console.error('lastActiveAt update failed:', err)
          }
        }
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
