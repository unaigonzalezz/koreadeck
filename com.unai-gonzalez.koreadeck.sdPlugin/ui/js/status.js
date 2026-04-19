const statusEl  = document.getElementById("status");
const statusDot = document.getElementById("statusDot");

const setStatus = (text, type = "idle") => {
  statusEl.textContent = text;
  statusDot.className = "w-2 h-2 rounded-full flex-shrink-0 mt-0.5 " + (
    type === "ok"    ? "bg-teal-500"  :
    type === "error" ? "bg-red-500"   :
    type === "busy"  ? "bg-amber-400" :
                       "bg-slate-300"
  );
  statusEl.className = "text-xs leading-snug " + (
    type === "error" ? "text-red-500" : "text-slate-400"
  );
};
