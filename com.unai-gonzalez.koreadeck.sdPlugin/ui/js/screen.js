const img = document.getElementById("screen");

const refreshImage = () => {
  img.src = `/screen/image?ts=${Date.now()}`;
  setStatus("Refreshing…", "busy");
};

img.addEventListener("load", () => {
  setStatus(`Last update: ${new Date().toLocaleTimeString()}`, "ok");
  refreshInfo();
});
img.addEventListener("error", () => setStatus("Failed to load screen image", "error"));
