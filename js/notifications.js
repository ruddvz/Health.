/**
 * Optional reminders — FEATURE_PLAN §7 (client-side Notification API).
 * Times come from healthStore.settings.reminderTimes (HH:mm).
 */
import { t } from "./i18n.js";
import { todayKey } from "./foodLog.js";
import { getHealthState, defaultReminderTimes } from "./healthStore.js";

export const REMINDER_TIME_TAGS = ["breakfast", "snack", "lunch", "pre", "dinner", "bedtime", "water"];

const MEAL_REMINDERS = [
  { tag: "breakfast", title: "Breakfast time", body: "Morning fuel — don't skip it.", hour: 7, min: 0 },
  { tag: "snack", title: "Snack", body: "Hit your protein between meals.", hour: 10, min: 30 },
  { tag: "lunch", title: "Lunch", body: "Eat what you packed — consistency wins.", hour: 13, min: 0 },
  { tag: "pre", title: "Pre-workout", body: "Fuel up before you train.", hour: 16, min: 0 },
  { tag: "dinner", title: "Dinner", body: "Finish strong — protein stays high.", hour: 19, min: 30 },
  { tag: "bedtime", title: "Wind down", body: "Magnesium / ash timing if that's your stack.", hour: 22, min: 15 },
];

function parseTimeHHMM(str, fallbackHour, fallbackMin) {
  if (!str || typeof str !== "string" || !/^\d{1,2}:\d{2}$/.test(str.trim())) {
    return { hour: fallbackHour, min: fallbackMin };
  }
  const [hs, ms] = str.trim().split(":");
  const h = parseInt(hs, 10);
  const m = parseInt(ms, 10);
  if (!Number.isFinite(h) || !Number.isFinite(m) || m < 0 || m > 59 || h < 0 || h > 23) {
    return { hour: fallbackHour, min: fallbackMin };
  }
  return { hour: h, min: m };
}

function mergedReminderTimes() {
  return { ...defaultReminderTimes(), ...(getHealthState().settings?.reminderTimes || {}) };
}

export async function requestPushPermission() {
  if (!("Notification" in window)) return false;
  const perm = await Notification.requestPermission();
  return perm === "granted";
}

export function scheduleLocalReminders() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const icon = "./assets/icons/icon-192.png";
  const now = Date.now();
  const times = mergedReminderTimes();

  MEAL_REMINDERS.forEach((r) => {
    const { hour, min } = parseTimeHHMM(times[r.tag], r.hour, r.min);
    const target = new Date();
    target.setHours(hour, min, 0, 0);
    const delay = target.getTime() - now;
    if (delay <= 0 || delay > 24 * 3600000) return;
    setTimeout(() => {
      if (Notification.permission !== "granted") return;
      try {
        new Notification(r.title, { body: r.body, icon, tag: r.tag });
      } catch (_) {
        /* ignore */
      }
    }, delay);
  });

  const waterHM = parseTimeHHMM(times.water, 20, 0);
  const waterTarget = new Date();
  waterTarget.setHours(waterHM.hour, waterHM.min, 0, 0);
  const waterDelay = waterTarget.getTime() - now;
  if (waterDelay > 0 && waterDelay <= 24 * 3600000) {
    setTimeout(() => {
      if (Notification.permission !== "granted") return;
      const key = "np_water_" + todayKey();
      const glasses = parseInt(localStorage.getItem(key) || "0", 10);
      const glassGoal = getHealthState().settings?.waterGoal ?? 8;
      if (glasses >= glassGoal) return;
      try {
        new Notification(t("notify.water_title"), {
          body: t("notify.water_body", { n: glasses, g: glassGoal }),
          icon,
          tag: "water-pm",
        });
      } catch (_) {
        /* ignore */
      }
    }, waterDelay);
  }
}

export function maybeAskNotifications() {
  if (!("Notification" in window)) return;
  const asked = localStorage.getItem("np_push_asked");
  if (asked !== "1") {
    setTimeout(async () => {
      const granted = await requestPushPermission();
      if (granted) scheduleLocalReminders();
      localStorage.setItem("np_push_asked", "1");
    }, 3500);
    return;
  }
  if (Notification.permission === "granted") scheduleLocalReminders();
}
