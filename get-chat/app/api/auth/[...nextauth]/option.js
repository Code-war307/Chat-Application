import CredentialsProvider from "next-auth/providers/credentials";
import { axiosInstance } from "@/lib/axios";
import jwt from "jsonwebtoken"
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axiosInstance.post(
            "/auth/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (!response.data.success) {
            throw new Error(response.data.message);
          }

          const user = response.data.user;

          return {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            profilePic: user.profilePic,
            bio: user.bio,
            isVerified: user.isVerified,
          };
        } catch (error) {
          throw new Error(
            error?.response?.data?.message || "Login failed. Try again later."
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.profilePic = user.profilePic;
        token.bio = user.bio;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      const {exp, ...tokenDetail} = token;
      const payload = jwt.sign(tokenDetail, process.env.NEXTAUTH_SECRET, {
        expiresIn: "7d"
      })
      session.user._id = token._id
      session.user.username = token.username
      session.user.email = token.email
      session.user.profilePic = token.profilePic
      session.user.bio = token.bio
      session.user.isVerified = token.isVerified
      session.jwtToken = payload
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
