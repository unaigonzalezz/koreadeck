import { describe, it, expect } from "vitest";
import { normalizeBaseUrl, buildKoreaderUrl } from "./koreader-url";

describe("normalizeBaseUrl", () => {
  it("returns null for undefined ip", () => {
    expect(normalizeBaseUrl(undefined)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(normalizeBaseUrl("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(normalizeBaseUrl("   ")).toBeNull();
  });

  it("builds http URL from plain IP using default port", () => {
    expect(normalizeBaseUrl("192.168.1.1")).toBe("http://192.168.1.1:8080");
  });

  it("uses the provided port", () => {
    expect(normalizeBaseUrl("192.168.1.1", 9090)).toBe("http://192.168.1.1:9090");
  });

  it("strips existing port from plain IP and applies provided port", () => {
    expect(normalizeBaseUrl("192.168.1.1:1234", 5000)).toBe("http://192.168.1.1:5000");
  });

  it("handles full http URL, replacing port", () => {
    expect(normalizeBaseUrl("http://192.168.1.1:1234", 5000)).toBe("http://192.168.1.1:5000");
  });

  it("returns null for malformed full URL", () => {
    expect(normalizeBaseUrl("http://")).toBeNull();
  });

  it("trims whitespace from ip", () => {
    expect(normalizeBaseUrl("  192.168.1.1  ")).toBe("http://192.168.1.1:8080");
  });
});

describe("buildKoreaderUrl", () => {
  it("returns null when ip is undefined", () => {
    expect(buildKoreaderUrl(undefined, "/koreader/test/")).toBeNull();
  });

  it("returns null when ip is empty", () => {
    expect(buildKoreaderUrl("", "/koreader/test/")).toBeNull();
  });

  it("builds correct URL with leading-slash path", () => {
    expect(buildKoreaderUrl("192.168.1.1", "/koreader/test/")).toBe(
      "http://192.168.1.1:8080/koreader/test/",
    );
  });

  it("builds correct URL with no-leading-slash path", () => {
    expect(buildKoreaderUrl("192.168.1.1", "koreader/test/")).toBe(
      "http://192.168.1.1:8080/koreader/test/",
    );
  });

  it("applies custom port", () => {
    expect(buildKoreaderUrl("192.168.1.1", "/api/", 9999)).toBe(
      "http://192.168.1.1:9999/api/",
    );
  });
});
