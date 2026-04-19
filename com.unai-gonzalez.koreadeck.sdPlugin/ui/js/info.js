const bookTitle  = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookPage   = document.getElementById("bookPage");
const bookTotal  = document.getElementById("bookTotal");

const refreshInfo = async () => {
  try {
    const res  = await fetch("/screen/info", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    if (!data.connected) {
      bookTitle.textContent  = "No book open";
      bookAuthor.textContent = "—";
      bookPage.textContent   = "—";
      bookTotal.textContent  = "";
      return;
    }
    bookTitle.textContent  = data.title   ?? "Unknown title";
    bookAuthor.textContent = data.authors ?? "Unknown author";

    if (data.page != null && data.total != null) {
      bookPage.textContent  = `${data.page}`;
      const pct = Math.round((data.page / data.total) * 100);
      bookTotal.textContent = `of ${data.total} · ${pct}%`;
    } else if (data.page != null) {
      bookPage.textContent  = `${data.page}`;
      bookTotal.textContent = "";
    } else {
      bookPage.textContent  = "—";
      bookTotal.textContent = "";
    }
  } catch (err) { 
    console.log(err)
  }
};
