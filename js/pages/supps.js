import { t } from "../i18n.js";
import { todayKey } from "../foodLog.js";
import { SUPP_DETAIL, SUPP_STACK_GUIDE, DAILY_SCHEDULE } from "../data/supplements.js";

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

function suppLogStorageKey(dateKey = todayKey()) {
  return `np_supp_log_${dateKey}`;
}

function getSuppLog() {
  try {
    return JSON.parse(localStorage.getItem(suppLogStorageKey()) || "{}");
  } catch {
    return {};
  }
}

function saveSuppLog(obj) {
  localStorage.setItem(suppLogStorageKey(), JSON.stringify(obj));
}

function suppStreak(suppId) {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = suppLogStorageKey(d.toISOString().slice(0, 10));
    let log = {};
    try {
      log = JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      log = {};
    }
    if (log[suppId]) streak++;
    else break;
  }
  return streak;
}

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

  const stackIds = (plan.supps || []).map((s) => s.id);
  const log = getSuppLog();
  const takenCount = stackIds.filter((id) => log[id]).length;
  const totalStack = stackIds.length;
  const adherPct = totalStack ? Math.round((takenCount / totalStack) * 100) : 0;

  const adherenceBar =
    totalStack > 0
      ? `
      <div class="compliance-bar glass supp-adherence-bar">
        <div class="compliance-row">
          <span class="compliance-label">${t("supps.adherence_today")}</span>
          <span class="compliance-kcal">${takenCount}/${totalStack}</span>
        </div>
        <div class="progress-track" style="margin-top:8px">
          <div class="progress-fill supp-adherence-fill" style="width:${adherPct}%;animation:none"></div>
        </div>
      </div>`
      : "";

  const EVIDENCE_COLOUR = { A: "var(--accent-lime)", B: "var(--accent-teal)", C: "var(--accent-gold)", D: "var(--accent-orange)" };

  const suppCards = (plan.supps || [])
    .map((s) => {
      const meta = SUPP_META[s.id] || { dot: "var(--text-dim)", name: s.id, status: "have" };
      const detail = SUPP_DETAIL[s.id];
      const timingChips =
        (s.time || "")
          .split(",")
          .map((x) => `<span class="timing-chip active">${x.trim()}</span>`)
          .join("") + `<span class="timing-chip">${s.dose}</span>`;
      const streak = suppStreak(s.id);
      const isTaken = !!log[s.id];

      const evidenceBadge = detail
        ? `<span class="timing-chip" style="background:${EVIDENCE_COLOUR[detail.evidenceRating] || "var(--text-dim)"}20;color:${EVIDENCE_COLOUR[detail.evidenceRating] || "var(--text-dim)"}">Evidence: ${detail.evidenceRating}</span>`
        : "";

      const topFormNote = detail
        ? (() => {
            const rec = detail.forms.find((f) => f.recommended);
            return rec
              ? `<div class="supp-form-note" style="font-size:0.72rem;color:var(--text-muted);margin-top:6px;line-height:1.5">
                   <strong style="color:var(--text-secondary)">Best form:</strong> ${rec.name} — ${rec.note}
                 </div>`
              : "";
          })()
        : "";

      const cyclingNote = detail?.cycling?.required
        ? `<div class="supp-form-note" style="font-size:0.72rem;color:var(--accent-gold);margin-top:4px">
             ⚠ Cycling: ${detail.cycling.protocol}
           </div>`
        : "";

      const keyNote = detail?.keyNote
        ? `<div class="supp-form-note" style="font-size:0.72rem;color:var(--text-dim);margin-top:6px;font-style:italic;line-height:1.5">${detail.keyNote}</div>`
        : "";

      return `
      <div class="supp-card">
        <div class="supp-head">
          <div class="supp-dot" style="background:${meta.dot}"></div>
          <div class="supp-name">${meta.name}</div>
          <div class="supp-status have">Have it</div>
        </div>
        <div class="supp-body">
          <div class="supp-why">${s.why}</div>
          ${topFormNote}
          ${cyclingNote}
          ${keyNote}
          <div class="supp-streak">${t("supps.streak_days", { n: streak })}</div>
          <div class="supp-timing-row">${timingChips}${evidenceBadge}</div>
          <button type="button" class="supp-taken-btn ${isTaken ? "taken" : ""}" data-supp="${s.id}">
            ${isTaken ? t("supps.taken_today") : t("supps.mark_taken")}
          </button>
        </div>
      </div>`;
    })
    .join("");

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

      ${adherenceBar}

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

      <div class="section-eyebrow" style="margin-top:20px">What to Avoid</div>
      <div class="glass" style="border-radius:14px;padding:14px 16px;margin-bottom:8px">
        ${SUPP_STACK_GUIDE.avoid.map((item) => `
          <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:0.8rem;color:var(--text-muted);line-height:1.5">
            <span style="color:var(--accent-orange);flex-shrink:0;margin-top:1px">✕</span>
            <span>${item}</span>
          </div>`).join("")}
      </div>

      <div class="section-eyebrow" style="margin-top:20px">Stack Progression Guide</div>
      ${[SUPP_STACK_GUIDE.beginner, SUPP_STACK_GUIDE.intermediate, SUPP_STACK_GUIDE.full].map((tier, i) => {
        const colours = ["var(--accent-lime)", "var(--accent-teal)", "var(--accent-gold)"];
        return `
        <div class="glass" style="border-radius:14px;padding:14px 16px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <div style="width:8px;height:8px;border-radius:50%;background:${colours[i]};flex-shrink:0"></div>
            <div style="font-size:0.78rem;font-weight:600;color:var(--text-secondary)">${tier.label}</div>
          </div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;line-height:1.5">${tier.rationale}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${tier.items.map((id) => `<span class="timing-chip active" style="background:${colours[i]}18;color:${colours[i]}">${SUPP_DETAIL[id]?.fullName || id}</span>`).join("")}
          </div>
        </div>`;
      }).join("")}
    </div>`;

  root.querySelectorAll(".supp-taken-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.supp;
      const cur = getSuppLog();
      if (cur[id]) delete cur[id];
      else cur[id] = true;
      saveSuppLog(cur);
      mountSupps(root, profile, plan);
    });
  });
}
