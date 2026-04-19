export type BookDisplayProps = {
  title?: string;
  authors?: string;
  series?: string;
  series_index?: number;
};

export type OverlayConfig = { lines: string[]; fontSize: number };

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function wrapText(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
        if (lines.length >= maxLines) break;
      }
      current = word.length > maxCharsPerLine ? word.substring(0, maxCharsPerLine - 1) + "…" : word;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

export function resolveOverlay(
  mode: string | undefined,
  props: BookDisplayProps,
  currentPage: number,
  totalPages: number,
): OverlayConfig {
  switch (mode ?? "page") {
    case "page": {
      if (currentPage <= 0) return { lines: [], fontSize: 16 };
      const label = totalPages > 0 ? `Pg. ${currentPage} / ${totalPages}` : `Pg. ${currentPage}`;
      return { lines: [label], fontSize: 16 };
    }
    case "title":
      return { lines: props.title ? wrapText(props.title, 16, 3) : [], fontSize: 18 };
    case "author":
      return { lines: props.authors ? wrapText(props.authors, 18, 2) : [], fontSize: 15 };
    case "series": {
      if (!props.series) return { lines: [], fontSize: 15 };
      const label =
        props.series_index != null ? `${props.series} #${props.series_index}` : props.series;
      return { lines: wrapText(label, 18, 2), fontSize: 15 };
    }
    case "none":
    default:
      return { lines: [], fontSize: 15 };
  }
}

export function buildBookImage(
  coverDataUrl: string | null,
  lines: string[],
  fontSize: number = 15,
): string {
  const imageTag = coverDataUrl
    ? `<image href="${coverDataUrl}" x="0" y="0" width="144" height="144" preserveAspectRatio="xMidYMid slice"/>`
    : `<rect width="144" height="144" fill="#1a1a2e"/>
  <text x="72" y="82" text-anchor="middle" fill="#4a9eff" font-size="56" font-family="serif">&#128218;</text>`;

  const LINE_HEIGHT = Math.round(fontSize * 1.35);
  const PADDING = 10;
  const overlayHeight = lines.length > 0 ? lines.length * LINE_HEIGHT + PADDING : 0;
  const overlayY = 144 - overlayHeight;

  const textTags = lines
    .map((line, i) => {
      const y = overlayY + PADDING / 2 + LINE_HEIGHT * (i + 0.85);
      return `<text x="72" y="${y.toFixed(1)}" text-anchor="middle" fill="white" font-size="${fontSize}" font-family="Arial,Helvetica,sans-serif" font-weight="bold">${escapeXml(line)}</text>`;
    })
    .join("\n  ");

  const overlayTags =
    lines.length > 0
      ? `<rect x="0" y="${overlayY}" width="144" height="${overlayHeight}" fill="black" fill-opacity="0.68"/>
  ${textTags}`
      : "";

  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 144 144">
  ${imageTag}
  ${overlayTags}
</svg>`,
  ).toString("base64")}`;
}
