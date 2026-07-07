import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base = "btn-pill inline-flex items-center gap-2 cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-ndvi text-navy hover:shadow-[0_0_24px_rgba(77,255,160,0.4)]"
      : "bg-transparent text-offwhite border border-offwhite/20 hover:bg-offwhite/5";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}