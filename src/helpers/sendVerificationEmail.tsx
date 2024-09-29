import VerificationEmail from '../../Emails/verificationEmail';
import { ApiResponse } from '@/types/apiResponse';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);


export async function sendVerificationEmail(
	fullName: string,
	email: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {

		const emailContent = VerificationEmail({ fullName, otp: verifyCode });

		console.log("email to be sent on:", email);

		await resend.emails.send({
			from: 'send@vivekbarnwal.cloud',
			to: email,
			subject: '3rd Eye Verification Code',
			react: emailContent,
		});

		return { success: true, message: 'Verification email sent successfully.' };
	} catch (emailError) {
		console.error('Error sending verification email:', emailError);
		return { success: false, message: 'Failed to send verification email.' };
	}
}
