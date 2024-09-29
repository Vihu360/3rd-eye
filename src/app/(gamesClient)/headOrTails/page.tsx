"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { IconMoneybag, IconLoader3 } from '@tabler/icons-react';
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/apiResponse";

const HeadsOrTails = () => {
	const { toast } = useToast();

	const [outcome, setOutcome] = useState<null | string>(null);
	const [credits, setCredits] = useState<number>(0);
	const [betAmount, setBetAmount] = useState<number>(20); // Default to 20 credits
	const [prediction, setPrediction] = useState<'Heads' | 'Tails'>('Heads'); // Default to 'Heads'
	const [activeButton, setActiveButton] = useState("null");
	const [coinSpin, setCoinSpin] = useState(false);
	const [selectedBetAmount, setSelectedBetAmount] = useState<number | null>(null); // Track selected bet amount

	useEffect(() => {
		// Fetch initial credits when component mounts
		const fetchCredits = async () => {
			try {
				const response = await axios.get("/api/getCredits");
				setCredits(response.data.credits);
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse>;
				toast({
					title: 'Failed',
					description: axiosError.response?.data.message ?? 'An error occurred. Please try again.',
					variant: 'destructive',
				});
			}
		};

		fetchCredits();
	}, [toast]); // Add toast to dependencies if it comes from context

	const headTailSelectHandler = (button: string) => {
		setActiveButton(button);
		setPrediction(button === "Heads" ? "Heads" : "Tails");
		console.log("Button clicked:", button);
	};

	const flipCoinButtonHandler = () => {
		setCoinSpin(true);
		playGame();
	};

	const betAmountClickHandler = (amount: number) => {
		setSelectedBetAmount(amount); // Update selected bet amount
		setBetAmount(amount);
		console.log("bet amount", amount);
	};

	const playGame = async () => {
		try {
			console.log("betAmount, prediction", betAmount, prediction);
			const { data } = await axios.post("/api/playGame", { betAmount, prediction });
			console.log("data", data);
			setOutcome(data.outcome);
			console.log(outcome);
		} catch (error) {
			console.log("err from backend", error);
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: 'Failed',
				description: axiosError.response?.data.message ?? 'An error occurred while creating your Brand. Please try again.',
				variant: 'destructive'
			});
		} finally {
			setCoinSpin(false);
		}
	};

	const BetAmountButton = ({ amount }: { amount: number }) => {
		return (
			<button
				onClick={() => betAmountClickHandler(amount)}
				className={`w-14 p-4 ${selectedBetAmount === amount ? 'bg-neutral-200 text-black' : 'bg-[#161618] text-white'} rounded-xl flex justify-center items-center cursor-pointer`}
			>
				{amount}
			</button>
		);
	};

	return (
		<div className="min-w-screen m-h-screen bg-[#000] flex flex-col justify-start items-center text-neutral-200 font-Rubik">
			<div className="w-full p-8 text-3xl flex justify-between items-center font-Rubik mb-2">
				<p>Heads or Tails</p>
				<div className="bg-[#1E1E1E] p-4 rounded-xl flex items-center justify-center gap-2">
					<IconMoneybag stroke={2} />
					<p className="text-base">{credits}</p>
				</div>
			</div>

			<div className="w-full h-full bg-[#1E1E1E] pt-3 rounded-t-[55px]">
				{/* coin flipping  */}
				<div className="w-full h-full flex items-center justify-center p-8">
					<Image
						src="/coin.png"
						width={100}
						height={100}
						alt="Heads or Tails"
						priority
						className={`w-52 ${coinSpin ? 'animate-bounce' : 'animate-none'}`}
					/>
				</div>

				{/* bet amount selection */}
				<div className="w-full h-full flex flex-col justify-center gap-3 items-center px-12 py-2">
					<div className="p-2 font-Rubik text-lg">
						<p>Select a bet amount :</p>
					</div>
					<div className="w-full h-full flex items-center justify-between">
						<BetAmountButton amount={25} />
						<BetAmountButton amount={50} />
						<BetAmountButton amount={100} />
						<BetAmountButton amount={200} />
					</div>

					<div className="w-full h-full flex items-center justify-between">
						<BetAmountButton amount={250} />
						<BetAmountButton amount={500} />
						<BetAmountButton amount={1000} />
						<BetAmountButton amount={2000} />
					</div>
				</div>

				{/* Heads or Tails selection */}
				<div className="font-medium flex items-center justify-center py-8">
					<p className="text-lg">My choice : <span className="text-yellow-500 text-base">{prediction}</span></p>
				</div>

				<div className="w-full h-full">
					<div className="flex justify-center items-center rounded-xl">
						<button
							className={`bg-[#161618] w-32 h-12 rounded-xl uppercase font-semibold text-md ${activeButton === 'Heads' ? 'bg-neutral-200 text-black' : ''}`}
							onClick={() => headTailSelectHandler('Heads')}
						>
							Heads
						</button>
						<button
							className={`bg-[#161618] w-32 h-12 uppercase rounded-xl font-semibold text-md ${activeButton === 'Tails' ? 'bg-neutral-200 text-black' : 'text-white'}`}
							onClick={() => headTailSelectHandler('Tails')}
						>
							Tails
						</button>
					</div>
				</div>

				{/* play the game button */}
				<div className="w-full h-full flex justify-center items-center py-8 pb-32">
					<button onClick={flipCoinButtonHandler} className={`bg-[#161618] h-12 w-64 rounded-xl uppercase font-semibold text-md flex justify-center items-center`}>
						<p className={`${coinSpin ? 'animate-spin' : ''}`}>
							{coinSpin ? (<IconLoader3 />) : 'FLIP THE COIN'}
						</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default HeadsOrTails;
