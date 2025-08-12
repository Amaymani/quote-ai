import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/config/mongo';
import User from '@/lib/models/user';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        await dbConnect();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          console.log("No user found with that email.");
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
          console.log("Password incorrect.");
          return null;
        }
        
        console.log("Login successful!");
        return {
          id: user._id.toString(),
          email: user.email,
        };
      }
    })
  ],

  session: {
    strategy: 'jwt', 
  },


  callbacks: {

    async jwt({ token, user }) {

      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {

      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
      }
      return session;
    }
  },


  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (e.g. for email-based sign in)
    // newUser: null // If set, new users will be directed here on first sign in
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };