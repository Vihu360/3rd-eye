import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

enum UserRole {
	ADMIN = 'admin',
	PLAYER = 'player',
	EMPLOYEE = 'employee',
}

interface User extends Document {
	email: string;
	password: string;
	fullName: string;
	refreshToken: string;
	credits: number;
	userRole: UserRole;
	createdAt: Date;
	updatedAt: Date;
	isVerified: boolean;
	verifyCode: string;
	verifyCodeExpiry: Date;
	noOfGamesplayed: number;
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): string;
	generateRefreshToken(): string;
}

const userSchema: Schema<User> = new Schema(
	{
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			match: [/\S+@\S+\.\S+/, 'Please use a valid email id'],
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"]
		},
		fullName: {
			type: String,
			required: [true, "Full name is required"]
		},
		refreshToken: {
			type: String
		},
		credits: {
			type: Number,
			default: 0, // Default credits
		},
		userRole: {
			type: String,
			enum: Object.values(UserRole), // Ensure valid roles
			default: UserRole.PLAYER, // Default role
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verifyCode: {
			type: String,
			required: [true, "Verify code is required"],
		},
		verifyCodeExpiry: {
			type: Date,
			required: [true, "Verify code expiry is required"],
		},
		noOfGamesplayed: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);


// // Middleware to increment noOfGamesplayed on credits update
// userSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
// 	const update = this.getUpdate();

// 	// Check if credits are being updated
// 	if (update && update.credits !== undefined) {
// 		// Increment noOfGamesPlayed by 1
// 		this.update({}, { $inc: { noOfGamesplayed: 1 } });
// 	}

// 	next();
// });

// Middleware to hash password before saving

userSchema.pre('save', async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
	const secret = process.env.ACCESS_TOKEN_SECRET ?? 'fallback_access_secret';
	const expiresIn = process.env.ACCESS_TOKEN_EXPIRY ?? '1h';

	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			fullName: this.fullName,
		},
		secret,
		{ expiresIn }
	);
};

userSchema.methods.generateRefreshToken = function (): string {
	const secret = process.env.REFRESH_TOKEN_SECRET ?? 'fallback_refresh_secret';
	const expiresIn = process.env.REFRESH_TOKEN_EXPIRY ?? '30d';

	return jwt.sign(
		{
			_id: this._id,
		},
		secret,
		{ expiresIn }
	);
};

const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema);

export default UserModel;
