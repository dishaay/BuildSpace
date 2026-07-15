export default function Input({ label, hint, as = "input", icon: Icon, className = "", children, ...props }) {
  const Element = as;

  const base =
    "w-full bg-bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const withIcon = Icon ? "pl-9" : "";
  const resize = as === "textarea" ? "resize-none" : "";
  const cursor = as === "select" ? "appearance-none cursor-pointer" : "";

  return (
    <div className="w-full">
      {label && <label className="text-xs font-medium text-ink-muted mb-1.5 block">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />}
        <Element className={`${base} ${withIcon} ${resize} ${cursor} ${className}`} {...props}>
          {children}
        </Element>
      </div>
      {hint && <p className="text-xs text-ink-faint mt-1.5">{hint}</p>}
    </div>
  );
}