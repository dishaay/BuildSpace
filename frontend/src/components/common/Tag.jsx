export default function Tag({ children, active = false, onClick, size = "sm" }) {
  const padding = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center font-mono ${padding} rounded-md border transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${
        active
          ? "bg-accent-violet/15 border-accent-violet/40 text-accent-violet"
          : "bg-bg-hover border-border text-ink-muted hover:text-ink hover:border-ink-faint"
      }`}
    >
      {children}
    </span>
  );
}
