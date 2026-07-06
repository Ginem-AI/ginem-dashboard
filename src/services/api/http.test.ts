import { describe, expect, it, vi } from "vitest";
import { CONFIGS } from "@/config/env";
import { getHeaders } from "@/services/api/http";

describe("getHeaders", () => {
  it("returns bearer token from localStorage", () => {
    localStorage.setItem(CONFIGS.localStorageKey, "test-token");

    expect(getHeaders()).toEqual({
      Authorization: "Bearer test-token",
    });
  });

  it("returns empty bearer token when storage is empty", () => {
    localStorage.removeItem(CONFIGS.localStorageKey);

    expect(getHeaders()).toEqual({
      Authorization: "Bearer ",
    });
  });
});
