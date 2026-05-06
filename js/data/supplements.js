/**
 * Comprehensive supplement reference data.
 * Used by the Supplements page to render detailed cards, brand picks,
 * interaction notes, and cycling protocols.
 *
 * Evidence ratings:
 *   A = multiple large RCTs / strong meta-analyses
 *   B = solid human studies, minor inconsistency
 *   C = mixed / limited human data
 *   D = mostly animal/mechanistic
 */

export const SUPP_DETAIL = {
  creatine: {
    id: "creatine",
    fullName: "Creatine Monohydrate",
    aliases: ["Creatine HCL", "Buffered creatine (Kre-Alkalyn)", "Micronized creatine"],
    category: "performance",
    tagline: "The most researched ergogenic supplement ever studied.",
    mechanism:
      "Replenishes phosphocreatine stores in muscle, allowing faster ATP re-synthesis during short, maximal-effort work (sprints, heavy sets 1–5 reps).",
    benefits: [
      "5–15 % increase in strength and power output within 4–8 weeks",
      "Slightly faster recovery between sets",
      "Small lean-mass gain via water retained in muscle (not fat)",
      "May support cognitive performance under sleep deprivation or stress",
    ],
    dosing: {
      maintenance: "3–5 g per day",
      loading: "20 g/day split into 4 × 5 g doses for 5–7 days (optional — just speeds saturation)",
      frequency: "Daily — consistency is more important than exact timing",
      timing: "Any time of day; with or without food",
      timingNote:
        "Post-workout with fast carbs + protein may give a marginal edge due to insulin-mediated creatine uptake, but total daily dose is what matters.",
    },
    forms: [
      {
        name: "Monohydrate",
        note: "Gold standard. Cheapest and best-studied. Micronized versions dissolve better.",
        recommended: true,
      },
      {
        name: "HCL",
        note: "Claimed to need less powder per dose. Evidence not stronger than monohydrate; significantly more expensive.",
        recommended: false,
      },
      {
        name: "Kre-Alkalyn (buffered)",
        note: "Marketing claim that pH-buffering improves stability. Not supported over monohydrate in head-to-head trials.",
        recommended: false,
      },
    ],
    brands: {
      budget: [
        { name: "Optimum Nutrition Creatine", note: "Widely available, pure monohydrate, no fillers." },
        { name: "BulkSupplements Creatine Monohydrate", note: "Unflavoured, comes in large bags — best cost-per-gram." },
      ],
      mid: [
        { name: "Thorne Creatine", note: "NSF certified, good purity, trusted by athletes in tested sports." },
        { name: "Klean Athlete Creatine", note: "NSF Certified for Sport — useful if you compete in tested events." },
      ],
      premium: [
        { name: "Creapure (German origin)", note: "Certified purity standard; many brands use it as their ingredient. Look for Creapure logo." },
      ],
    },
    interactions: {
      synergistic: [
        "Carbohydrates + protein at same dose may boost muscle uptake slightly",
        "Beta-alanine (buffered muscle acidity) — compatible, different mechanism",
        "Caffeine — historically debated; most data shows no antagonism at normal doses",
      ],
      avoid: [
        "Excessive caffeine (≥300 mg) alongside loading doses may cause GI discomfort in some individuals",
      ],
    },
    sideEffects: [
      "Water retention in muscle (expected, not harmful, reverses on stopping)",
      "GI discomfort if taken in large single doses — split into smaller amounts",
      "Extremely rare: may elevate serum creatinine (a kidney-function marker) without impairing kidney function — inform your doctor if tested",
    ],
    cycling: {
      required: false,
      protocol: "No cycling needed. Safe for continuous use in healthy individuals. Some people cycle 8 weeks on / 4 weeks off by preference, not necessity.",
    },
    evidenceRating: "A",
    keyNote:
      "If you only buy one supplement, make it creatine monohydrate. No other supplement has remotely comparable evidence for strength and power.",
  },

  whey: {
    id: "whey",
    fullName: "Whey Protein Concentrate / Isolate",
    aliases: ["WPC", "WPI", "Casein", "Plant protein blend"],
    category: "nutrition",
    tagline: "Fast-digesting complete protein — convenient, not magic.",
    mechanism:
      "Supplies all 9 essential amino acids including leucine (key mTOR trigger). High bioavailability (~1.0 PDCAAS). Useful when whole-food protein is impractical.",
    benefits: [
      "Hits daily protein targets easily without excess calories",
      "Fast absorption (peak amino acids in ~60–90 min) suits post-workout window",
      "Leucine content comparable to or exceeding most whole foods",
      "Convenient — no cooking, shelf-stable",
    ],
    dosing: {
      maintenance: "25–40 g protein per serving (1–1.5 scoops of most products)",
      loading: "N/A",
      frequency: "As needed to hit daily protein target. Not required every day.",
      timing: "Post-workout, between meals, or before bed (casein preferred for overnight)",
      timingNote:
        "The 'anabolic window' is ~hours, not minutes. Taking it within 2 hours of training is fine; obsessing over the exact minute is unnecessary.",
    },
    forms: [
      {
        name: "Concentrate (WPC)",
        note: "80 % protein by weight approx. Contains some lactose and fat. Cheaper. Acceptable for most people.",
        recommended: true,
      },
      {
        name: "Isolate (WPI)",
        note: "≥90 % protein by weight. Lower lactose — choose this if lactose-sensitive. Mixes cleaner.",
        recommended: true,
      },
      {
        name: "Hydrolysate",
        note: "Pre-digested — faster absorption but not meaningfully better in practice. Costs significantly more.",
        recommended: false,
      },
      {
        name: "Casein",
        note: "Slow-digesting (6–8 hr). Good before bed or as a meal replacement. Not faster post-workout.",
        recommended: true,
      },
      {
        name: "Pea + Rice blend (vegan)",
        note: "Complete amino acid profile when combined. Leucine content slightly lower; increase dose by ~10 % to compensate.",
        recommended: true,
      },
    ],
    brands: {
      budget: [
        { name: "Kaizen Naturals (Costco)", note: "~$70 CAD / 5 lb. 26 g protein per scoop, clean label, widely available in Canada." },
        { name: "Dymatize ISO100", note: "Good isolate at mid-range price; low lactose, mixes well." },
      ],
      mid: [
        { name: "ON Gold Standard Whey", note: "$129 CAD / 5 lb. 24 g per scoop, mixes clean in water, decades of consistent quality." },
        { name: "Ghost Whey", note: "Better flavours, slightly pricier. Uses real cereal/candy collaboration flavours." },
      ],
      premium: [
        { name: "Transparent Labs 100% Whey", note: "Fully disclosed label, Creapure-grade sourcing. No proprietary blends." },
        { name: "Thorne Whey Protein Isolate", note: "NSF certified. Useful if competing in tested sports." },
      ],
    },
    interactions: {
      synergistic: [
        "Creatine — take together post-workout for convenience",
        "Fast carbs post-workout — insulin spike may mildly improve uptake",
        "Digestive enzymes (protease) — can help if you notice bloating with WPC",
      ],
      avoid: [
        "If lactose intolerant: stick to isolate or plant-based blend",
        "High-fat meals slow absorption — not a problem unless in a post-workout hurry",
      ],
    },
    sideEffects: [
      "Bloating/gas with concentrate if lactose-sensitive — switch to isolate",
      "Acne in some individuals — often resolves with isolate or casein switch",
      "Excess intake above daily protein needs is simply stored as energy (no benefit)",
    ],
    cycling: {
      required: false,
      protocol: "No cycling needed. Use daily or as needed forever.",
    },
    evidenceRating: "A",
    keyNote:
      "Whey is food, not a drug. If you hit 160–200 g protein from whole foods, you don't need a shake. Use it when convenience matters.",
  },

  pre: {
    id: "pre",
    fullName: "Pre-Workout (stimulant-based)",
    aliases: ["Nitric oxide booster", "Non-stim pre-workout", "Energy/pump formula"],
    category: "performance",
    tagline: "Mostly caffeine with extras — use strategically.",
    mechanism:
      "Caffeine blocks adenosine receptors → reduces perception of effort and fatigue. Beta-alanine buffers muscle acid. Citrulline malate boosts nitric oxide (pumps + endurance). L-theanine smooths the caffeine edge.",
    benefits: [
      "Caffeine: ~3–6 % improvement in endurance, ~2–5 % in strength/power",
      "Citrulline malate: may increase reps-to-failure at moderate loads",
      "Beta-alanine: buffers lactic acid in sets of 8–20 reps",
      "Psychological priming — ritual/motivation effect is real",
    ],
    dosing: {
      maintenance: "Per product label — typically 1 scoop. Half-scoop recommended to start.",
      loading: "N/A",
      frequency: "Training days only. Avoid daily use to prevent tolerance.",
      timing: "20–30 min before training",
      timingNote:
        "Do not take within 6 hours of intended sleep time. If training at night, consider a non-stimulant or caffeine-free version.",
    },
    forms: [
      {
        name: "Full-stimulant (with caffeine 150–300 mg)",
        note: "Most common. Check caffeine per serving — many products are 200–300 mg per scoop which is high.",
        recommended: true,
      },
      {
        name: "Non-stimulant / pump formula",
        note: "Citrulline + glycerol + betaine. No caffeine. Good for evening training or caffeine-sensitive individuals.",
        recommended: true,
      },
      {
        name: "High-stimulant / proprietary blends",
        note: "Sometimes contain DMAA, synephrine, or undisclosed stimulants. Avoid — unnecessary risk.",
        recommended: false,
      },
    ],
    brands: {
      budget: [
        { name: "Cellucor C4 Original", note: "Popular, mid-dose caffeine (150 mg), widely available. Entry point." },
        { name: "Ghost Legend", note: "Good transparent label, 200 mg caffeine, actually enjoyable flavours." },
      ],
      mid: [
        { name: "Nitrosurge by Jacked Factory", note: "Clean ingredient list, 180 mg caffeine, citrulline, beta-alanine. Good value." },
        { name: "Alpha Lion Superhuman", note: "Solid pump + stim combo, fully disclosed label." },
      ],
      premium: [
        { name: "Transparent Labs Bulk", note: "8 g citrulline, 4 g beta-alanine, 200 mg caffeine. Full doses, no underdosing." },
        { name: "Legion Pulse", note: "Clinically dosed, peer-reviewed formulation claimed by brand. Well-regarded in informed circles." },
      ],
    },
    interactions: {
      synergistic: [
        "L-theanine (100–200 mg) reduces caffeine jitters — many products include it",
        "Creatine — no interaction, take together if convenient",
      ],
      avoid: [
        "Other caffeine sources same day (coffee, energy drinks) — stack caffeine load carefully",
        "Alcohol — increases cardiovascular strain",
        "MAOI medications — caffeine interaction risk",
        "Within 6 hrs of sleep",
      ],
    },
    sideEffects: [
      "Beta-alanine tingles (paresthesia) — harmless, reduces with regular use or split dosing",
      "Elevated heart rate / blood pressure — not recommended with cardiovascular conditions",
      "Tolerance builds fast — cycle 4–6 weeks on, 2 weeks off",
      "Insomnia if taken too late",
      "GI discomfort on empty stomach — take with a small snack",
    ],
    cycling: {
      required: true,
      protocol:
        "4–8 weeks on, 1–2 weeks off stimulant-based. Non-stim versions can be used continuously. Take at least 2 weeks caffeine-free every 2–3 months.",
    },
    evidenceRating: "B",
    keyNote:
      "Caffeine is the active ingredient. A double espresso 30 min before training delivers the same core benefit for a fraction of the cost.",
  },

  omega: {
    id: "omega",
    fullName: "Omega-3 Fatty Acids (EPA + DHA)",
    aliases: ["Fish oil", "Krill oil", "Algae omega-3 (vegan)"],
    category: "health",
    tagline: "The most broadly beneficial health supplement — goes beyond the gym.",
    mechanism:
      "EPA and DHA are structural phospholipids in cell membranes. EPA modulates eicosanoid pathways (inflammation signalling); DHA is heavily concentrated in brain tissue and retina. Both support healthy triglyceride metabolism.",
    benefits: [
      "Reduces muscle soreness and DOMS by ~10–15 % in some studies",
      "Cardiovascular: lowers triglycerides 15–30 % at ≥2 g EPA+DHA/day",
      "Anti-inflammatory — may help joint comfort at moderate training volumes",
      "DHA supports cognitive function and mood",
      "May modestly enhance muscle protein synthesis (especially in older adults)",
    ],
    dosing: {
      maintenance: "1–2 g combined EPA + DHA daily",
      loading: "3–4 g EPA+DHA for active inflammatory reduction (short-term)",
      frequency: "Daily",
      timing: "With a fat-containing meal for best absorption",
      timingNote:
        "Fat in the meal increases micellar absorption. Breakfast with eggs or ghee is ideal. Enteric-coated capsules reduce fishy burps.",
    },
    forms: [
      {
        name: "Fish oil capsules",
        note: "Most common. Check the label for EPA+DHA per capsule — many products show 1 g fish oil but only 300 mg combined EPA+DHA.",
        recommended: true,
      },
      {
        name: "Liquid fish oil",
        note: "Higher dose per mL, often lemon-flavoured to reduce taste. Cheaper per gram of EPA+DHA.",
        recommended: true,
      },
      {
        name: "Krill oil",
        note: "Bound to phospholipids — claimed higher absorption. Lower dose available per capsule. More expensive.",
        recommended: false,
      },
      {
        name: "Algae oil (vegan)",
        note: "Derived from the algae that fish eat. Same EPA+DHA profile. Preferred for vegans or those avoiding fish.",
        recommended: true,
      },
    ],
    brands: {
      budget: [
        { name: "Costco Kirkland Omega-3", note: "1 g EPA+DHA per 2 capsules, IFOS 5-star certified, excellent cost." },
        { name: "NOW Foods Ultra Omega-3", note: "500 mg EPA + 250 mg DHA per softgel, affordable, IFOS certified." },
      ],
      mid: [
        { name: "Nordic Naturals Ultimate Omega", note: "High potency, lemon-flavoured, third-party tested, no burps." },
        { name: "Thorne Super EPA", note: "NSF certified, good EPA:DHA ratio, no proprietary blend." },
      ],
      premium: [
        { name: "Carlson Very Finest Fish Oil (liquid)", note: "Award-winning taste, IFOS certified, ~1600 mg EPA+DHA per tsp." },
        { name: "Viva Naturals Algae Omega (vegan)", note: "Plant-sourced, 400 mg DHA + 200 mg EPA, good for vegans." },
      ],
    },
    interactions: {
      synergistic: [
        "Vitamin D — often co-supplemented; fat-soluble vitamins absorb together",
        "Magnesium — combined anti-inflammatory and recovery benefit",
        "Curcumin — both modulate inflammatory pathways, stackable",
      ],
      avoid: [
        "Blood thinners (warfarin, aspirin therapy) — omega-3 has mild antiplatelet effect; consult doctor at doses >3 g",
        "Vitamin E at high doses (antioxidant interference is context-dependent)",
      ],
    },
    sideEffects: [
      "Fishy burps — use enteric-coated, freeze the capsule, or take with food",
      "Mild GI upset at high doses — split dose if needed",
      "Slight blood-thinning at very high doses (>4 g/day) — relevant before surgery",
    ],
    cycling: {
      required: false,
      protocol: "Daily, year-round. No cycling needed.",
    },
    evidenceRating: "A",
    keyNote:
      "Read the label carefully: '1000 mg fish oil' is not the same as '1000 mg EPA+DHA.' You want 1–2 g of the combined EPA+DHA number.",
  },

  multi: {
    id: "multi",
    fullName: "Multivitamin / Multimineral",
    aliases: ["Men's multi", "Women's multi", "Sports multivitamin"],
    category: "health",
    tagline: "Insurance policy against micronutrient gaps — not a substitute for food.",
    mechanism:
      "Supplies RDA/RDI amounts of vitamins and minerals. At performance-focused doses (often 2–3× RDA), may support enzyme cofactor pathways involved in energy metabolism, immune function, and tissue repair.",
    benefits: [
      "Fills gaps when diet is restricted (cutting phases, travel, illness)",
      "B-vitamins support energy metabolism and red blood cell production",
      "Vitamin D often deficient in northern latitudes — supplementing is impactful",
      "Zinc and magnesium support testosterone production and sleep",
      "Iron (women): critical if menstruating — deficiency impairs performance sharply",
    ],
    dosing: {
      maintenance: "1 serving per day (follow label — most are 1–3 capsules)",
      loading: "N/A",
      frequency: "Daily",
      timing: "With breakfast",
      timingNote:
        "Most vitamins absorb better with food. Fat-soluble vitamins (A, D, E, K) need dietary fat present. Morning helps avoid sleep disruption from B-vitamin stimulation in some people.",
    },
    forms: [
      {
        name: "Capsules / tablets",
        note: "Standard. Look for activated forms: methylfolate vs folic acid, methylcobalamin vs cyanocobalamin.",
        recommended: true,
      },
      {
        name: "Gummies",
        note: "Lower dose of many nutrients, often lack zinc and iron due to taste. Fine as a baseline but underdosed.",
        recommended: false,
      },
      {
        name: "Effervescent / liquid",
        note: "Better absorption for some minerals. Good if you have difficulty swallowing capsules.",
        recommended: true,
      },
    ],
    brands: {
      budget: [
        { name: "Centrum Men / Women", note: "Widely available, covers all basics. Low dose but consistent quality control." },
        { name: "Kirkland Daily Multi", note: "Solid Costco option — USP verified, good value." },
      ],
      mid: [
        { name: "Optimum Nutrition Opti-Men / Opti-Women", note: "Higher doses, added amino acids and enzymes. Popular in gym community." },
        { name: "Rainbow Light Men's / Women's One", note: "Food-based blend, gentle on stomach." },
      ],
      premium: [
        { name: "Thorne Basic Nutrients 2/Day", note: "NSF certified, activated B-vitamins, no unnecessary additives." },
        { name: "Athletic Greens / AG1", note: "Full-spectrum greens + multi combo. Expensive (~$99/mo) but comprehensive. Skip if budget is tight." },
      ],
    },
    interactions: {
      synergistic: [
        "Omega-3 — fat-soluble vitamins absorb together",
        "Probiotics (if multi doesn't include them) — gut health supports nutrient absorption",
      ],
      avoid: [
        "Iron-containing multi + calcium at same time — compete for absorption; separate by 2 hrs",
        "Excessive zinc supplementation on top of multi — can displace copper",
        "Megadosing fat-soluble vitamins A and E beyond what the multi provides",
      ],
    },
    sideEffects: [
      "Nausea on empty stomach — take with breakfast",
      "Urine turns bright yellow (riboflavin/B2) — normal and harmless",
      "Iron-containing multi: constipation in some — maintain hydration",
    ],
    cycling: {
      required: false,
      protocol: "Daily. May reduce or skip during periods of very high whole-food variety.",
    },
    evidenceRating: "B",
    keyNote:
      "A multi covers gaps. It doesn't offset a poor diet. Prioritise whole-food variety first; the multi is the safety net beneath it.",
  },

  mag: {
    id: "mag",
    fullName: "Magnesium (Bisglycinate / Glycinate)",
    aliases: ["Magnesium glycinate", "Magnesium citrate", "Magnesium L-threonate", "Magnesium oxide"],
    category: "recovery",
    tagline: "Sleep and muscle relaxation — the most under-supplemented mineral in athletes.",
    mechanism:
      "Cofactor in 300+ enzymatic reactions. Critical for ATP synthesis, muscle contraction/relaxation, NMDA receptor modulation (nervous system calming), and protein synthesis. Deficiency is common in athletes due to sweat losses.",
    benefits: [
      "Improves sleep onset, quality, and deep-sleep duration at 200–400 mg",
      "Reduces muscle cramps and nocturnal leg twitching",
      "Supports cortisol regulation — moderates stress response",
      "May improve insulin sensitivity at higher doses",
      "Important for bone mineral density alongside calcium",
    ],
    dosing: {
      maintenance: "200–400 mg elemental magnesium per day",
      loading: "N/A — no loading phase; effects build over 1–2 weeks",
      frequency: "Daily",
      timing: "Evening, 1–2 hours before bed",
      timingNote:
        "Evening timing takes advantage of the sleep-promoting effects. Can split dose: half morning, half evening if GI sensitive.",
    },
    forms: [
      {
        name: "Bisglycinate / Glycinate",
        note: "Best absorbed form, gentlest on GI tract, highest bioavailability. Best choice overall.",
        recommended: true,
      },
      {
        name: "Citrate",
        note: "Well-absorbed, mild laxative effect (useful if constipated; problematic if not). Cheaper than glycinate.",
        recommended: true,
      },
      {
        name: "L-Threonate",
        note: "Crosses blood-brain barrier — marketed for cognitive benefits. Most expensive. May be better for neuroprotection than sleep/muscle.",
        recommended: false,
      },
      {
        name: "Oxide",
        note: "Cheapest and most common in cheap supplements. Very poor bioavailability (~4 %). Avoid for systemic effects.",
        recommended: false,
      },
    ],
    brands: {
      budget: [
        { name: "NOW Foods Magnesium Glycinate 180 mg", note: "Clean label, well-priced, widely available." },
        { name: "Natural Calm Magnesium Citrate", note: "Powder, easy to dose, good for those who dislike capsules." },
      ],
      mid: [
        { name: "Pure Encapsulations Magnesium Glycinate", note: "Hypoallergenic, no additives, trusted brand." },
        { name: "Doctor's Best High Absorption Magnesium", note: "TRAACS chelate, well-studied, good absorption." },
      ],
      premium: [
        { name: "Thorne Magnesium Bisglycinate", note: "NSF certified, excellent purity." },
        { name: "Magtein (Magnesium L-Threonate)", note: "MIT-patented form for cognitive use. If sleep is your primary goal, glycinate is equal or better." },
      ],
    },
    interactions: {
      synergistic: [
        "Zinc — co-take in ZMA formulas for testosterone and sleep support",
        "Ashwagandha — combined cortisol modulation and sleep improvement",
        "Vitamin B6 — enhances intracellular magnesium retention",
        "Vitamin D — required for magnesium metabolism",
      ],
      avoid: [
        "High-dose calcium at same time — compete for absorption; separate by 2+ hours",
        "Certain antibiotics (fluoroquinolones, tetracyclines) — separate by 2 hrs",
        "Diuretics — may increase magnesium loss (talk to doctor)",
      ],
    },
    sideEffects: [
      "Loose stools / diarrhoea (dose-dependent) — switch to glycinate or reduce dose",
      "Drowsiness if taken in daytime — take at night",
      "Hypotension (low blood pressure) at very high doses — rare at dietary supplement levels",
    ],
    cycling: {
      required: false,
      protocol: "Daily, year-round. Safe for indefinite use at recommended doses.",
    },
    evidenceRating: "B",
    keyNote:
      "Up to 60 % of people in Western countries are below the RDA for magnesium. Athletes sweat it out. If you sleep badly and cramp often, try this before buying anything else.",
  },

  ash: {
    id: "ash",
    fullName: "KSM-66 Ashwagandha (Withania somnifera root extract)",
    aliases: ["Indian ginseng", "Withania root", "Sensoril ashwagandha"],
    category: "recovery",
    tagline: "Adaptogen with solid evidence for stress, recovery, and modest testosterone support.",
    mechanism:
      "Withanolide compounds modulate the HPA (hypothalamic-pituitary-adrenal) axis — reducing cortisol output under chronic stress. Also appears to support GABA-ergic pathways (anxiolytic effect) and may mildly stimulate LH → testosterone.",
    benefits: [
      "Reduces cortisol by 14–30 % in stressed adults across multiple RCTs",
      "Improved sleep quality (particularly sleep latency and deep sleep)",
      "Modest testosterone increase: +10–17 % in stressed/subclinical-low-T men in some trials",
      "Reduced perceived fatigue and anxiety — meaningful in high training volume",
      "May slightly improve VO₂ max and muscular endurance",
    ],
    dosing: {
      maintenance: "300–600 mg of KSM-66 (full-spectrum root extract) per day",
      loading: "N/A — 4–8 weeks to peak effect",
      frequency: "Once or twice daily",
      timing: "Evening with food (primary dose); can split AM + PM",
      timingNote:
        "Evening dosing leverages the cortisol-reducing effect for sleep. If taking twice daily, second dose with dinner. Full effects take 4–8 weeks to manifest — don't quit at week 2.",
    },
    forms: [
      {
        name: "KSM-66 (root extract, 5 % withanolides)",
        note: "Best-studied branded form. Grown and extracted in India, cold-process, milk-extracted. Gold standard.",
        recommended: true,
      },
      {
        name: "Sensoril (leaf + root extract, 10 % withanolides)",
        note: "Higher withanolide concentration. Different extraction. Also well-studied. Some prefer for anxiety/sleep over performance.",
        recommended: true,
      },
      {
        name: "Generic 'ashwagandha extract'",
        note: "Variable withanolide content. May work but potency is inconsistent. Budget option if KSM-66/Sensoril is unavailable.",
        recommended: false,
      },
    ],
    brands: {
      budget: [
        { name: "NOW Foods KSM-66 Ashwagandha 300 mg", note: "Clean label, certified KSM-66, well-priced." },
        { name: "NutriCost Ashwagandha KSM-66", note: "Good dose, affordable, third-party tested." },
      ],
      mid: [
        { name: "Pure Encapsulations Ashwagandha", note: "KSM-66, hypoallergenic, no fillers." },
        { name: "Jarrow Formulas Ashwagandha KSM-66", note: "600 mg per capsule, well-regarded." },
      ],
      premium: [
        { name: "Thorne Botanicals Ashwagandha", note: "NSF certified, 300 mg KSM-66 per cap, clinical-grade." },
        { name: "Ixoreal Biomed KSM-66 (bulk raw)", note: "The original manufacturer's certified ingredient — many premium brands source from here." },
      ],
    },
    interactions: {
      synergistic: [
        "Magnesium — combined sleep and cortisol benefit",
        "L-theanine — complementary anxiolytic mechanisms",
        "Rhodiola rosea — different adaptogen pathway, stackable",
      ],
      avoid: [
        "Thyroid medications — ashwagandha may modestly increase T3/T4; consult doctor if on thyroid meds",
        "Sedatives / benzodiazepines — additive CNS depressant effect",
        "Immunosuppressants — ashwagandha may upregulate immune function",
        "Pregnancy: contraindicated (traditional use as abortifacient at high doses)",
      ],
    },
    sideEffects: [
      "Mild GI upset if taken on empty stomach — take with food",
      "Drowsiness (dose-dependent, more likely with Sensoril) — take at night",
      "Rare: liver injury reported at very high doses (>1200 mg/day) — stay within 300–600 mg",
      "Possible excess drowsiness if stacked with multiple sedating supplements",
    ],
    cycling: {
      required: true,
      protocol:
        "8–12 weeks on, 4 weeks off. HPA-axis adaptogens benefit from periodic breaks to maintain sensitivity. Many users run 3 months on, 1 month off annually.",
    },
    evidenceRating: "B",
    keyNote:
      "KSM-66 is not a testosterone booster in the steroid sense — it restores suppressed levels toward normal in stressed individuals. If you're already unstressed and sleeping well, the effect is smaller. The sleep and cortisol benefit is the primary use case here.",
  },
};

