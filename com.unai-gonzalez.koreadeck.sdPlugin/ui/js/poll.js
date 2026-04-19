let lastToken = -1;

const pollToken = async () => {
  try {
    const res  = await fetch("/screen/state", { cache: "no-store" });
    if (!res.ok) { setStatus("Unable to fetch screen state", "error"); return; }
    const data = await res.json();
    if (typeof data.token === "number" && data.token !== lastToken) {
      lastToken = data.token;
      refreshImage();
    }
  } catch {
    setStatus("No connection with the plugin", "error");
  }
};
