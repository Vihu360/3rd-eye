import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";


const generateAccessandRefreshToken = async (userId: string) => {
	try {
		const user = await UserModel.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;
		await user.save();
		console.log("refresh token", refreshToken);
		return { accessToken, refreshToken };
	} catch (error) {
		console.error("Failed to generate access token:", error);
		throw error;
	}
};

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const { email, password } = await req.json();
		const user = await UserModel.findOne({ email: email });

		if (!user) {
			return NextResponse.json(
				{ success: false, message: "Email or Password is incorrect" },
				{ status: 400 }
			);
		}

		if (!user.isVerified) {
			return NextResponse.json(
				{ success: false, message: "Please verify your email first" },
				{ status: 400 }
			);
		}

		const isPasswordValid = await user.isPasswordCorrect(password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ success: false, message: "Email or Password is incorrect" },
				{ status: 400 }
			);
		}

		// generate access and refresh token for user

		const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

		interface CookieOptions {
			expires: Date;
			httpOnly: boolean;
			secure: boolean;
			sameSite: "strict" | "lax" | "none";
		}

		const option: CookieOptions = {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		};


		const response = NextResponse.json(
			{
				success: true,
				message: "Login Successful",
			},
			{ status: 200 }
		)

		response.cookies.set("accessToken", accessToken, option);
		response.cookies.set("refreshToken", refreshToken, option);

		return response;

	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "An error occurred during signin" },
			{ status: 500 }
		);
	}
}
