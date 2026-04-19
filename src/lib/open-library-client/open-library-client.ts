type OpenLibrarySearchResponse = {
  docs?: { cover_i?: number }[];
};

async function searchCoverId(title: string, authors: string, timeoutMs: number): Promise<number | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const params = new URLSearchParams({ title, limit: "5", fields: "cover_i" });
    if (authors) params.set("author", authors);

    const res = await fetch(`https://openlibrary.org/search.json?${params}`, { signal: ctrl.signal });
    if (!res.ok) return null;

    const data = (await res.json()) as OpenLibrarySearchResponse;
    for (const doc of data.docs ?? []) {
      if (doc.cover_i) return doc.cover_i;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchOpenLibraryCoverUrl(
  title: string,
  authors: string,
  timeoutMs: number,
): Promise<string | null> {
  let coverId = authors ? await searchCoverId(title, authors, timeoutMs) : null;

  if (!coverId) {
    coverId = await searchCoverId(title, "", timeoutMs);
  }

  if (!coverId) return null;

  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}
