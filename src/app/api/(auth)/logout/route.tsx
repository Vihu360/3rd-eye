import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { takingUserFromRefreshToken } from "@/helpers/takingUserFromRefreshToken";


export async function GET(req: NextRequest) {
	await dbConnect();

	try {
		// Get the refresh token from the cookie
		const refreshToken = req.cookies.get('refreshToken')?.value;

		if (refreshToken) {

			console.log("refresh token while log out:", refreshToken);

			const user = await takingUserFromRefreshToken(refreshToken)

			if (user) {
				user.refreshToken = undefined;
				await user.save();
			}

			// Create a response object
			const response = NextResponse.json(
				{ success: true, message: "Logout successful" },
				{ status: 200 }
			);

			// Clear the cookies
			response.cookies.set('accessToken', '', {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
			});

			response.cookies.set('refreshToken', '', {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(0),
				path: '/',
			});

			return response;
		} else {

			return NextResponse.json(
				{ success: false, message: "Please login/Signup to continue" },
				{ status: 500 }
			);

		}
	} catch (error) {
		console.error('Logout error:', error);
		return NextResponse.json(
			{ success: false, message: "An error occurred during logout" },
			{ status: 500 }
		);
	}
}
