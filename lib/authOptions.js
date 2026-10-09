import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { query } from './supabase'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const result = await query(
          'SELECT * FROM users WHERE email = $1',
          [credentials.email]
        )
        const user = result.rows[0]
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password, user.password_hash)
        if (!isValid) return null
        return { id: user.id, email: user.email, name: user.name }
      }
    })
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}