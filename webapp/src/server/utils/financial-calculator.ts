export interface FormattedAmount {
  main: string;
  secondary: string;
  tertiary: string;
  unit: string;
}

// 金額を万円単位でフォーマットする関数
export function formatAmount(amount: number): FormattedAmount {
  if (amount < 0) {
    throw new Error("Negative amounts are not supported");
  }

  const manAmount = Math.round(amount / 10000); // 万円に変換

  if (manAmount >= 10000) {
    const oku = Math.floor(manAmount / 10000);
    const man = manAmount % 10000;
    if (man === 0) {
      return {
        main: oku.toString(),
        secondary: "億",
        tertiary: "",
        unit: "円",
      };
    }
    return {
      main: oku.toString(),
      secondary: "億",
      tertiary: man.toString(),
      unit: "万円",
    };
  }
  return {
    main: manAmount.toString(),
    secondary: "",
    tertiary: "",
    unit: "万円",
  };
}
