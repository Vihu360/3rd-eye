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
import signupFormSchema from "@/schemas/signupFormSchema";
import * as z from "zod";
import { useState } from "react";
import { IconLoader3 } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {

	const [isSubmitting, setisSubmitting] = useState(false);
	const [isSignInClicked, setIsSignInClicked] = useState(false);

	const { toast } = useToast();
	const router = useRouter();


	const form = useForm<z.infer<typeof signupFormSchema>>({
		resolver: zodResolver(signupFormSchema),
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


	const onSubmit = async (values: z.infer<typeof signupFormSchema>) => {

		setisSubmitting(true);

		try {

			const response = await axios.post("/api/signup", values);

			console.log(response.data);

			toast({
				title: "Registration Successful",
				description: "Please verify your mail and login",
			})

			router.replace(`/verify/${values.email}/`);


		} catch (error) {

			console.error('Error creating brand:', error);
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: 'Failed',
				description: axiosError.response?.data.message ?? 'An error occurred while creating your Brand. Please try again.',
				variant: 'destructive'
			});
		}
		finally {
			setisSubmitting(false);
		}
	}


	return (
		<div className="min-h-screen flex items-center justify-center bg-black text-white">
			<div className='w-full h-full max-w-md p-10 sm:p-8 space-y-8 bg-black sm:shadow-md sm:shadow-slate-800 rounded-lg flex flex-col justify-center '>
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join us
					</h1>

				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

						{/* Full name field */}
						{isSignInClicked ? null : (

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
										<Input className="bg-[#161618] h-11 border-black hover:border-slate-600 " placeholder="abc@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>


						{isSignInClicked ? null : (

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
						<Button className="w-full h-10" type="submit"> {isSubmitting ? (<IconLoader3 className=" w-5 animate-spin" />) : ("submit")}</Button>
						<div className="full flex items-center justify-center py-2">
							<p className="">Already have an account? <span className="underline underline-offset-2 cursor-pointer" onClick={toggleSignInSignUp}>
								{isSignInClicked ? "Sign Up" : "Sign In"}</span></p>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default SignUp;
