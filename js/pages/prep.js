import { t } from "../i18n.js";

export function mountPrep(root, profile, plan) {
  const steps = plan.prep
    .map((s, i) => `<li style="margin-bottom:10px"><strong>${i + 1}.</strong> ${s.t} <span style="color:var(--text-dim)">(~${s.m} min)</span></li>`)
    .join("");
  root.innerHTML = `
    <div class="page-enter">
      <h2 class="step-title" style="font-size:1.2rem">${t("prep.title")}</h2>
      <p class="step-sub">${t("prep.intro")}</p>
      <div class="glass card">
        <ol class="ing-list" style="padding-left:18px">${steps}</ol>
      </div>
    </div>`;
}
