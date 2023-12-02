import React from "react";
import "./index.scss";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button = ({
  variant = "primary",
  fullWidth = false,
  children,
  className,
  ...args
}: ButtonProps) => {
  const buttonClass = `button ${variant} ${
    fullWidth ? "full-width" : ""
  } ${className}`;

  return (
    <button className={buttonClass} {...args}>
      {children}
    </button>
  );
};

export default Button;
