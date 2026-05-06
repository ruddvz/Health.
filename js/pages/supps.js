import { t } from "../i18n.js";

const SUPP_META = {
  creatine: { dot: "var(--accent-lime)",   name: "Creatine Monohydrate",    status: "have" },
  whey:     { dot: "var(--accent-teal)",   name: "Whey Protein",            status: "have" },
  pre:      { dot: "var(--accent-orange)", name: "Pre-Workout (Nitro Surge)",status: "have" },
  omega:    { dot: "var(--accent-teal)",   name: "Omega-3 Fish Oil",         status: "have" },
  multi:    { dot: "var(--accent-lime)",   name: "Men's Multivitamin",       status: "have" },
  mag:      { dot: "var(--accent-purple)", name: "Magnesium Bisglycinate",   status: "have" },
  ash:      { dot: "var(--accent-gold)",   name: "KSM-66 Ashwagandha",       status: "have" },
};

const SCHEDULE_ROWS = [
  { time: "Morning",    items: ["Multivitamin + Omega-3"], note: "Take with breakfast — fat in the meal helps absorb Omega-3." },
  { time: "Pre-gym",    items: ["Pre-Workout — 1 scoop"], note: "30 min before. Skip on rest days. Don't take within 6 hrs of sleep." },
  { time: "Post-gym",   items: ["Whey 1.5 scoops + Creatine 5g"], note: "Within 30 min of finishing. On rest days take creatine with any meal." },
  { time: "Before bed", items: ["Ashwagandha + Magnesium"], note: "Together. Lowers cortisol and improves sleep quality + overnight recovery." },
];

export function mountSupps(root, profile, plan) {
  const hasWhey = profile.supplements?.includes("whey");
  const veg = ["veg", "vegan", "eggetarian"].includes(profile.dietType);
  const userSupps = new Set(profile.supplements || []);

  const scheduleHTML = SCHEDULE_ROWS
    .filter(row => {
      if (row.time === "Pre-gym" && !userSupps.has("pre")) return false;
      if (row.time === "Post-gym") return userSupps.has("whey") || userSupps.has("creatine");
      return true;
    })
    .map(row => `
      <div class="ds-row">
        <div class="ds-time">${row.time}</div>
        <div>
          <div class="ds-name">${row.items.join(", ")}</div>
          <div class="ds-note">${row.note}</div>
        </div>
      </div>`).join("");

  const suppCards = (plan.supps || []).map(s => {
    const meta = SUPP_META[s.id] || { dot: "var(--text-dim)", name: s.id, status: "have" };
    const timingChips = (s.time || "").split(",").map(t =>
      `<span class="timing-chip active">${t.trim()}</span>`
    ).join("") + `<span class="timing-chip">${s.dose}</span>`;

    return `
      <div class="supp-card">
        <div class="supp-head">
          <div class="supp-dot" style="background:${meta.dot}"></div>
          <div class="supp-name">${meta.name}</div>
          <div class="supp-status have">Have it</div>
        </div>
        <div class="supp-body">
          <div class="supp-why">${s.why}</div>
          <div class="supp-timing-row">${timingChips}</div>
        </div>
      </div>`;
  }).join("");

  const wheyBlock = !hasWhey
    ? `
      <div class="section-eyebrow" style="margin-top:8px">Protein Powder — Which to Buy</div>
      <div class="supp-card">
        <div class="supp-head">
          <div class="supp-dot" style="background:var(--accent-lime)"></div>
          <div class="supp-name">ON Gold Standard Whey</div>
          <div class="supp-status have">Best Overall</div>
        </div>
        <div class="supp-body">
          <div class="supp-why">$129 / 5lb. 24g protein per scoop, mixes clean in water, solid amino acid profile. Lasts 2+ months. If the budget is there, this is the right call.</div>
          <div class="supp-timing-row"><span class="timing-chip active">24g / scoop</span><span class="timing-chip">5lb bag</span></div>
        </div>
      </div>
      <div class="supp-card">
        <div class="supp-head">
          <div class="supp-dot" style="background:var(--accent-teal)"></div>
          <div class="supp-name">Kaizen Naturals — Costco</div>
          <div class="supp-status" style="background:var(--teal-15);color:var(--accent-teal)">Budget Pick</div>
        </div>
        <div class="supp-body">
          <div class="supp-why">~$70 / 5lb. Canadian brand, 26g protein per scoop, no proprietary blends. Half the price of Gold Standard with similar results. Check flyers — goes on sale regularly.</div>
          <div class="supp-timing-row"><span class="timing-chip active">26g / scoop</span><span class="timing-chip">Costco</span></div>
        </div>
      </div>` : "";

  const vegNote = !hasWhey && veg
    ? `<div class="info-box info-box-orange">
        <strong>${t("supps.whey_note_title")}:</strong> ${t("supps.whey_note")}
      </div>` : "";

  const empty = !plan.supps?.length
    ? `<div class="empty-hint">${t("supps.none")}</div>` : "";

  root.innerHTML = `
    <div class="page-enter">
      <div class="page-header">
        <div class="ph-eyebrow">// Your stack</div>
        <div class="ph-title">Supplements</div>
        <div class="ph-desc">Built around what you actually have. Dosage, timing, and why each one matters.</div>
      </div>

      <div class="section-eyebrow">Daily Schedule</div>
      <div class="daily-schedule-card">${scheduleHTML}</div>

      <div class="section-eyebrow">Your Stack</div>
      ${empty}
      ${vegNote}
      ${suppCards}
      ${wheyBlock}

      <div class="info-box info-box-orange" style="margin-top:4px">
        <strong>Don't buy anything else.</strong> BCAAs are useless at 170g+ protein per day. Fat burners don't work. Extra pre-workout stacks are just more caffeine. Your stack is complete — save the money for better food.
      </div>
    </div>`;
}
