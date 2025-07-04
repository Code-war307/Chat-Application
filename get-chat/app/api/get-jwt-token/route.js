import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const { _id, username, isVerified, profilePic, bio } = await req.json();

    const user = {
      _id: _id,
      username: username,
      isVerified: isVerified,
      profilePic: profilePic,
      bio: bio,
    };

    const token = jwt.sign(user, process.env.NEXTAUTH_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({success: true, token}, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
  }
}
