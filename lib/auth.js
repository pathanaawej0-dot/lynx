import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createUser, getUserByEmail, createAccount, getAccountByProvider } from './db';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        let dbUser = await getUserByEmail(user.email);
        
        if (!dbUser) {
          dbUser = await createUser({
            id: account.providerAccountId,
            email: user.email,
            name: user.name,
            image: user.image,
          });
          console.log('Created new user:', dbUser);
        }
        
        const existingAccount = await getAccountByProvider(account.provider, account.providerAccountId);
        
        if (!existingAccount && dbUser) {
          await createAccount({
            id: crypto.randomUUID(),
            userId: dbUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.sub = account.providerAccountId;
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
