import { describe, it, expect } from "vitest";
import { toNumber } from "./action-utils";

describe("toNumber", () => {
  it("returns the number when given a finite number", () => {
    expect(toNumber(42, 0)).toBe(42);
    expect(toNumber(0, 99)).toBe(0);
    expect(toNumber(-5, 0)).toBe(-5);
  });

  it("parses a valid numeric string", () => {
    expect(toNumber("100", 0)).toBe(100);
    expect(toNumber("3.14", 0)).toBe(3.14);
  });

  it("returns fallback for non-numeric strings", () => {
    expect(toNumber("abc", 5)).toBe(5);
  });

  it("treats empty string as 0 (Number('') === 0, which is finite)", () => {
    expect(toNumber("", 5)).toBe(0);
  });

  it("returns fallback for undefined", () => {
    expect(toNumber(undefined, 99)).toBe(99);
  });

  it("returns fallback for NaN and Infinity", () => {
    expect(toNumber(NaN, 7)).toBe(7);
    expect(toNumber(Infinity, 7)).toBe(7);
    expect(toNumber(-Infinity, 7)).toBe(7);
  });
});
