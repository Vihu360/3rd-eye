import mongoose, { Document, Schema } from "mongoose";

interface Game extends Document {
	gameName: string;
}


const gameSchema: Schema<Game> = new Schema(
	{
		gameName: {
			type: String,
			required: [true, "Game name is required"],
			trim: true,
		},
	},
	{ timestamps: true }
);
