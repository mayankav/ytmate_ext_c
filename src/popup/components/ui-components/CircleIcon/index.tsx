import React from "react";
import "./index.scss";

const DEFAULT_GRADIENT = "linear-gradient(180deg, #fffbfb 0%, #ffcaca 100%)";

interface CircleIconProps {
  icon: React.ReactNode;
  colorGradient?: string;
}

const CircleIcon = ({
  icon,
  colorGradient = DEFAULT_GRADIENT,
}: CircleIconProps) => {
  return (
    <div
      className="circle-container"
      style={{
        background: colorGradient,
      }}
    >
      {icon}
    </div>
  );
};

export default CircleIcon;
