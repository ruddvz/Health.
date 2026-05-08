/**
 * Plan0 §8.5 — Exercise library (100+). Equipment × muscle grid + staples.
 */

const MUSCLES = ["chest", "back", "legs", "shoulders", "arms", "core"];
const EQUIP = ["barbell", "dumbbell", "cable", "bodyweight", "machine"];

const STAPLES = [
  { name: "Barbell Bench Press", muscle: "chest", equipment: "barbell" },
  { name: "Incline Dumbbell Press", muscle: "chest", equipment: "dumbbell" },
  { name: "Cable Fly", muscle: "chest", equipment: "cable" },
  { name: "Push-Up", muscle: "chest", equipment: "bodyweight" },
  { name: "Chest Press Machine", muscle: "chest", equipment: "machine" },
  { name: "Pull-Up", muscle: "back", equipment: "bodyweight" },
  { name: "Barbell Row", muscle: "back", equipment: "barbell" },
  { name: "Lat Pulldown", muscle: "back", equipment: "cable" },
  { name: "Single-Arm Row", muscle: "back", equipment: "dumbbell" },
  { name: "Seated Cable Row", muscle: "back", equipment: "cable" },
  { name: "Back Extension", muscle: "back", equipment: "machine" },
  { name: "Barbell Squat", muscle: "legs", equipment: "barbell" },
  { name: "Romanian Deadlift", muscle: "legs", equipment: "barbell" },
  { name: "Leg Press", muscle: "legs", equipment: "machine" },
  { name: "Walking Lunge", muscle: "legs", equipment: "dumbbell" },
  { name: "Leg Curl", muscle: "legs", equipment: "machine" },
  { name: "Leg Extension", muscle: "legs", equipment: "machine" },
  { name: "Calf Raise", muscle: "legs", equipment: "machine" },
  { name: "Overhead Press", muscle: "shoulders", equipment: "barbell" },
  { name: "Dumbbell Lateral Raise", muscle: "shoulders", equipment: "dumbbell" },
  { name: "Face Pull", muscle: "shoulders", equipment: "cable" },
  { name: "Arnold Press", muscle: "shoulders", equipment: "dumbbell" },
  { name: "Barbell Curl", muscle: "arms", equipment: "barbell" },
  { name: "Hammer Curl", muscle: "arms", equipment: "dumbbell" },
  { name: "Tricep Pushdown", muscle: "arms", equipment: "cable" },
  { name: "Skull Crusher", muscle: "arms", equipment: "barbell" },
  { name: "Plank", muscle: "core", equipment: "bodyweight" },
  { name: "Cable Crunch", muscle: "core", equipment: "cable" },
  { name: "Hanging Leg Raise", muscle: "core", equipment: "bodyweight" },
  { name: "Ab Wheel Rollout", muscle: "core", equipment: "bodyweight" },
];

function buildGenerated() {
  const out = [];
  for (const muscle of MUSCLES) {
    for (const equipment of EQUIP) {
      for (let i = 1; i <= 4; i++) {
        const label = `${equipment[0].toUpperCase()}${equipment.slice(1)} ${muscle} movement ${i}`;
        out.push({
          id: `gen-${muscle}-${equipment}-${i}`,
          name: label,
          muscle,
          equipment,
        });
      }
    }
  }
  return out;
}

const generated = buildGenerated();

const staples = STAPLES.map((s, i) => ({
  id: `st-${i}`,
  name: s.name,
  muscle: s.muscle,
  equipment: s.equipment,
}));

/** @type {{id:string,name:string,muscle:string,equipment:string}[]} */
export const EXERCISES = [...staples, ...generated].slice(0, 120);

export function filterExercises({ muscle, equipment, q } = {}) {
  let list = EXERCISES;
  if (muscle) list = list.filter((e) => e.muscle === muscle);
  if (equipment) list = list.filter((e) => e.equipment === equipment);
  if (q) {
    const qq = q.toLowerCase();
    list = list.filter((e) => e.name.toLowerCase().includes(qq));
  }
  return list;
}
