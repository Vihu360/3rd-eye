import UserModel from "@/models/Users";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

	await dbConnect();

	try {

		const { email, code } = await req.json()

		console.log("email, code", email, code)

		const user = await UserModel.findOne({ email: email })

		console.log(user)

		if (!user) {
			return NextResponse.json({
				success: "false",
				message: "user not found, please register first"
			},
				{
				status: 404
			})
		}


		if (user) {

			const isCodeValid = user.verifyCode === code;
			const checkExpiry = new Date(user.verifyCodeExpiry) > new Date();

			if (user.isVerified) {
				return NextResponse.json({
					success: "false",
					message: "user is already verified, please login"
				},
					{
						status: 500
				})
			}

			if (isCodeValid && checkExpiry) {

				user.isVerified = true;
				user.credits = 100;
				await user.save()

				return NextResponse.json({
					success: true,
					message: "Code has been verified"
				})
			}

			else if (!checkExpiry) {
				return NextResponse.json({
					success: "false",
					message: "the code has been expired"
				},
					{
						status: 505
					})
			}
			else {
				return NextResponse.json({
					success: "false",
					message: "Invalid OTP"
				},
					{
						status: 400
					})
			}
		}

		return NextResponse.json({
			success: "false",
			message: "user was not found, please register first"
		},
			{
			status: 404
		})

	} catch (error) {

		console.error('Error verifying user:', error);
		return NextResponse.json(
			{ success: false, message: 'Error verifying user' },
			{ status: 500 })
	}
}
