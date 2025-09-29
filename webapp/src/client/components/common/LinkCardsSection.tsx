import Image from "next/image";

interface LinkCard {
  title: string;
  href: string;
}

const linkCards: LinkCard[] = [
  {
    title: "寄附で応援する",
    href: "https://team-mir.ai/support/donation",
  },
  {
    title: "チームみらい党員になる",
    href: "https://team-mir.ai/support/membership",
  },
];

const OUTERLINK_ICON = "/icons/icon-outerlink.svg";

export default function LinkCardsSection() {
  return (
    <section>
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-3 md:gap-12">
          {linkCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noopener"
              className="flex-1 bg-white border border-black rounded-2xl md:rounded-3xl hover:bg-gray-50 transition-colors p-4 px-6 md:px-12 md:py-9"
            >
              <div className="flex items-center justify-center gap-4 md:justify-between md:gap-6">
                <h3 className="text-lg md:text-[27px] font-bold text-gray-800 leading-tight md:flex-1">
                  {card.title}
                </h3>
                <div className="w-4 h-4 md:w-[22px] md:h-[22px] flex-shrink-0">
                  <Image
                    src={OUTERLINK_ICON}
                    alt=""
                    width={22}
                    height={22}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
