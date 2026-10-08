import { describe, it, expect, vi, afterEach } from "vitest";
import { apiFetch, ApiError } from "./api";

describe("apiFetch", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("omits Content-Type when no body is given — a bodyless request with that header 500s against Fastify's JSON parser (CHANGELOG.md's DELETE bug)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { success: true } }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiFetch("/v1/employees/1", { method: "DELETE", accessToken: "tok" });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
  });

  it("sets Content-Type when a JSON body is given", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiFetch("/v1/employees", {
      method: "POST",
      body: JSON.stringify({ foo: "bar" }),
      accessToken: "tok",
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
  });

  it("omits Content-Type for a FormData body, so the browser can set its own multipart boundary", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiFetch("/v1/employees/import", {
      method: "POST",
      body: new FormData(),
      accessToken: "tok",
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
  });

  it("unwraps the {data} envelope and returns its contents", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: "abc" } }),
    }) as unknown as typeof fetch;

    const result = await apiFetch<{ id: string }>("/v1/employees/abc");
    expect(result).toEqual({ id: "abc" });
  });

  it("throws ApiError with the backend's message and code on a non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Not found", code: "NOT_FOUND" }),
    }) as unknown as typeof fetch;

    await expect(apiFetch("/v1/employees/missing")).rejects.toMatchObject(
      new ApiError("Not found", "NOT_FOUND"),
    );
  });
});
