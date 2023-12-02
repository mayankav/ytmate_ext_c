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
}

const Button = ({
  variant = "primary",
  fullWidth = false,
  children,
  iconRight,
  className,
  ...args
}: ButtonProps) => {
  const buttonClass = `button ${variant} ${
    fullWidth ? "full-width" : ""
  } ${className}`;

  return (
    <button className={buttonClass} {...args}>
      {children}
      {iconRight}
    </button>
  );
};

export default Button;
