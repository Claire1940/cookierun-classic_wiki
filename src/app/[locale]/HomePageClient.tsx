"use client";

import { useState, Suspense, lazy, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  Clock,
  Cookie,
  Download,
  ExternalLink,
  LifeBuoy,
  MessageCircle,
  Sparkles,
  Swords,
  Ticket,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 把标题文本按条件渲染为文章内链或纯文本（无匹配文章时降级为纯文本）
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// 模块锚点顺序：与 Tools Grid 8 张卡及 8 个 section id 一一对应
const MODULE_SECTION_IDS = [
  "codes-coupon-redeem",
  "release-date-download",
  "beginner-guide",
  "tier-list",
  "cookies-pets-treasures",
  "league-high-score",
  "events-update-tracker",
  "account-transfer-troubleshooting",
] as const;

// tier 徽章样式（主题色不同透明度，无硬编码颜色）
function tierBadgeClass(tier: string) {
  if (tier === "S") {
    return "bg-[hsl(var(--nav-theme))] text-white border-transparent";
  }
  if (tier === "A") {
    return "bg-[hsl(var(--nav-theme)/0.25)] border-[hsl(var(--nav-theme)/0.4)]";
  }
  return "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]";
}

// priority 徽章样式
function priorityBadgeClass(priority: string) {
  if (priority === "Core" || priority === "High") {
    return "bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.4)]";
  }
  return "bg-[hsl(var(--nav-theme)/0.08)] border-[hsl(var(--nav-theme)/0.25)]";
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.cookierun-classic.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "CookieRun Classic Wiki",
        description:
          "Complete CookieRun Classic Wiki covering codes, Cookies, Pets, Treasures, combis, events, and league guides for the classic endless-runner on iOS and Android.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "CookieRun Classic - Classic Cookie Runner Adventure",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "CookieRun Classic Wiki",
        alternateName: "CookieRun Classic",
        url: siteUrl,
        description:
          "Complete CookieRun Classic Wiki resource hub for codes, Cookies, Pets, Treasures, combis, events, and league guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "CookieRun Classic Wiki - Codes, Cookies & Combis",
        },
        sameAs: [
          "https://play.google.com/store/apps/details?id=com.devsisters.crg&hl=en_US",
          "https://apps.apple.com/us/app/cookierun-classic/id6759596824",
          "https://www.instagram.com/crclassic_en",
          "https://x.com/CRClassicEN",
          "https://discord.com/invite/cookierun",
          "https://www.reddit.com/r/Cookierun/",
          "https://www.youtube.com/playlist?list=PLSEv2NB3ypjlJpOtuNr5t4fD3TFzNr1Fl",
        ],
      },
      {
        "@type": "VideoGame",
        name: "CookieRun Classic",
        gamePlatform: ["iOS", "Android"],
        applicationCategory: "Game",
        genre: ["Endless Runner", "Racing", "Adventure", "Casual"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://play.google.com/store/apps/details?id=com.devsisters.crg&hl=en_US",
        },
      },
      {
        "@type": "VideoObject",
        name: "DevNow 2026 | Devsisters' Online Showcase | Full Ver.",
        description:
          "Official Devsisters DevNow 2026 showcase featuring CookieRun Classic gameplay, Cookies, Pets, Treasures, and real-time League run previews.",
        uploadDate: "2026-06-25",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/QECwBKhHj3k",
        url: "https://www.youtube.com/watch?v=QECwBKhHj3k",
      },
    ],
  };

  // Account support accordion state
  const [accountExpanded, setAccountExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const m = t.modules;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes-coupon-redeem")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Ticket className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://play.google.com/store/apps/details?id=com.devsisters.crg&hl=en_US"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="QECwBKhHj3k"
              title="CookieRun Classic | Official Devsisters Showcase"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（位于视频区之后） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = MODULE_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes and Coupon Redeem */}
      <section id="codes-coupon-redeem" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                <Ticket className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
              <LinkedTitle linkData={moduleLinkMap["cookierunClassicCodesCouponRedeem"]} locale={locale}>
                {m.cookierunClassicCodesCouponRedeem.title}
              </LinkedTitle>
            </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {m.cookierunClassicCodesCouponRedeem.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.cookierunClassicCodesCouponRedeem.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-base md:text-lg">{item.code}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-foreground mb-3">{item.reward}</p>
                {typeof item.redeemAt === "string" && item.redeemAt.startsWith("http") ? (
                  <a
                    href={item.redeemAt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--nav-theme-light))] hover:underline mb-3"
                  >
                    Redeem now <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground mb-3">{item.redeemAt}</p>
                )}
                {item.notes?.length > 0 && (
                  <ul className="space-y-1.5">
                    {item.notes.map((note: string, ni: number) => (
                      <li key={ni} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{note}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.steps?.length > 0 && (
                  <ol className="space-y-1.5">
                    {item.steps.map((step: string, si: number) => (
                      <li key={si} className="flex items-start gap-2">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-[10px] font-bold text-[hsl(var(--nav-theme-light))]">
                          {si + 1}
                        </span>
                        <span className="text-xs text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Release Date and Download */}
      <section id="release-date-download" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                <Download className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
              <LinkedTitle linkData={moduleLinkMap["cookierunClassicReleaseDateDownload"]} locale={locale}>
                {m.cookierunClassicReleaseDateDownload.title}
              </LinkedTitle>
            </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {m.cookierunClassicReleaseDateDownload.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {m.cookierunClassicReleaseDateDownload.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-base md:text-lg">{item.label}</h3>
                  {item.type && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      {item.type}
                    </span>
                  )}
                </div>
                {item.value && (
                  <p className="text-sm md:text-base font-semibold text-[hsl(var(--nav-theme-light))] mb-3">{item.value}</p>
                )}
                {item.platform && (
                  <p className="text-sm text-foreground mb-1">Platform: {item.platform}</p>
                )}
                {item.price && (
                  <p className="text-sm text-muted-foreground mb-3">{item.price}</p>
                )}
                {item.href && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--nav-theme-light))] hover:underline mb-3"
                  >
                    Open store <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {item.requirements?.length > 0 && (
                  <ul className="space-y-1.5 mb-3">
                    {item.requirements.map((req: string, ri: number) => (
                      <li key={ri} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.storeFacts?.length > 0 && (
                  <ul className="space-y-1 border-t border-border pt-3 mt-3">
                    {item.storeFacts.map((fact: string, fi: number) => (
                      <li key={fi} className="text-xs text-muted-foreground">{fact}</li>
                    ))}
                  </ul>
                )}
                {item.details?.length > 0 && (
                  <ul className="space-y-1.5">
                    {item.details.map((detail: string, di: number) => (
                      <li key={di} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
              <LinkedTitle linkData={moduleLinkMap["cookierunClassicBeginnerGuide"]} locale={locale}>
                {m.cookierunClassicBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {m.cookierunClassicBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {m.cookierunClassicBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">{step.title}</h3>
                  <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))] mb-2">{step.goal}</p>
                  <ul className="space-y-1">
                    {step.details?.map((detail: string, di: number) => (
                      <li key={di} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Tier List and Best Combis */}
      <section id="tier-list" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                <Trophy className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
              <LinkedTitle linkData={moduleLinkMap["cookierunClassicTierListCombis"]} locale={locale}>
                {m.cookierunClassicTierListCombis.title}
              </LinkedTitle>
            </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {m.cookierunClassicTierListCombis.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.cookierunClassicTierListCombis.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border ${tierBadgeClass(item.tier)}`}>
                    {item.tier}
                  </span>
                  <span className="text-xs text-muted-foreground">#{item.rank}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] ml-auto">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-bold mb-2">{item.name}</h3>
                {item.bestFor?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.bestFor.map((tag: string, ti: number) => (
                      <span key={ti} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mb-2">{item.whyItRanksHere}</p>
                <p className="text-xs text-foreground">{item.recommendedUse}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Cookies, Pets, and Treasures */}
      <section id="cookies-pets-treasures" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                <Cookie className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
              <LinkedTitle linkData={moduleLinkMap["cookierunClassicCookiesPetsTreasures"]} locale={locale}>
                {m.cookierunClassicCookiesPetsTreasures.title}
              </LinkedTitle>
            </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {m.cookierunClassicCookiesPetsTreasures.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.cookierunClassicCookiesPetsTreasures.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {item.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)]">
                    {item.type}
                  </span>
                </div>
                <h3 className="font-bold mb-2 text-[hsl(var(--nav-theme-light))]">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.detail}</p>
                <p className="text-xs text-foreground mb-1"><span className="font-medium">Upgrade:</span> {item.upgradePriority}</p>
                <p className="text-xs text-muted-foreground"><span className="font-medium">Scoring:</span> {item.scoreNote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: League and High Score */}
      <section id="league-high-score" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                <Swords className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
              <LinkedTitle linkData={moduleLinkMap["cookierunClassicLeagueHighScore"]} locale={locale}>
                {m.cookierunClassicLeagueHighScore.title}
              </LinkedTitle>
            </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {m.cookierunClassicLeagueHighScore.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {m.cookierunClassicLeagueHighScore.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="font-bold mb-2">{item.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)]">
                    {item.focus}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityBadgeClass(item.priority)}`}>
                    {item.priority}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border">
                    Risk: {item.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.strategy}</p>
                <p className="text-xs text-foreground"><span className="font-medium">Run habit:</span> {item.runHabit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Events and Updates */}
      <section id="events-update-tracker" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                <CalendarClock className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
              <LinkedTitle linkData={moduleLinkMap["cookierunClassicEventsUpdates"]} locale={locale}>
                {m.cookierunClassicEventsUpdates.title}
              </LinkedTitle>
            </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {m.cookierunClassicEventsUpdates.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {m.cookierunClassicEventsUpdates.items.map((item: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] ml-auto">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.details}</p>
                  <p className="text-xs font-medium text-[hsl(var(--nav-theme-light))] mb-1">Reward: {item.reward}</p>
                  <p className="text-xs text-foreground">{item.playerAction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Account Transfer and Troubleshooting */}
      <section id="account-transfer-troubleshooting" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                <LifeBuoy className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
              <LinkedTitle linkData={moduleLinkMap["cookierunClassicAccountSupport"]} locale={locale}>
                {m.cookierunClassicAccountSupport.title}
              </LinkedTitle>
            </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {m.cookierunClassicAccountSupport.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2 mb-8">
            {m.cookierunClassicAccountSupport.items.map((item: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setAccountExpanded(accountExpanded === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-sm md:text-base pr-4">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${accountExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {accountExpanded === index && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5">
                    <p className="text-sm text-muted-foreground mb-3">{item.answer}</p>
                    {item.steps?.length > 0 && (
                      <ol className="space-y-1.5 mb-3">
                        {item.steps.map((step: string, si: number) => (
                          <li key={si} className="flex items-start gap-2">
                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-[10px] font-bold text-[hsl(var(--nav-theme-light))]">
                              {si + 1}
                            </span>
                            <span className="text-sm text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                    {item.warning && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)]">
                        <AlertTriangle className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{item.warning}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 支持渠道外部链接 */}
          <div className="scroll-reveal p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-2">Need more help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Reach official CookieRun Classic support and community channels:
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://cs-cookierunclassic.devsisters.com/hc/en-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                  >
                    Official Support <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://discord.com/invite/cookierun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Discord <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/cookierun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/CRClassicEN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/Cookierun/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.devsisters.crg&hl=en_US"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
