import { describe, expect, it } from "vitest";
import { parseNumber } from "./format";

describe("sayı girişi", () => {
  it("Türkçe ve İngilizce biçimleri okur", () => {
    expect(parseNumber("30.000")).toBe(30000);
    expect(parseNumber("30.000,50")).toBe(30000.5);
    expect(parseNumber("30000,5")).toBe(30000.5);
    expect(parseNumber("30,000.50")).toBe(30000.5);
    expect(parseNumber("30000.5")).toBe(30000.5);
    expect(parseNumber("1.234.567")).toBe(1234567);
    expect(parseNumber("₺ 25.000")).toBe(25000);
  });

  it("oranları okur", () => {
    expect(parseNumber("14", { rate: true })).toBe(14);
    expect(parseNumber("0,759", { rate: true })).toBe(0.759);
    expect(parseNumber("0.759", { rate: true })).toBe(0.759);
    expect(parseNumber("%20,75", { rate: true })).toBe(20.75);
    // tutar alanında 3 hane binliktir
    expect(parseNumber("0,759")).toBe(759);
  });

  it("geçersiz metni NaN döndürür", () => {
    expect(parseNumber("")).toBeNaN();
    expect(parseNumber("abc")).toBeNaN();
    expect(parseNumber("12a")).toBeNaN();
  });
});
