import { t } from "../i18n.js";

const LABEL = {
  creatine: "Creatine",
  whey: "Whey protein",
  pre: "Pre-workout",
  omega: "Omega-3",
  multi: "Multivitamin",
  mag: "Magnesium",
  ash: "Ashwagandha",
};

export function mountSupps(root, profile, plan) {
  const hasWhey = profile.supplements?.includes("whey");
  const veg = profile.dietType === "veg" || profile.dietType === "vegan" || profile.dietType === "eggetarian";

  const cards = (plan.supps || [])
    .map(
      (s) => `
    <div class="glass card">
      <h3>${LABEL[s.id] || s.id}</h3>
      <p><strong>Dose:</strong> ${s.dose}</p>
      <p><strong>Timing:</strong> ${s.time}</p>
      <p style="color:var(--text-dim);font-size:0.9rem;margin:0">${s.why}</p>
    </div>`
    )
    .join("");

  const empty = !plan.supps?.length ? `<p class="empty-hint">${t("supps.none")}</p>` : "";

  const wheyBlock =
    !hasWhey && veg
      ? `<div class="glass card" style="border-color:var(--accent-orange)">
      <h3>${t("supps.whey_note_title")}</h3>
      <p style="margin:0;color:var(--text-dim)">${t("supps.whey_note")}</p>
    </div>`
      : "";

  const compare = !hasWhey
    ? `<div class="glass card"><h3>${t("supps.compare")}</h3>
      <p style="color:var(--text-dim);font-size:0.9rem;margin:0">Whey: fast digesting. Casein: slow overnight. Plant blends: vegan-friendly.</p></div>`
    : "";

  root.innerHTML = `
    <div class="page-enter">
      <h2 class="step-title" style="font-size:1.2rem">${t("supps.title")}</h2>
      <p class="step-sub">${t("supps.schedule")}</p>
      ${empty}
      ${cards}
      ${wheyBlock}
      ${compare}
    </div>`;
}
