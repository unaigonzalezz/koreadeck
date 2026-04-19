type GoogleBooksResponse = {
  items?: {
    volumeInfo?: {
      imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    };
  }[];
};

async function queryGoogleBooks(q: string, timeoutMs: number): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=3`,
      { signal: ctrl.signal },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as GoogleBooksResponse;
    for (const item of data.items ?? []) {
      const links = item.volumeInfo?.imageLinks;
      const thumbnail = links?.thumbnail ?? links?.smallThumbnail;
      if (thumbnail) {
        return thumbnail.replace("http://", "https://").replace("zoom=1", "zoom=2");
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchBookCoverUrl(
  title: string,
  authors: string,
  timeoutMs: number,
): Promise<string | null> {
  let url = authors
    ? await queryGoogleBooks(`intitle:${title} inauthor:${authors}`, timeoutMs)
    : null;

  if (!url) {
    url = await queryGoogleBooks(`intitle:${title}`, timeoutMs);
  }

  if (!url) {
    url = await queryGoogleBooks(authors ? `${title} ${authors}` : title, timeoutMs);
  }

  return url;
}

export async function fetchImageAsBase64(url: string, timeoutMs: number): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url.replace("http://", "https://"), { signal: ctrl.signal });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const ct = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${ct};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
