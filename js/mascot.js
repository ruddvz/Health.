/**
 * Otto the Otter — inline SVG placeholders (brown / cream, thick outline).
 * Matches PROMPTS.md v3; swap for PNGs in assets/otto/ when ready.
 */

const STROKE = "#1a1a1a";
const BROWN = "#7a5c45";
const CREAM = "#e8d4b8";
const DARK = "#1a1a1a";

function head(cx = 64, cy = 52) {
  return `
  <ellipse cx="${cx}" cy="${cy}" rx="28" ry="24" fill="${BROWN}" stroke="${STROKE}" stroke-width="2.5"/>
  <ellipse cx="${cx}" cy="${cy + 4}" rx="18" ry="16" fill="${CREAM}" stroke="none"/>
  <circle cx="${cx - 10}" cy="${cy - 2}" r="5" fill="${DARK}"/>
  <circle cx="${cx + 10}" cy="${cy - 2}" r="5" fill="${DARK}"/>
  <circle cx="${cx - 11}" cy="${cy - 3}" r="1.8" fill="#fff"/>
  <circle cx="${cx + 9}" cy="${cy - 3}" r="1.8" fill="#fff"/>
  `;
}

function gills(cx = 64, cy = 52) {
  return `
  <path d="M${cx - 30} ${cy} Q${cx - 38} ${cy - 8} ${cx - 34} ${cy + 10}" fill="none" stroke="${STROKE}" stroke-width="2" stroke-linecap="round"/>
  <path d="M${cx + 30} ${cy} Q${cx + 38} ${cy - 8} ${cx + 34} ${cy + 10}" fill="none" stroke="${STROKE}" stroke-width="2" stroke-linecap="round"/>
  `;
}

function body(y = 72) {
  return `<ellipse cx="64" cy="${y}" rx="34" ry="26" fill="${BROWN}" stroke="${STROKE}" stroke-width="2.5"/>
  <ellipse cx="64" cy="${y + 6}" rx="20" ry="14" fill="${CREAM}" stroke="none"/>`;
}

function tail() {
  return `<ellipse cx="98" cy="78" rx="14" ry="10" fill="${BROWN}" stroke="${STROKE}" stroke-width="2" transform="rotate(-15 98 78)"/>`;
}

