export interface QuickFixPreset {
	label: string;
	kcal: number;
	protein_g: number;
	carbs_g: number;
	fat_g: number;
}

/** Small, realistic add-ons to close macro gaps without editing the plan JSON. */
export const QUICK_FIX_PRESETS: QuickFixPreset[] = [
	{ label: 'Greek yogurt (150g)', kcal: 120, protein_g: 18, carbs_g: 6, fat_g: 3 },
	{ label: 'Banana (medium)', kcal: 105, protein_g: 1, carbs_g: 27, fat_g: 0 },
	{ label: 'Cooked rice (150g)', kcal: 190, protein_g: 4, carbs_g: 42, fat_g: 0 },
	{ label: 'Whey scoop', kcal: 120, protein_g: 24, carbs_g: 3, fat_g: 1 },
	{ label: 'Cottage cheese (200g)', kcal: 180, protein_g: 28, carbs_g: 6, fat_g: 4 },
	{ label: 'Almonds (30g)', kcal: 180, protein_g: 6, carbs_g: 6, fat_g: 15 }
];
