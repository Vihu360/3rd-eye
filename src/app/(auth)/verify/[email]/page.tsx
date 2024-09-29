"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { Form, FormField, FormControl, FormLabel, FormMessage, FormItem } from '@/components/ui/form';
import { verifySchema } from '@/schemas/verifySchemas';
import { Input } from '@/components/ui/input';
import { IconLoader3 } from '@tabler/icons-react';

const VerifyAccount = () => {

	const [isSubmitting, setIsSubmitting] = useState(false);

	const { toast } = useToast();
	const router = useRouter();
	const param = useParams<{ email: string }>()


	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	})


	const onSubmit = async (data: z.infer<typeof verifySchema>) => {

		setIsSubmitting(true);

		try {

			const decodedEmail = param.email.replace(/%40/g, "@");

			const response = await axios.post('/api/verifyemail', {
				email: decodedEmail,
				code: data.code
			});

			toast({
				title: response.data.success,
				description: 'Account verified successfully',
				variant: 'default',
			})

			router.replace('/home')


		} catch (error) {

			const axiosError = error as AxiosError<ApiResponse>;

			toast({
				title: 'Failed',
				description: axiosError.response?.data.message ?? 'An error occurred while verifying your account. Please try again.',
				variant: 'destructive',
			})

		}

		setIsSubmitting(false);


	}

	return (
		<div className='bg-black flex items-center justify-center h-screen w-screen'>

			<div className='bg-black md:shadow-2xl md:shadow-slate-800 h-1/2 w-1/2 flex flex-col justify-center items-center gap-6'>


				<div className=''>
					<p className='text-neutral-200 text-center'>One step closer. One code away.</p>
				</div>

				<div className='text-white'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								name="code"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-neutral-200 font-sans'>Verification Code</FormLabel>
										<FormControl>
											<Input className='w-[260px]' placeholder="code" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<button
								className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 border border-zinc-800 shadow-[0px_-1px_0px_0px_var(--zinc-800)_inset]"
								type="submit"
							>
								<span className="flex items-center justify-center">
									{isSubmitting ? (
										<IconLoader3 className="w-4 h-4 mr-2 animate-spin" />
									) : ('submit')}
								</span>
								<BottomGradient />
							</button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};

export default VerifyAccount
