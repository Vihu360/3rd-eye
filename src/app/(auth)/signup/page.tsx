"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useState } from "react";
import { IconLoader3 } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useRouter } from "next/navigation";

// Zod schemas for validation
const signupSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	fullName: z.string().min(1, "Full name is required"),
	phoneNumber: z.string().min(10, "please enter correct phone no"),
});

const signinSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "password is required")
});

const SignUp: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSignInClicked, setIsSignInClicked] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(isSignInClicked ? signinSchema : signupSchema),
		defaultValues: {
			email: "",
			password: "",
			fullName: "",
			phoneNumber: "",
		},
	});

	const toggleSignInSignUp = () => {
		setIsSignInClicked((prevState) => !prevState);
	};

	const onSubmit = async (values: z.infer<typeof signupSchema>) => {
		setIsSubmitting(true);

		try {
			let response;
			if (isSignInClicked) {
				// Sign In Logic
				response = await axios.post("/api/signin", {
					email: values.email,
					password: values.password,
				});
				toast({
					title: "Login Successful",
					description: response.data.message,
				});
				router.replace(`/home`);
			} else {
				// Sign Up Logic
				const response = await axios.post("/api/signup", {
					email: values.email,
					password: values.password,
					fullName: values.fullName,
					phoneNumber: values.phoneNumber,
				});
				toast({
					title: "Registration Successful",
					description: response.data.message ?? "Please verify your email and login.",
				});
				router.replace(`/verify/${values.email}/`);
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Failed",
				description: axiosError.response?.data.message ?? "An error occurred. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-black text-white">
			<div className='w-full h-full max-w-md p-10 sm:p-8 space-y-8 bg-black sm:shadow-md sm:shadow-slate-800 rounded-lg flex flex-col justify-center'>
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						{isSignInClicked ? "Sign In" : "Join Us"}
					</h1>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Full name field */}
						{!isSignInClicked && (
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input className="bg-[#161618] h-11 border-black hover:border-slate-600" placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input className="bg-[#161618] h-11 border-black hover:border-slate-600" placeholder="abc@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Phone number field for sign-up only */}
						{!isSignInClicked && (
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input className="bg-[#161618] h-11 border-black hover:border-slate-600" placeholder="+91 987654320" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{/* Password field */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input className="bg-[#161618] h-11 border-black hover:border-slate-600" type="password" placeholder="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit button */}
						<Button className="w-full h-10" type="submit" disabled={isSubmitting}>
							{isSubmitting ? (<IconLoader3 className="w-5 animate-spin" />) : ("Submit")}
						</Button>

						<div className="flex items-center justify-center py-2">
							<p>
								{isSignInClicked ? "Don't have an account?" : "Already have an account?"}
								<span className="underline underline-offset-2 cursor-pointer" onClick={toggleSignInSignUp}>
									{isSignInClicked ? " Sign Up" : " Sign In"}
								</span>
							</p>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default SignUp;
