const themeToggle = document.getElementById("themeToggle");
const iconMoon    = document.getElementById("iconMoon");
const iconSun     = document.getElementById("iconSun");
const themeLabel  = document.getElementById("themeLabel");

const STORAGE_KEY = "koreadeck-dark";

const applyTheme = (dark) => {
  document.documentElement.classList.toggle("dark", dark);

  img.style.filter = dark
    ? "invert(1) drop-shadow(0 20px 40px rgba(0,0,0,0.8))"
    : "drop-shadow(0 20px 40px rgba(0,0,0,0.5))";

  iconMoon.classList.toggle("hidden", dark);
  iconSun.classList.toggle("hidden", !dark);
  themeLabel.textContent = dark ? "Day mode" : "Night mode";
};

const savedDark = localStorage.getItem(STORAGE_KEY) === "true";
applyTheme(savedDark);

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem(STORAGE_KEY, String(!isDark));
  applyTheme(!isDark);
});
