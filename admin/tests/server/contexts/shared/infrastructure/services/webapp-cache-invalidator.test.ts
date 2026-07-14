import { WebappCacheInvalidator } from "@/server/contexts/shared/infrastructure/services/webapp-cache-invalidator";

describe("WebappCacheInvalidator", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("refreshToken が未設定の場合、エラーを投げる", async () => {
    const invalidator = new WebappCacheInvalidator("http://webapp.test", undefined);
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;

    await expect(invalidator.invalidateWebappCache()).rejects.toThrow(
      /DATA_REFRESH_TOKEN/,
    );
    // トークンが無ければ fetch も呼ばれない
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("正常なレスポンスの場合、正常に完了する", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
    }) as unknown as typeof fetch;

    const invalidator = new WebappCacheInvalidator("http://webapp.test", "token");

    await expect(invalidator.invalidateWebappCache()).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://webapp.test/api/refresh",
      expect.objectContaining({
        method: "POST",
        headers: { "x-refresh-token": "token" },
      }),
    );
  });

  it("レスポンスが ok でない場合、ステータスとボディを含むエラーを投げる", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue("Unauthorized"),
    }) as unknown as typeof fetch;

    const invalidator = new WebappCacheInvalidator("http://webapp.test", "token");

    await expect(invalidator.invalidateWebappCache()).rejects.toThrow(
      /HTTP 401.*Unauthorized/,
    );
  });

  it("ネットワークエラーの場合、接続失敗のエラーを投げる", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("ECONNREFUSED")) as unknown as typeof fetch;

    const invalidator = new WebappCacheInvalidator("http://webapp.test", "token");

    await expect(invalidator.invalidateWebappCache()).rejects.toThrow(
      /接続に失敗しました.*ECONNREFUSED/,
    );
  });

  it("タイムアウト（AbortError）の場合、タイムアウトのエラーを投げる", async () => {
    const abortError = new Error("aborted");
    abortError.name = "AbortError";
    global.fetch = jest
      .fn()
      .mockRejectedValue(abortError) as unknown as typeof fetch;

    const invalidator = new WebappCacheInvalidator("http://webapp.test", "token");

    await expect(invalidator.invalidateWebappCache()).rejects.toThrow(
      /タイムアウト/,
    );
  });
});
