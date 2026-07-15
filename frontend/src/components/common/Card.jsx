export default function Card({
  children,
  padding = "md",
  hoverable = false,
  as: Element = "div",
  className = "",
  ...props
}) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6 sm:p-7",
  };

  return (
    <Element
      className={`bg-bg-surface border border-border rounded-xl ${paddings[padding]} ${
        hoverable ? "hover:border-ink-faint/40 transition-colors" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Element>
  );
}