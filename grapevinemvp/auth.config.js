import Credentials from 'next-auth/providers/credentials';
import { connectDB } from './mongodb';
import UserModel from './models/UserModel';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await UserModel.authenticate(credentials.email, credentials.password);

        if (user) {
          return { id: user._id, email: user.email, name: user.name };
        } else {
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};