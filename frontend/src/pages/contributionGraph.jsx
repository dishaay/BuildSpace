import { generateContributionGrid } from "../../data/dummyData";

const levelColors = [
  "bg-bg-hover",
  "bg-accent-teal/25",
  "bg-accent-teal/50",
  "bg-accent-teal/75",
  "bg-accent-teal",
];

// Buckets a raw contribution count into a 0-4 intensity level, roughly
// matching GitHub's own thresholds. Adjust these if you want a different
// "feel" for what counts as a busy day.
function countToLevel(count) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Props:
 * - weeks?: real GitHub contribution weeks, as returned by the backend's
 *   GET /users/github/:username/contributions (an array of
 *   { contributionDays: [{ date, contributionCount }] }). When provided,
 *   this renders the user's *real* contribution history.
 * - seed?: used only when `weeks` isn't provided — generates a fake
 *   placeholder grid (the original behavior, still used anywhere a real
 *   username isn't available).
 * - size?, className?: unchanged from before.
 */
export default function ContributionGraph({ weeks, seed = 1, size = "sm", className = "" }) {
  const grid = weeks
    ? weeks.map((week) => week.contributionDays.map((day) => countToLevel(day.contributionCount)))
    : generateContributionGrid(seed);

  const cell = size === "lg" ? "w-3 h-3" : "w-[9px] h-[9px]";
  const gap = size === "lg" ? "gap-1" : "gap-[3px]";

  return (
    <div className={`flex ${gap} overflow-hidden ${className}`} aria-hidden="true">
      {grid.map((col, wi) => (
        <div key={wi} className={`flex flex-col ${gap}`}>
          {col.map((level, di) => (
            <div
              key={di}
              className={`${cell} rounded-[2px] ${levelColors[level]}`}
              style={{ animationDelay: `${(wi * 7 + di) * 4}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}