import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchBookCoverUrl, fetchImageAsBase64 } from "./google-books-client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const successResponse = (thumbnail: string) => ({
  ok: true,
  json: async () => ({ items: [{ volumeInfo: { imageLinks: { thumbnail } } }] }),
});

const emptyResponse = () => ({
  ok: true,
  json: async () => ({}),
});

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchBookCoverUrl", () => {
  it("returns the thumbnail URL (https, zoom=2) when strategy 1 succeeds", async () => {
    mockFetch.mockResolvedValue(successResponse("http://books.google.com/cover.jpg?zoom=1"));

    const url = await fetchBookCoverUrl("Dune", "Frank Herbert", 3000);
    expect(url).toBe("https://books.google.com/cover.jpg?zoom=2");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("falls back to strategy 2 (intitle only) when strategy 1 finds nothing", async () => {
    mockFetch
      .mockResolvedValueOnce(emptyResponse())
      .mockResolvedValueOnce(successResponse("https://example.com/cover.jpg"));

    const url = await fetchBookCoverUrl("Dune", "Frank Herbert", 3000);
    expect(url).toBe("https://example.com/cover.jpg");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("falls back to strategy 3 (plain search) when both 1 and 2 find nothing", async () => {
    mockFetch
      .mockResolvedValueOnce(emptyResponse())
      .mockResolvedValueOnce(emptyResponse())
      .mockResolvedValueOnce(successResponse("https://example.com/cover.jpg"));

    const url = await fetchBookCoverUrl("Dune", "Frank Herbert", 3000);
    expect(url).toBe("https://example.com/cover.jpg");
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("skips strategy 1 when authors is empty", async () => {
    mockFetch
      .mockResolvedValueOnce(emptyResponse())
      .mockResolvedValueOnce(successResponse("https://example.com/cover.jpg"));

    await fetchBookCoverUrl("Dune", "", 3000);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe("fetchImageAsBase64", () => {
  it("returns a base64 data URL with the correct content-type", async () => {
    const fakeBytes = new Uint8Array([102, 97, 107, 101]).buffer;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => fakeBytes,
      headers: { get: (h: string) => (h === "content-type" ? "image/jpeg" : null) },
    });

    const result = await fetchImageAsBase64("https://example.com/cover.jpg", 3000);
    expect(result).toBe(`data:image/jpeg;base64,${Buffer.from(fakeBytes).toString("base64")}`);
  });

  it("forces https on http URLs", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(0),
      headers: { get: () => "image/jpeg" },
    });

    await fetchImageAsBase64("http://example.com/cover.jpg", 3000);
    expect(mockFetch).toHaveBeenCalledWith("https://example.com/cover.jpg", expect.any(Object));
  });

  it("returns null when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    expect(await fetchImageAsBase64("https://example.com/cover.jpg", 3000)).toBeNull();
  });

  it("returns null on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    expect(await fetchImageAsBase64("https://example.com/cover.jpg", 3000)).toBeNull();
  });
});
