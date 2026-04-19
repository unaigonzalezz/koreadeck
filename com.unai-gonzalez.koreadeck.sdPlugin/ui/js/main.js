const refreshBtn = document.getElementById("refresh");

refreshBtn.addEventListener("click", () => { refreshImage(); refreshInfo(); });

refreshImage();
refreshInfo();
setInterval(pollToken, 1000);
