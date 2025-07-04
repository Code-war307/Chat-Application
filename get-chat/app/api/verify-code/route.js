import { dbConnection } from "@/lib/db.js";
import { NextResponse } from "next/server";
import User from "@/models/user.js";

export async function POST(request) {
    dbConnection();
    
    try {
        const { email, otpCode } = await request.json();

        // Check if all fields are filled
        if (!email || !otpCode) {
            return NextResponse.json({ success: false, message: "Please fill all fields" }, { status: 400 });
        }

        // Check if user exists and is not verified
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Check if the OTP code is valid and not expired
        const currentTime = Date.now();
        if (user.verifyCode !== otpCode || currentTime > user.validityOfCode) {
            return NextResponse.json({ success: false, message: "Invalid or expired OTP code" }, { status: 400 });
        }

        // Update user to verified
        user.isVerified = true;
        user.verifyCode = null; // Clear the OTP code after verification
        user.validityOfCode = null; // Clear the validity time
        await user.save();

        return NextResponse.json({ success: true, message: "User verified successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in verification:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

