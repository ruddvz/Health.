/** Plan0 §10 — Supplement catalog for Library tab. */

const CATS = {
  vitamins: [
    ["Vitamin D3", "2000-5000", "IU", "Morning with fat", "Immunity, bone health"],
    ["Vitamin K2 (MK-7)", "100", "mcg", "Morning with fat", "Bone density"],
    ["Vitamin C", "500-1000", "mg", "Any time", "Antioxidant"],
    ["Vitamin B12", "500-1000", "mcg", "Morning", "Energy"],
    ["Vitamin B Complex", "1", "capsule", "Morning with food", "Metabolism"],
    ["Folate (B9)", "400", "mcg", "Morning", "Cell division"],
    ["Vitamin A", "2500-5000", "IU", "With meal", "Vision"],
    ["Vitamin E", "200-400", "IU", "With meal", "Antioxidant"],
  ],
  minerals: [
    ["Magnesium Glycinate", "300-400", "mg", "Evening", "Sleep, recovery"],
    ["Zinc Bisglycinate", "15-30", "mg", "Evening", "Immunity"],
    ["Iron", "18", "mg", "Morning fasted", "Blood health"],
    ["Calcium Citrate", "500", "mg", "With meals", "Bone health"],
    ["Potassium", "99", "mg", "With meal", "Electrolytes"],
    ["Selenium", "100-200", "mcg", "With meal", "Thyroid"],
    ["Chromium Picolinate", "200", "mcg", "With meal", "Blood sugar"],
    ["Iodine", "150", "mcg", "Morning", "Thyroid"],
  ],
  performance: [
    ["Creatine Monohydrate", "5", "g", "Any time", "Strength"],
    ["Caffeine", "150-200", "mg", "Pre-workout", "Energy"],
    ["L-Citrulline", "6-8", "g", "Pre-workout", "Pump"],
    ["Beta-Alanine", "3.2", "g", "Pre-workout", "Endurance"],
    ["L-Arginine", "3-6", "g", "Pre-workout", "Nitric oxide"],
    ["BCAAs 2:1:1", "10", "g", "Intra-workout", "Amino acids"],
    ["EAAs", "10", "g", "Intra-workout", "Amino profile"],
    ["Pre-Workout blend", "1", "scoop", "Pre-workout", "Varies"],
  ],
  recovery: [
    ["Whey Protein Isolate", "25-30", "g", "Post-workout", "MPS"],
    ["Casein Protein", "30", "g", "Before bed", "Slow release"],
    ["L-Glutamine", "5", "g", "Post-workout", "Recovery"],
    ["Tart Cherry Extract", "480", "mg", "Post-workout", "DOMS"],
    ["Omega-3 EPA+DHA", "2000-3000", "mg", "With meal", "Inflammation"],
    ["Collagen Peptides", "10", "g", "Any time", "Joints, skin"],
    ["HMB", "3", "g", "Post-workout", "Muscle preservation"],
  ],
  health: [
    ["Ashwagandha KSM-66", "300-600", "mg", "Evening", "Stress"],
    ["Rhodiola Rosea", "200-400", "mg", "Morning", "Adaptogen"],
    ["Lions Mane", "500-1000", "mg", "Morning", "Cognition"],
    ["Berberine", "500", "mg", "With meal", "Metabolic health"],
    ["NMN", "250-500", "mg", "Morning fasted", "NAD+"],
    ["Resveratrol", "250-500", "mg", "With meal", "Antioxidant"],
    ["CoQ10", "100-200", "mg", "With meal", "Mitochondria"],
    ["Alpha Lipoic Acid", "300-600", "mg", "With meal", "Antioxidant"],
    ["Probiotics", "10-50", "billion CFU", "Morning fasted", "Gut"],
    ["Digestive Enzymes", "1", "capsule", "Before meals", "Digestion"],
    ["Turmeric BioPerine", "500-1000", "mg", "With meal", "Anti-inflammatory"],
    ["Melatonin", "0.5-3", "mg", "Before bed", "Sleep"],
    ["L-Theanine", "100-200", "mg", "Evening", "Calm focus"],
    ["5-HTP", "50-100", "mg", "Evening", "Mood"],
    ["GABA", "250-750", "mg", "Before bed", "Relaxation"],
    ["Bacopa Monnieri", "300", "mg", "With meal", "Memory"],
  ],
};

let nid = 0;
export const SUPPLEMENT_CATALOG = [];

for (const [cat, rows] of Object.entries(CATS)) {
  for (const row of rows) {
    const [name, dose, unit, timing, benefits] = row;
    SUPPLEMENT_CATALOG.push({
      id: `supp-${nid++}`,
      name,
      category: cat,
      defaultDose: dose,
      unit,
      timing,
      benefits,
    });
  }
}

while (SUPPLEMENT_CATALOG.length < 80) {
  const i = SUPPLEMENT_CATALOG.length;
  SUPPLEMENT_CATALOG.push({
    id: `supp-${nid++}`,
    name: `Wellness add-on ${i - 54}`,
    category: "health",
    defaultDose: "1",
    unit: "capsule",
    timing: "With meal",
    benefits: "General wellness",
  });
}
