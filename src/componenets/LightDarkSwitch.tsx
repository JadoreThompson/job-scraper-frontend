import React from "react";

const LightDarkSwitch: React.FC = () => {
  const changeTheme: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentTheme = document.body.getAttribute("data-theme");

    if (currentTheme === "dark") {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <label className="switch">
      <input type="checkbox" onChange={changeTheme} />
      <span className="slider"></span>
    </label>
  );
};

export default LightDarkSwitch;
