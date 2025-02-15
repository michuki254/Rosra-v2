import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getConnection } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password')
        }

        const pool = await getConnection()
        const result = await pool.request()
          .input('email', credentials.email)
          .query('SELECT * FROM Users WHERE Email = @email AND IsActive = 1')

        const user = result.recordset[0]

        if (!user || !await bcrypt.compare(credentials.password, user.PasswordHash)) {
          throw new Error('Invalid email or password')
        }

        // Update LastLogin
        await pool.request()
          .input('userId', user.UserId)
          .query('UPDATE Users SET LastLogin = GETDATE() WHERE UserId = @userId')

        return {
          id: user.UserId.toString(),
          email: user.Email,
          name: `${user.FirstName} ${user.LastName}`,
          role: user.Role,
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { role: string }).role = token.role
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)