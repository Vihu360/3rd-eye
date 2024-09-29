import { takingUserFromRefreshToken } from "@/helpers/takingUserFromRefreshToken";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	await dbConnect();

	try {
		const refreshToken = req.cookies.get('refreshToken')?.value;

		if (!refreshToken) {
			return NextResponse.json({ success: false, message: "Please login/signup first" }, { status: 401 });
		}

		const user = await takingUserFromRefreshToken(refreshToken);

		if (!user) {
			return NextResponse.json({ success: false, message: "Please login/signup first" }, { status: 401 });
		}

		return NextResponse.json({
			success: true,
			credits: user.credits,
		});
	} catch (error) {
		console.error("Error fetching credits:", error);
		const errorAsError = error as Error;
		return NextResponse.json({
			success: false,
			message: errorAsError.message || "Something went wrong, please try again",
		}, { status: 500 });
	}
}
