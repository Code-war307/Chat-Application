import OTPEmail from "@/email/verification-code";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendVerificationEmail({ email, firstName, otpCode }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Verification Code",
      react: OTPEmail({ firstName, otpCode }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, message: "Failed to send verification email" };
    }
    return { success: true, message: "OTP send Successfully", data};
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error sending verification email" };
  }
}
