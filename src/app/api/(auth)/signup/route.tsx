import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const { email, password, fullName, phoneNumber } = await req.json();

		// Checking if email already exists

		const existingVerifiedUserByEmail = await UserModel.findOne({ email });
		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingVerifiedUserByEmail) {
			if (existingVerifiedUserByEmail.isVerified) {
				return new Response(
					JSON.stringify({
						success: false,
						message: "User already exists with this email",
					}),
					{ status: 500 }
				);
			} else {
				existingVerifiedUserByEmail.password = password;
				existingVerifiedUserByEmail.verifyCode = verifyCode;
				existingVerifiedUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
				await existingVerifiedUserByEmail.save();
			}
		} else {

			// Create new user

			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			const newUser = new UserModel({
				email,
				password,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				fullName,
				phoneNumber,
			});

			await newUser.save();
		}

		// Send verification email

		const emailResponse = await sendVerificationEmail(fullName, email, verifyCode);

		if (!emailResponse.success) {
			return new Response(
				JSON.stringify({
					success: false,
					message: emailResponse.message,
				}),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Email registered successfully. Please verify the Email",
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error registering user:", error);

		return new Response(
			JSON.stringify({
				success: false,
				message: "Error registering user",
			}),
			{ status: 500 }
		);
	}
}
