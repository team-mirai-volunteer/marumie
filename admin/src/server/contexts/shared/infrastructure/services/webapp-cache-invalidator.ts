import type { ICacheInvalidator } from "@/server/contexts/shared/domain/services/cache-invalidator.interface";

/**
 * webapp のキャッシュを HTTP API 経由で無効化する実装
 */
export class WebappCacheInvalidator implements ICacheInvalidator {
  constructor(
    private webappUrl: string = process.env.WEBAPP_URL || "http://localhost:3000",
    private refreshToken: string | undefined = process.env.DATA_REFRESH_TOKEN,
  ) {}

  async invalidateWebappCache(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error(
        "DATA_REFRESH_TOKEN が設定されていないため、ウェブアプリのキャッシュをクリアできません",
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒タイムアウト

    let response: Response;
    try {
      response = await fetch(`${this.webappUrl}/api/refresh`, {
        method: "POST",
        headers: {
          "x-refresh-token": this.refreshToken,
        },
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`ウェブアプリ (${this.webappUrl}) への接続がタイムアウトしました（5秒）`);
      }
      throw new Error(
        `ウェブアプリ (${this.webappUrl}) への接続に失敗しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const detail = body ? ` ${body}` : "";
      throw new Error(
        `ウェブアプリのキャッシュクリアに失敗しました (HTTP ${response.status}).${detail}`,
      );
    }
  }
}
