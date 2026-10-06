import { describe, it, expect } from "vitest";
import { parseCsv } from "../../utils/csv";

describe("parseCsv", () => {
  it("parses a simple header + rows", () => {
    const rows = parseCsv("a,b\n1,2\n3,4\n");
    expect(rows).toEqual([
      { a: "1", b: "2" },
      { a: "3", b: "4" },
    ]);
  });

  it("handles quoted fields containing commas", () => {
    const rows = parseCsv('name,note\n"Doe, Jane","says ""hi"""\n');
    expect(rows).toEqual([{ name: "Doe, Jane", note: 'says "hi"' }]);
  });

  it("handles CRLF line endings and trims whitespace", () => {
    const rows = parseCsv("a,b\r\n 1 , 2 \r\n");
    expect(rows).toEqual([{ a: "1", b: "2" }]);
  });

  it("skips blank trailing lines", () => {
    const rows = parseCsv("a,b\n1,2\n\n");
    expect(rows).toEqual([{ a: "1", b: "2" }]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseCsv("")).toEqual([]);
  });
});
