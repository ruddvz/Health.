/**
 * Plan0 §8.8 — apply saved theme / units from healthStore to <html>.
 */
import { getHealthState } from "./healthStore.js";

export function applyThemeFromHealthStore() {
  const root = document.documentElement;
  const st = getHealthState().settings || {};
  const theme = st.theme || "auto";
  if (theme === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  root.setAttribute("data-units", st.units === "imperial" ? "imperial" : "metric");
  root.setAttribute("data-week-start", st.weekStart === "sunday" ? "sunday" : "monday");
}
