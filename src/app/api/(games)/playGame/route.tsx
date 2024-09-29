import { takingUserFromRefreshToken } from "@/helpers/takingUserFromRefreshToken";
import dbConnect from "@/lib/dbConnect";
import { playGame } from "@/services/gameService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const refreshToken = req.cookies.get('refreshToken')?.value;

		console.log("refreshToken", refreshToken);

		if (refreshToken) {
			// Fetch user from the refresh token
			const user = await takingUserFromRefreshToken(refreshToken);

			console.log("user from play game", user);

			if (!user) {
				return NextResponse.json({ success: false, message: "Please login/signup first" }, { status: 400 });
			}

			// Destructure the request body correctly
			const { betAmount, prediction } = await req.json();

			console.log("betAmount, prediction", betAmount, prediction);

			// Check minimum bet amount
			if (betAmount < 20) {
				return NextResponse.json({
					success: false,
					message: "Minimum bet amount is 20 credits",
				});
			}

			// Check if user has enough credits
			if (user.credits < betAmount) {
				return NextResponse.json({
					success: false,
					message: "Insufficient credits to play the game",
				});
			}

			const userId = user._id;
			const userPrediction = prediction;

			// Await the playGame function
			const result = await playGame(userId, betAmount, userPrediction);

			console.log("result", result);

			// Return the result of the game
			return NextResponse.json({
				success: true,
				message: "Game played successfully",
			});
		} else {
			// User not logged in
			return NextResponse.json({
				success: false,
				message: "Please login/signup to play the game",
			},
			{ status: 401 });
		}
	} catch (error) {
		console.error("Error during game play:", error);

		return NextResponse.json({
			success: false,
			message: "Something went wrong, please try again",
		});
	}
}
