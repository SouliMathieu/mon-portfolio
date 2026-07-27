import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

type ButtonAsButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
    href: string;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export default function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "" } = props;

  const base = "btn-pill inline-flex items-center gap-2 cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-ndvi text-navy hover:shadow-[0_0_24px_rgba(77,255,160,0.4)]"
      : "bg-transparent text-offwhite border border-offwhite/20 hover:bg-offwhite/5";

  if (props.href) {
    const {
      href,
      children: _children,
      variant: _variant,
      className: _className,
      ...anchorProps
    } = props;

    return (
      <Link
        href={href}
        className={`${base} ${styles} ${className}`}
        {...anchorProps}
      >
        {children}
      </Link>
    );
  }

  const {
    children: _children2,
    variant: _variant2,
    className: _className2,
    href: _href,
    ...buttonProps
  } = props as ButtonAsButtonProps;

  return (
    <button className={`${base} ${styles} ${className}`} {...buttonProps}>
      {children}
    </button>
  );
}