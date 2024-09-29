import { NextResponse } from "next/server";
import { JwtPayload } from "@/types/apiResponse";
import jwt from 'jsonwebtoken';
import UserModel from "@/models/Users";

export const takingUserFromRefreshToken = async (refreshToken: string) => {

	if (!refreshToken) {
		return NextResponse.json(
			{ success: false, message: "Please login/signup first" },
			{ status: 400 }
		);
	}

	// Verify the refresh token
	const secret = process.env.REFRESH_TOKEN_SECRET ?? 'fallback_refresh_secret';
	let decoded: JwtPayload;

	try {
		decoded = jwt.verify(refreshToken, secret) as JwtPayload;
	} catch (error) {
		console.error('Token verification failed:', error);
		return NextResponse.json(
			{ success: false, message: "Authication failed, please login/signup first" },
			{ status: 401 }
		);
	}

	console.log("decoded refresh token", decoded);

	// Find the user and through refresh token
	const user = await UserModel.findById(decoded._id);

	return user;

}
