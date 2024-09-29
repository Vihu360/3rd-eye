export const playHeadsOrTails = (): { outcome: 'Heads' | 'Tails' } => {
	const outcome = Math.random() < 0.5 ? 'Heads' : 'Tails';
	return { outcome };
};
