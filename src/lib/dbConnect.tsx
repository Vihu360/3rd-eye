import mongoose from "mongoose";


type connectObject = {
	isConnected ?: number
}

const connect: connectObject = {}

async function dbConnect(): Promise<void> {

	//check if DB is already connected

	if (connect.isConnected) {
		console.log("MongoDB is already connected");
		return;
	}

	// connect MongoDB

	console.log("connecting db");
	console.log("db url", process.env.MONGODB_URI);

	try {
		const db = await mongoose.connect(process.env.MONGODB_URI as string);
		connect.isConnected = db.connections[0].readyState;
		console.log("MongoDB connected");
	} catch (error) {
		console.log("MongoDB connection error: ", error);
		process.exit(1);
	}
}

export default dbConnect
