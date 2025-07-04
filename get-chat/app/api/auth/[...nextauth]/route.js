import NextAuth from "next-auth";
import { authOptions } from "./option.js";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
