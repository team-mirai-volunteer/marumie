import "server-only";
import MainColumn from "@/client/components/layout/MainColumn";
import MainColumnCard from "@/client/components/layout/MainColumnCard";

interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 font-japanese">
      {children}
    </h2>
  );
}

interface SubSectionTitleProps {
  children: React.ReactNode;
}

function SubSectionTitle({ children }: SubSectionTitleProps) {
  return (
    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 font-japanese">
      {children}
    </h3>
  );
}

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

function Paragraph({ children, className = "" }: ParagraphProps) {
  return (
    <p
      className={`text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium sm:font-normal font-japanese ${className}`}
    >
      {children}
    </p>
  );
}

interface ListProps {
  items: string[];
}

function List({ items }: ListProps) {
  return (
    <ul className="list-disc list-inside text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium sm:font-normal font-japanese space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <MainColumn>
      <MainColumnCard>
        <div className="space-y-9">
          <div>
            <SectionTitle>利用規約</SectionTitle>
            <Paragraph className="mb-6">
              本サービスをご利用いただくにあたり、以下の規約に同意いただいたものとみなします。
            </Paragraph>

            <div className="space-y-6">
              <div>
                <SubSectionTitle>第1条（公開するデータの範囲）</SubSectionTitle>
                <Paragraph>
                  本サイトで公開するデータは、現時点においてはその正確性・完全性・即時性について保証するものではありません。現時点での最終的な収支は、別途公開される「政治資金収支報告書」並びに「選挙運動費用収支報告書」をご確認ください。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>第2条（禁止事項）</SubSectionTitle>
                <Paragraph className="mb-2">
                  ユーザーは以下の行為を行ってはなりません。
                </Paragraph>
                <List
                  items={[
                    "法令または公序良俗に反する行為",
                    "本サービスの運営を妨げる行為",
                    "本サービスの情報を改ざん・加工し、誤解を招く形で利用する行為",
                    "当団体または第三者の権利・利益を侵害する行為",
                  ]}
                />
              </div>

              <div>
                <SubSectionTitle>第3条（知的財産権）</SubSectionTitle>
                <Paragraph>
                  本サービスに掲載されるテキスト、画像、データ等の権利は、当団体または正当な権利者に帰属します。ユーザーは私的利用の範囲を超えて使用してはなりません。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>第4条（サービスの変更・停止）</SubSectionTitle>
                <Paragraph>
                  当団体は、ユーザーへの事前通知なく本サービスの内容を変更・停止できるものとし、それにより生じた損害について一切の責任を負いません。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>第5条（規約の変更）</SubSectionTitle>
                <Paragraph>
                  当団体は必要に応じて本規約を変更することができ、変更後にユーザーが本サービスを利用した場合、当該変更に同意したものとみなします。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>第6条（準拠法・管轄）</SubSectionTitle>
                <Paragraph>
                  本規約は日本法に準拠し、本サービスに関連して生じる一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                </Paragraph>
              </div>
            </div>
          </div>

          <div>
            <SectionTitle>プライバシーポリシー</SectionTitle>

            <div className="space-y-6">
              <div>
                <SubSectionTitle>1. 個人情報の定義</SubSectionTitle>
                <Paragraph className="mb-2">
                  個人情報とは、以下のような情報により特定の個人を識別することができるものを指します。
                </Paragraph>
                <List
                  items={[
                    "氏名、年齢、性別、住所、電話番号、職業、メールアドレス",
                    "個人ごとに割り当てられたIDやパスワード、その他識別可能な記号など",
                    "単体では個人の特定ができないものの、他の情報と容易に照合することができ、個人を特定できる情報",
                  ]}
                />
              </div>

              <div>
                <SubSectionTitle>
                  2. 個人情報の収集目的と使用範囲
                </SubSectionTitle>
                <Paragraph className="mb-2">
                  個人情報をご提供いただく際には、利用者の同意に基づいて行うことを原則とし、無断で収集・利用することはありません。提供いただいた情報は、以下の目的で使用します。
                </Paragraph>
                <List
                  items={[
                    "チームみらいの政治活動への活用",
                    "各種案内や通知の送付",
                    "資料請求に対する送付対応",
                    "お問い合わせやご意見へのご回答",
                    "アンケート等の統計的な集計・分析",
                    "そのほかなんらかの理由で利用者と接触をする必要が生じた場合",
                  ]}
                />
                <Paragraph className="mt-2">
                  なお、これらの目的を超えて提供された個人情報を使用することは、利用者の同意なく行いません。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>3. 第三者への情報提供について</SubSectionTitle>
                <Paragraph className="mb-2">
                  以下のいずれかに該当する場合を除き、利用者から提供された個人情報を第三者に開示・提供することはありません。
                </Paragraph>
                <List
                  items={[
                    "利用者本人の同意がある場合",
                    "利用者個人が識別されない形（他の情報と照合しても個人を特定できない場合）で提供する場合",
                    "法令に基づく開示請求があった場合",
                    "不正アクセスや規約違反など、利用者本人による違反が確認された場合",
                    "第三者に対して不利益を与えると判断された場合",
                    "公共の利益や利用者本人の利益のために必要と判断された場合",
                    "寄付金が年間5万円を超える場合、およびそれ以下の金額でも寄付金控除を申請する場合は、政治資金収支報告書に寄付者の情報が記載されます。また、寄附金控除を受ける場合は、総務省のウェブサイトにて寄付年月日・金額・住所・氏名・職業が公開されます。",
                  ]}
                />
              </div>

              <div>
                <SubSectionTitle>4. 安全管理措置について</SubSectionTitle>
                <Paragraph>
                  個人情報の適切な管理を行うために、責任者を定めた上で、厳正な管理・監督体制を構築しています。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>5. Cookie（クッキー）について</SubSectionTitle>
                <Paragraph className="mb-2">
                  Cookieとは、サーバーが利用者の識別を目的として、利用者のブラウザに送信し、端末に保存される情報です。
                </Paragraph>
                <Paragraph>
                  当ウェブサイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しており、Googleアナリティクスはデータ収集のためにCookieを使用しています。データは匿名で収集されており、個人を特定するものではありません。この機能はお使いのブラウザの設定でCookieを無効にすることで拒否することができます。Googleアナリティクスでデータが収集および処理される仕組みの詳細は「Google
                  のサービスを使用するサイトやアプリから収集した情報の Google
                  による使用」のページをご覧ください。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>6. 個人情報の保管期間</SubSectionTitle>
                <Paragraph>
                  取得した個人情報は、政治資金規正法等の法令に基づき、必要な期間（原則として7年間）保管した後、適切な方法により廃棄・削除いたします。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>
                  7. プライバシーポリシーの改訂と通知について
                </SubSectionTitle>
                <Paragraph>
                  このプライバシーポリシーは、必要に応じて内容の見直しを行い、改訂されることがあります。その際、個別の通知は行いませんので、最新の情報については当ウェブサイトをご確認ください。
                </Paragraph>
              </div>

              <div>
                <SubSectionTitle>
                  8. 個人情報に関するお問い合わせ
                </SubSectionTitle>
                <Paragraph className="mb-4">
                  個人情報の確認・修正・削除・利用停止等をご希望される場合は、下記のお問い合わせ窓口までご連絡ください。なお、ご請求内容がご本人によるものであることが確認できた場合に限り、必要な調査を行い、その結果に基づき適切な対応を行います。
                </Paragraph>
                <div className="text-[11px] sm:text-[15px] leading-[1.82] sm:leading-[1.87] tracking-[0.01em] text-gray-500 sm:text-gray-800 font-medium sm:font-normal font-japanese">
                  <p className="font-bold">お問い合わせ窓口</p>
                  <p>チームみらい 個人情報保護管理責任者</p>
                  <p>support@team-mir.ai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainColumnCard>
    </MainColumn>
  );
}
