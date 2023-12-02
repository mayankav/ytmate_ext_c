import React, { useEffect, useState } from "react";
import "./index.scss"; // Import the SCSS file

interface SwitchProps {
  label: string;
  onToggle: (val: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ label, onToggle }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  useEffect(() => {
    onToggle(isChecked);
  }, [isChecked]);

  return (
    <div
      className={`switch-container ${isChecked ? "switch-on" : "switch-off"}`}
      onClick={handleToggle}
    >
      <div className="switch-background">
        <div className="switch-handle"></div>
      </div>
      <span className="label">{label}</span>
    </div>
  );
};

export default Switch;
