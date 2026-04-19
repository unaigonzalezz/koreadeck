import { describe, it, expect } from "vitest";
import { escapeXml, wrapText, resolveOverlay, buildBookImage } from "./book-svg";

describe("escapeXml", () => {
  it("escapes all five XML special characters", () => {
    expect(escapeXml('a & b < c > d " e \' f')).toBe(
      "a &amp; b &lt; c &gt; d &quot; e &apos; f",
    );
  });

  it("returns plain text unchanged", () => {
    expect(escapeXml("Hello World")).toBe("Hello World");
  });

  it("handles empty string", () => {
    expect(escapeXml("")).toBe("");
  });
});

describe("wrapText", () => {
  it("returns a single line when text fits", () => {
    expect(wrapText("Hello", 10, 3)).toEqual(["Hello"]);
  });

  it("wraps onto a second line when text exceeds maxCharsPerLine", () => {
    const result = wrapText("Hello World", 6, 3);
    expect(result).toEqual(["Hello", "World"]);
  });

  it("respects maxLines limit", () => {
    const result = wrapText("one two three four", 5, 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("truncates a single word that exceeds the line width", () => {
    const result = wrapText("Superlongwordthatdoesnotfit", 10, 2);
    expect(result[0].endsWith("…")).toBe(true);
    expect(result[0].length).toBeLessThanOrEqual(10);
  });

  it("returns empty array for empty string", () => {
    expect(wrapText("", 10, 3)).toEqual([]);
  });
});

describe("resolveOverlay", () => {
  const props = {
    title: "Dune",
    authors: "Frank Herbert",
    series: "Dune Chronicles",
    series_index: 1,
  };

  it("defaults to page mode", () => {
    const result = resolveOverlay(undefined, props, 42, 412);
    expect(result.lines).toEqual(["Pg. 42 / 412"]);
    expect(result.fontSize).toBe(16);
  });

  it("page mode: shows page without total when totalPages is 0", () => {
    const result = resolveOverlay("page", props, 10, 0);
    expect(result.lines).toEqual(["Pg. 10"]);
  });

  it("page mode: returns empty lines when currentPage is 0", () => {
    const result = resolveOverlay("page", props, 0, 100);
    expect(result.lines).toEqual([]);
  });

  it("title mode: wraps title into lines", () => {
    const result = resolveOverlay("title", props, 0, 0);
    expect(result.lines.join(" ")).toContain("Dune");
    expect(result.fontSize).toBe(18);
  });

  it("title mode: returns empty lines when title is missing", () => {
    expect(resolveOverlay("title", {}, 0, 0).lines).toEqual([]);
  });

  it("author mode: includes author name", () => {
    const result = resolveOverlay("author", props, 0, 0);
    expect(result.lines.join(" ")).toContain("Frank Herbert");
    expect(result.fontSize).toBe(15);
  });

  it("series mode: formats series with index", () => {
    const result = resolveOverlay("series", props, 0, 0);
    expect(result.lines.join(" ")).toContain("Dune Chronicles #1");
  });

  it("series mode: formats series without index", () => {
    const result = resolveOverlay("series", { series: "Dune Chronicles" }, 0, 0);
    expect(result.lines.join(" ")).toContain("Dune Chronicles");
  });

  it("series mode: returns empty when series is missing", () => {
    expect(resolveOverlay("series", {}, 0, 0).lines).toEqual([]);
  });

  it("none mode: returns empty lines", () => {
    expect(resolveOverlay("none", props, 42, 412).lines).toEqual([]);
  });

  it("unknown mode: returns empty lines", () => {
    expect(resolveOverlay("unknown-value", props, 42, 412).lines).toEqual([]);
  });
});

describe("buildBookImage", () => {
  it("returns a base64 data URL", () => {
    const result = buildBookImage(null, []);
    expect(result.startsWith("data:image/svg+xml;base64,")).toBe(true);
  });

  it("produces valid base64 that decodes to an SVG", () => {
    const result = buildBookImage(null, ["Pg. 1 / 100"]);
    const base64 = result.replace("data:image/svg+xml;base64,", "");
    const svg = Buffer.from(base64, "base64").toString("utf-8");
    expect(svg).toContain("<svg");
    expect(svg).toContain("Pg. 1 / 100");
  });

  it("includes a fallback book emoji when no cover is provided", () => {
    const result = buildBookImage(null, []);
    const svg = Buffer.from(result.split(",")[1], "base64").toString("utf-8");
    expect(svg).toContain("&#128218;");
  });

  it("includes the cover image tag when a data URL is provided", () => {
    const fakeCover = "data:image/jpeg;base64,/9j/fake";
    const result = buildBookImage(fakeCover, []);
    const svg = Buffer.from(result.split(",")[1], "base64").toString("utf-8");
    expect(svg).toContain(`href="${fakeCover}"`);
  });

  it("XML-escapes special characters in overlay text", () => {
    const result = buildBookImage(null, ["Tom & Jerry"]);
    const svg = Buffer.from(result.split(",")[1], "base64").toString("utf-8");
    expect(svg).toContain("Tom &amp; Jerry");
    expect(svg).not.toContain("Tom & Jerry");
  });
});
