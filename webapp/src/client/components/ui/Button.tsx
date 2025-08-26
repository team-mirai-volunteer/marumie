interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export default function Button({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      className={`
        inline-flex
        items-center
        justify-center
        transition-opacity
        hover:cursor-pointer
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {children}
    </button>
  );
}
