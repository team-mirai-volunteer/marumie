-- non_cash_journal レコードを income / expense に再判定して更新する。
-- Supabase SQL Editor で実行すること。
-- 実行前に SELECT 文でレコード数を確認しておくことを推奨。

-- ① 確認用: 対象レコード数
SELECT
  CASE
    WHEN debit_account IN (
      '人件費','光熱水費','備品・消耗品費','事務所費',
      '組織活動費','選挙関係費','機関紙誌の発行事業費','宣伝事業費',
      '政治資金パーティー開催事業費','その他の事業費','調査研究費',
      '寄附・交付金','その他の経費'
    )
    AND credit_account IN ('未払金/未払費用','仮払金','仮受金','立替金')
    THEN 'expense に更新（PL費用/非CASH BS）'
    WHEN debit_account IN ('未払金/未払費用','仮払金','仮受金','立替金')
    AND credit_account IN (
      '人件費','光熱水費','備品・消耗品費','事務所費',
      '組織活動費','選挙関係費','機関紙誌の発行事業費','宣伝事業費',
      '政治資金パーティー開催事業費','その他の事業費','調査研究費',
      '寄附・交付金','その他の経費'
    )
    THEN 'expense に更新（非CASH BS/PL費用・仮払精算など）'
    WHEN debit_account IN ('未払金/未払費用','仮払金','仮受金','立替金')
    AND credit_account IN (
      '個人の負担する党費又は会費','個人からの寄附','個人からの寄附（特定寄附）',
      '法人その他の団体からの寄附','政治団体からの寄附','政党匿名寄附',
      '機関紙誌の発行その他の事業による収入','借入金',
      '本部又は支部から供与された交付金に係る収入',
      '政治資金パーティーの対価に係る収入','寄附のあっせんによるもの',
      '政治資金パーティー対価のあっせんによるもの','その他の収入'
    )
    THEN 'income に更新'
    ELSE 'その他（要確認）'
  END AS 更新種別,
  COUNT(*) AS 件数
FROM transactions
WHERE transaction_type = 'non_cash_journal'
GROUP BY 更新種別;

-- ② expense に更新: PL費用科目（借方） / 非CASH BS（貸方）
UPDATE transactions
SET transaction_type = 'expense'
WHERE transaction_type = 'non_cash_journal'
  AND debit_account IN (
    '人件費','光熱水費','備品・消耗品費','事務所費',
    '組織活動費','選挙関係費','機関紙誌の発行事業費','宣伝事業費',
    '政治資金パーティー開催事業費','その他の事業費','調査研究費',
    '寄附・交付金','その他の経費'
  )
  AND credit_account IN ('未払金/未払費用','仮払金','仮受金','立替金');

-- ③ expense に更新: 非CASH BS（借方） / PL費用科目（貸方）（仮払精算など）
UPDATE transactions
SET transaction_type = 'expense'
WHERE transaction_type = 'non_cash_journal'
  AND debit_account IN ('未払金/未払費用','仮払金','仮受金','立替金')
  AND credit_account IN (
    '人件費','光熱水費','備品・消耗品費','事務所費',
    '組織活動費','選挙関係費','機関紙誌の発行事業費','宣伝事業費',
    '政治資金パーティー開催事業費','その他の事業費','調査研究費',
    '寄附・交付金','その他の経費'
  );

-- ④ income に更新: 非CASH BS（借方） / PL収益科目（貸方）
UPDATE transactions
SET transaction_type = 'income'
WHERE transaction_type = 'non_cash_journal'
  AND debit_account IN ('未払金/未払費用','仮払金','仮受金','立替金')
  AND credit_account IN (
    '個人の負担する党費又は会費','個人からの寄附','個人からの寄附（特定寄附）',
    '法人その他の団体からの寄附','政治団体からの寄附','政党匿名寄附',
    '機関紙誌の発行その他の事業による収入','借入金',
    '本部又は支部から供与された交付金に係る収入',
    '政治資金パーティーの対価に係る収入','寄附のあっせんによるもの',
    '政治資金パーティー対価のあっせんによるもの','その他の収入'
  );

-- ⑤ 残存確認: 0件であれば完了
SELECT id, debit_account, credit_account
FROM transactions
WHERE transaction_type = 'non_cash_journal'
LIMIT 20;
