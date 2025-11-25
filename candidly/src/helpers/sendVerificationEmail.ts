import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string

): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Candidly | Verification Code',
            react: VerificationEmail({ username: username, otp: verifyCode }),
        });

        return { success: true, message: 'Verification email sent successfully' }
        
    } catch (emailError) {
        console.log("Failed to send verification email", emailError);

        return { success: false, message: 'Failed to send verification email' }
    }
}