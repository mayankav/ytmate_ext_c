import React from "react";
import "./index.scss";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Button = ({
  variant = "primary",
  fullWidth = false,
  children,
  iconRight,
  className,
  disabled,
  ...args
}: ButtonProps) => {
  const buttonClass = `button ${variant} ${
    fullWidth ? "full-width" : ""
  } ${className} ${disabled ? "disabled" : ""}`;

  return (
    <button className={buttonClass} {...args}>
      {children}
      {iconRight}
    </button>
  );
};

export default Button;
