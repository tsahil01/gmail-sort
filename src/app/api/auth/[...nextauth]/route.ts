import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
            scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly'
        }
      }
    })
  ],
  secret: process.env.SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signIn", user, account, profile);
      return true;
    },

    async jwt({ token, account }) {
        // console.log("jwt", token, account);
        
        if(account) {
            token.accessToken = account?.access_token;
        }
        console.log("jwt", token, account);
        return token;
      },

    async session({ session, token, user }) {
    //   console.log("session", session, token, user);
    
      //   @ts-ignore
      session.accessToken = token.accessToken;
        console.log("session", session, token, user);
      return session;
    },
    
    async redirect({ url, baseUrl }) {
        console.log("redirect", url, baseUrl);
        return baseUrl;
      },

  }
});

export { handler as GET, handler as POST };
