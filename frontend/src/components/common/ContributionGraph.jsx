import { generateContributionGrid } from "../../data/dummyData";

const levelColors = [
  "bg-bg-hover",
  "bg-accent-teal/25",
  "bg-accent-teal/50",
  "bg-accent-teal/75",
  "bg-accent-teal",
];

export default function ContributionGraph({ seed = 1, size = "sm", className = "" }) {
  const grid = generateContributionGrid(seed);
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