/**
 * Flat supplement schedule for the Daily Schedule card.
 * Each row maps to a time block with what to take and a coaching note.
 */
export const DAILY_SCHEDULE = [
  {
    time: "Morning (with breakfast)",
    items: ["Multivitamin", "Omega-3 (1–2 g EPA+DHA)"],
    note: "Fat in breakfast improves absorption of both. Take together for convenience.",
    suppIds: ["multi", "omega"],
  },
  {
    time: "Pre-workout (30 min before)",
    items: ["Pre-Workout — 1 scoop"],
    note: "30 min before lifting. Skip on rest days. Don't take within 6 hrs of sleep.",
    suppIds: ["pre"],
  },
  {
    time: "Post-workout (within 30 min)",
    items: ["Whey protein 1.5 scoops", "Creatine 5 g"],
    note: "On rest days, take creatine with any meal — daily consistency matters more than timing.",
    suppIds: ["whey", "creatine"],
  },
  {
    time: "Evening (1–2 hrs before bed)",
    items: ["Ashwagandha 300–600 mg KSM-66", "Magnesium Bisglycinate 200–400 mg"],
    note: "Together — reduces cortisol, relaxes muscle tension, improves sleep quality and overnight recovery.",
    suppIds: ["ash", "mag"],
  },
];

