import { t } from "../i18n.js";

export function mountPhases(root, profile, plan) {
  const cards = plan.phases
    .map(
      (p) => `
    <div class="glass card page-enter">
      <h3>Phase ${p.index}</h3>
      <p class="step-sub" style="margin:0 0 8px">${t("phases.weeks", { n: p.weeks })}</p>
      <p><strong>${t("phases.kcal")}:</strong> ${p.calories} kcal</p>
      <p><strong>${t("phases.macros")}:</strong> P ${p.macro.protein}g · F ${p.macro.fat}g · C ${p.macro.carbs}g</p>
      <p><strong>${t("phases.focus")}:</strong> ${p.focus}</p>
      <p style="color:var(--text-dim);font-size:0.9rem;margin:0"><strong>${t("phases.rotation")}:</strong> ${p.rotation}</p>
      ${p.note ? `<p style="margin-top:8px;font-size:0.85rem;color:var(--accent-teal)">${p.note}</p>` : ""}
    </div>`
    )
    .join("");

  root.innerHTML = `<div>${cards}</div>`;
}
