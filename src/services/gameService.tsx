import User from "../models/Users";
import { playHeadsOrTails } from "../helpers/calculateOutcome";
import dbConnect from "@/lib/dbConnect";

export const playGame = async (userId: string, betAmount: number, userPrediction: 'Heads' | 'Tails') => {
	await dbConnect();

	const user = await User.findById(userId);

	if (!user) {
		throw new Error("User not found");
	}

	if (user.credits < betAmount) {
		throw new Error("Insufficient credits to play the game");
	}

	if (betAmount < 25) {
		throw new Error("Minimum bet amount is 25 credits");
	}

	user.credits -= betAmount;

	const { outcome } = playHeadsOrTails();

	const won = outcome === userPrediction;

	if (won) {
		user.credits += 2 * betAmount;
	}

	await user.save();

	return { outcome, won, credits: user.credits };
};
