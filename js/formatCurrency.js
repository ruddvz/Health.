/** Symbols for settings / future price displays. */
const SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", NONE: "" };

export function formatCurrencyAmount(amount, code) {
  const c = code || "NONE";
  if (c === "NONE" || !SYMBOLS[c]) return String(Math.round(Number(amount) || 0));
  return `${SYMBOLS[c]}${Math.round(Number(amount) || 0)}`;
}

export function currencyLabel(code) {
  const c = code || "NONE";
  if (c === "NONE") return "";
  return `${c} ${SYMBOLS[c] || ""}`.trim();
}
