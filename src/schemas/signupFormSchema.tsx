
import { z } from "zod";

const signupFormSchema = z.object({
	email: z
		.string()
		.email({ message: "Please enter a valid email" })
		.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
			message: "Please enter a valid email",
		}),
	password: z
		.string()
		.min(1, { message: "Please enter a password" })
		.min(8, { message: "Password must be at least 8 characters long" }),
	fullName: z.string().min(1, { message: "Please enter your name" }),
	phoneNumber: z
		.string()
		.min(10, { message: "Please enter a valid phone number" })
		.max(13, { message: "Please enter a valid phone number" })
});

export default signupFormSchema;
