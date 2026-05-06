/** np_weights — [{ date: 'YYYY-MM-DD', kg: number }] */
const WEIGHT_KEY = "np_weights";

export function getWeights() {
  try {
    return JSON.parse(localStorage.getItem(WEIGHT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function logWeight(kg) {
  const weights = getWeights();
  const today = new Date().toISOString().slice(0, 10);
  const idx = weights.findIndex((w) => w.date === today);
  if (idx >= 0) weights[idx].kg = kg;
  else weights.push({ date: today, kg });
  weights.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(weights.slice(-52)));
}
