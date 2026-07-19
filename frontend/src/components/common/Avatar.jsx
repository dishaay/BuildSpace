export default function Avatar({
  user,
  size = "md",
  showOnline = false,
}) {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl",
  };

  const hasAvatar =
    user?.avatar &&
    user.avatar !== "null" &&
    user.avatar.trim() !== "";

  return (
    <div className="relative shrink-0">
      <div
        className={`
          ${sizes[size]}
          ${user?.avatarColor || "bg-accent-violet"}
          rounded-xl
          flex
          items-center
          justify-center
          font-display
          font-semibold
          text-white
          overflow-hidden
        `}
      >
        {hasAvatar ? (
          <img
            src={user.avatar}
            alt={user?.name || "Avatar"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          (
            user?.name?.charAt(0) ||
            user?.username?.charAt(0) ||
            "?"
          ).toUpperCase()
        )}
      </div>

      {showOnline && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-bg-surface ${
            user?.online
              ? "bg-accent-teal"
              : "bg-ink-faint"
          }`}
        />
      )}
    </div>
  );
}