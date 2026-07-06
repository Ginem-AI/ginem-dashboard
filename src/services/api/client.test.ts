import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPatch: vi.fn(),
  mockRemove: vi.fn(),
  mockGetTableData: vi.fn(),
}));

vi.mock("@/services/api/http", () => ({
  ServiceHttp: class MockServiceHttp {
    get = mocks.mockGet;
    post = mocks.mockPost;
    patch = mocks.mockPatch;
    remove = mocks.mockRemove;
    getTableData = mocks.mockGetTableData;
  },
}));

vi.mock("@/config/env", () => ({
  CONFIGS: { baseUrl: "https://api.test" },
}));

import { apiClient } from "./client";

describe("apiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates get requests to ServiceHttp", async () => {
    mocks.mockGet.mockResolvedValue({ ok: true });

    const result = await apiClient.get("/stats");

    expect(mocks.mockGet).toHaveBeenCalledWith({ path: "/stats" });
    expect(result).toEqual({ ok: true });
  });

  it("delegates post, patch, and remove requests", async () => {
    mocks.mockPost.mockResolvedValue({ created: true });
    mocks.mockPatch.mockResolvedValue({ updated: true });
    mocks.mockRemove.mockResolvedValue({ deleted: true });

    await apiClient.post("/devices", { name: "sensor" });
    await apiClient.patch("/devices", { name: "updated" });
    await apiClient.remove("/devices/1");

    expect(mocks.mockPost).toHaveBeenCalledWith({
      path: "/devices",
      body: { name: "sensor" },
    });
    expect(mocks.mockPatch).toHaveBeenCalledWith({
      path: "/devices",
      body: { name: "updated" },
    });
    expect(mocks.mockRemove).toHaveBeenCalledWith({ path: "/devices/1" });
  });

  it("normalizes empty filters before getTableData", async () => {
    mocks.mockGetTableData.mockResolvedValue({ items: [], totalItems: 0 });

    await apiClient.getTableData({
      path: "/devices",
      page: 2,
      size: 20,
      filter: {
        search: "pump",
        empty: "",
        missing: undefined,
      },
    });

    expect(mocks.mockGetTableData).toHaveBeenCalledWith({
      url: "https://api.test/devices",
      pagination: true,
      page: 2,
      size: 20,
      filters: { search: "pump" },
    });
  });

  it("uses default pagination when page and size are omitted", async () => {
    mocks.mockGetTableData.mockResolvedValue({ items: [], totalItems: 0 });

    await apiClient.getTableData({ path: "/logs" });

    expect(mocks.mockGetTableData).toHaveBeenCalledWith({
      url: "https://api.test/logs",
      pagination: true,
      page: 1,
      size: 10,
      filters: undefined,
    });
  });
});
