export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent-violet text-white hover:bg-accent-violet-dim shadow-[0_0_0_1px_rgba(124,111,255,0.5)] hover:shadow-glow",
    secondary:
      "bg-bg-hover text-ink border border-border hover:border-ink-faint hover:bg-bg-raised",
    ghost: "text-ink-muted hover:text-ink hover:bg-bg-hover",
    danger: "bg-accent-coral/15 text-accent-coral border border-accent-coral/30 hover:bg-accent-coral/25",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}
