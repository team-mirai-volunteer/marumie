import { renderToStaticMarkup } from "react-dom/server";
import BalanceSheetChart from "@/client/components/top-page/features/charts/BalanceSheetChart";

describe("BalanceSheetChart", () => {
  const markup = renderToStaticMarkup(
    <BalanceSheetChart
      data={{
        left: {
          currentAssets: 123_450_000,
          fixedAssets: 50_000,
          debtExcess: 0,
        },
        right: {
          currentLiabilities: 2_500_000,
          fixedLiabilities: 10_000,
          netAssets: 120_990_000,
        },
      }}
    />,
  );

  it("貸借対照表の値を画像ロールで隠さず、意味のある図と区分として公開する", () => {
    expect(markup).not.toContain('role="img"');
    expect(markup).toContain("<figure");
    expect(markup).toContain('<figcaption class="sr-only">貸借対照表</figcaption>');
    expect(markup).toMatch(/<section[^>]*aria-label="資産"/);
    expect(markup).toMatch(/<section[^>]*aria-label="負債・純資産"/);
  });

  it("勘定名と金額を支援技術から参照できるテキストとして保持する", () => {
    const textContent = markup.replace(/<[^>]+>/g, "");

    for (const expectedText of [
      "流動資産",
      "1億2345万円",
      "固定資産",
      "5万円",
      "流動負債",
      "250万円",
      "固定負債",
      "1万円",
      "純資産",
      "1億2099万円",
    ]) {
      expect(textContent).toContain(expectedText);
    }
  });
});