/**
 * Supplement pairing guide: which combinations are well-supported,
 * which are redundant, and what to watch out for.
 */
export const SUPP_STACK_GUIDE = {
  beginner: {
    label: "Beginner Stack (3 supps)",
    items: ["creatine", "whey", "omega"],
    rationale:
      "Creatine for strength, whey for protein convenience, omega-3 for recovery and general health. Everything else is optional on top of these.",
  },
  intermediate: {
    label: "Intermediate Stack (5 supps)",
    items: ["creatine", "whey", "omega", "mag", "multi"],
    rationale:
      "Add magnesium for sleep and recovery, multivitamin to cover micronutrient gaps during a training block.",
  },
  full: {
    label: "Full Stack (7 supps)",
    items: ["creatine", "whey", "pre", "omega", "multi", "mag", "ash"],
    rationale:
      "All 7 together. Pre-workout on training days only. Ashwagandha when training stress or life stress is high. This is the ceiling — adding more beyond this has rapidly diminishing returns.",
  },
  avoid: [
    "BCAAs — redundant at 160+ g protein/day; complete protein sources contain all branched-chain amino acids already",
    "Fat burners / thermogenics — mostly stimulant blends with minor effect; the calorie deficit does the work",
    "Testosterone boosters (generic) — almost none have human evidence beyond stressed populations",
    "Collagen protein as primary protein source — incomplete amino acid profile, low leucine",
    "Glutamine — the body produces enough; no evidence for immune or gut benefit in healthy athletes",
  ],
};