const poses = {
  wave: `
  ${gills()}
  ${head()}
  ${body()}
  ${tail()}
  <ellipse cx="38" cy="82" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2"/>
  <ellipse cx="90" cy="70" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2" transform="rotate(25 90 70)"/>
  <path d="M58 58 Q64 64 70 58" stroke="${STROKE}" fill="none" stroke-width="2" stroke-linecap="round"/>
  `,
  think: `
  ${gills()}
  ${head()}
  ${body()}
  ${tail()}
  <ellipse cx="40" cy="80" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2"/>
  <ellipse cx="88" cy="80" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2"/>
  <path d="M72 48 L78 38" stroke="${STROKE}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="82" cy="32" r="10" fill="rgba(255,255,255,0.9)" stroke="${STROKE}" stroke-width="1.5"/>
  <text x="82" y="36" text-anchor="middle" fill="${DARK}" font-size="10" font-family="system-ui">···</text>
  <path d="M58 58 Q64 62 68 56" stroke="${STROKE}" fill="none" stroke-width="2" stroke-linecap="round"/>
  `,
  flex: `
  ${gills()}
  <ellipse cx="64" cy="50" rx="28" ry="22" fill="${BROWN}" stroke="${STROKE}" stroke-width="2.5"/>
  <ellipse cx="64" cy="54" rx="16" ry="12" fill="${CREAM}" stroke="none"/>
  <path d="M52 46 Q56 42 60 46" stroke="${STROKE}" fill="none" stroke-width="2"/>
  <path d="M68 46 Q72 42 76 46" stroke="${STROKE}" fill="none" stroke-width="2"/>
  <path d="M58 56 Q64 62 70 56" stroke="${STROKE}" fill="none" stroke-width="2" stroke-linecap="round"/>
  ${body(76)}
  ${tail()}
  <ellipse cx="32" cy="58" rx="10" ry="8" fill="${BROWN}" stroke="${STROKE}" stroke-width="2" transform="rotate(-40 32 58)"/>
  <ellipse cx="96" cy="58" rx="10" ry="8" fill="${BROWN}" stroke="${STROKE}" stroke-width="2" transform="rotate(40 96 58)"/>
  <path d="M24 40 L30 34 M100 40 L94 34" stroke="#d4f53c" stroke-width="2" stroke-linecap="round"/>
  `,
  eat: `
  ${gills()}
  ${head()}
  ${body()}
  ${tail()}
  <ellipse cx="40" cy="80" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2"/>
  <ellipse cx="88" cy="80" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2"/>
  <ellipse cx="64" cy="92" rx="16" ry="10" fill="#fff" stroke="${STROKE}" stroke-width="2" opacity="0.95"/>
  <path d="M58 58 Q64 68 70 58" stroke="${STROKE}" fill="none" stroke-width="2" stroke-linecap="round"/>
  <circle cx="72" cy="60" r="2" fill="#6ec8ff"/>
  `,
  sleep: `
  ${gills()}
  <ellipse cx="64" cy="56" rx="28" ry="24" fill="${BROWN}" stroke="${STROKE}" stroke-width="2.5"/>
  <ellipse cx="64" cy="60" rx="18" ry="14" fill="${CREAM}" stroke="none"/>
  <path d="M52 52 Q56 48 60 52" stroke="${STROKE}" fill="none" stroke-width="2"/>
  <path d="M68 52 Q72 48 76 52" stroke="${STROKE}" fill="none" stroke-width="2"/>
  <path d="M58 62 Q64 66 70 62" stroke="${STROKE}" fill="none" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="64" cy="82" rx="36" ry="22" fill="${BROWN}" stroke="${STROKE}" stroke-width="2.5" transform="rotate(-8 64 82)"/>
  <ellipse cx="64" cy="86" rx="18" ry="12" fill="${CREAM}" stroke="none"/>
  <ellipse cx="42" cy="78" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2"/>
  <ellipse cx="86" cy="78" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2"/>
  <text x="88" y="38" fill="${DARK}" font-size="12" font-family="system-ui">z</text>
  <text x="96" y="30" fill="${DARK}" font-size="10" font-family="system-ui">z</text>
  `,
  shop: `
  ${gills()}
  ${head()}
  ${body()}
  <ellipse cx="98" cy="76" rx="12" ry="8" fill="${BROWN}" stroke="${STROKE}" stroke-width="2" transform="rotate(-10 98 76)"/>
  <ellipse cx="38" cy="80" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2"/>
  <ellipse cx="88" cy="72" rx="9" ry="7" fill="${BROWN}" stroke="${STROKE}" stroke-width="2" transform="rotate(15 88 72)"/>
  <path d="M58 58 Q64 64 70 58" stroke="${STROKE}" fill="none" stroke-width="2" stroke-linecap="round"/>
  <rect x="48" y="88" width="32" height="22" rx="6" fill="#c4e86c" stroke="${STROKE}" stroke-width="2"/>
  <path d="M52 88 L56 78 L72 78 L76 88" fill="none" stroke="${STROKE}" stroke-width="2"/>
  <circle cx="58" cy="98" r="4" fill="#6b8c3a" stroke="${STROKE}" stroke-width="1"/>
  <path d="M70 96 L74 100 L78 94" fill="#c45a3a" stroke="${STROKE}" stroke-width="1"/>
  `,
};

/**
 * @param {"wave"|"think"|"flex"|"eat"|"sleep"|"shop"} pose
 */
export function mascotSvg(pose) {
  const inner = poses[pose] || poses.wave;
  return `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

/**
 * Inline SVG placeholder (always works offline). Swap this for `<img src="…">`
 * when you export PNGs from PROMPTS.md into `assets/otto/`.
 * @param {"wave"|"think"|"flex"|"eat"|"sleep"|"shop"} pose
 * @param {{ hero?: boolean }} [opts]
 */
export function mascotBlock(pose, opts = {}) {
  const cls = ["mascot-wrap", opts.hero ? "mascot-hero" : ""].filter(Boolean).join(" ");
  return `<div class="${cls}">${mascotSvg(pose)}</div>`;
}
