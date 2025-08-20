interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Button({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
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
