import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cookierun-classic.wiki'
  const path = '/about'

  return {
    title: 'About CookieRun Classic Wiki - Your CookieRun Classic Resource Hub',
    description: 'Learn about CookieRun Classic Wiki, a community-driven resource hub providing comprehensive codes, Cookie, Pet, Treasure, combi, and event guides for the CookieRun Classic mobile game.',
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'CookieRun Classic Wiki',
      title: 'About CookieRun Classic Wiki',
      description: 'Learn about our mission to provide the best CookieRun Classic codes, Cookies, Pets, Treasures, combis, and event guides.',
      images: [
        {
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          alt: 'CookieRun Classic Wiki',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About CookieRun Classic Wiki',
      description: 'Learn about our mission to provide the best CookieRun Classic resources and guides.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About CookieRun Classic Wiki
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Your community-driven resource center for CookieRun Classic
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Welcome to CookieRun Classic Wiki</h2>
            <p>
              CookieRun Classic Wiki is an <strong>unofficial, fan-made resource website</strong> dedicated to helping players
              master the mobile game "CookieRun Classic" on iOS and Android. We are a community-driven platform that provides comprehensive codes,
              Cookie, Pet, and Treasure guides, combi recommendations, event details, and League strategies to enhance your running experience.
            </p>
            <p>
              Whether you're a new runner just learning to dodge obstacles and collect Jellies or a seasoned veteran optimizing your combis for League races,
              CookieRun Classic Wiki is here to support you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Our Mission</h2>
            <p>
              Our mission is simple: <strong>to empower CookieRun Classic players with accurate, up-to-date information
              and useful tools</strong> that help them succeed in the game. We strive to:
            </p>
            <ul>
              <li><strong>Provide reliable information:</strong> Keep our content updated with the latest codes, new Cookies, Pets, Treasures, and balance changes</li>
              <li><strong>Build useful guides:</strong> Develop tier lists, combi recommendations, and event walkthroughs that help players make informed decisions</li>
              <li><strong>Foster community:</strong> Create a welcoming space where players can learn, share strategies, and grow together</li>
              <li><strong>Stay accessible:</strong> Keep all resources free and easy to use for players of all skill levels</li>
            </ul>

            <h2>Our Vision</h2>
            <p>
              We envision CookieRun Classic Wiki as the <strong>go-to destination</strong> for every CookieRun Classic player seeking
              to improve their runs. We want to be the resource that players trust and rely on, whether they need
              working codes, want to build the best combi, or are chasing higher League rankings.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature Card 1 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🎟️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Codes & Rewards</h3>
              <p className="text-slate-300">
                Up-to-date redeem codes, launch rewards, and step-by-step instructions for claiming
                free Crystals, Coins, and Treasure Tickets.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🍪</div>
              <h3 className="text-xl font-semibold text-white mb-2">Cookie Guides</h3>
              <p className="text-slate-300">
                Detailed information on every Cookie's skills, unlock methods, and upgrade value,
                plus tier lists for every game mode.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🐾</div>
              <h3 className="text-xl font-semibold text-white mb-2">Pets & Treasures</h3>
              <p className="text-slate-300">
                Complete Pet and Treasure databases with skill effects, upgrade priorities,
                and the best picks for high scores and farming.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🤝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Combi Recommendations</h3>
              <p className="text-slate-300">
                Tested Cookie + Pet + Treasure combinations for high scores, coin farming,
                and budget-friendly setups for new players.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="text-xl font-semibold text-white mb-2">Events & League</h3>
              <p className="text-slate-300">
                Current event schedules, task walkthroughs, launch gifts, and League strategies
                to help you climb the real-time rankings.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🌐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Multilingual Support</h3>
              <p className="text-slate-300">
                Content available in multiple languages including English, Thai, Korean,
                and Japanese to serve CookieRun Classic players worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Community-Driven</h2>
            <p>
              CookieRun Classic Wiki is built <strong>by the community, for the community</strong>. We welcome contributions,
              feedback, and suggestions from players of all skill levels. Our content is constantly evolving based on:
            </p>
            <ul>
              <li><strong>Player feedback:</strong> Your suggestions help us improve and expand our resources</li>
              <li><strong>Community discoveries:</strong> New combis, hidden mechanics, and pro tips shared by players</li>
              <li><strong>Game updates:</strong> We monitor official updates and adjust our content accordingly</li>
              <li><strong>Meta shifts:</strong> We track League trends and update tier lists based on real player experiences</li>
            </ul>
            <p>
              <strong>Want to contribute?</strong> Whether you've found a new code, discovered a strong combi,
              or have suggestions for new guides, we'd love to hear from you! Reach out through our contact channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>About the Team</h2>
            <p>
              CookieRun Classic Wiki is maintained by a dedicated team of passionate gamers and developers who love
              CookieRun Classic as much as you do. We're players first, constantly testing combis, chasing high scores,
              and staying updated with the latest events and rewards.
            </p>
            <p>
              Our team combines expertise in:
            </p>
            <ul>
              <li><strong>Game analysis:</strong> Deep understanding of CookieRun Classic mechanics, Cookies, and scoring</li>
              <li><strong>Web development:</strong> Building fast, user-friendly tools and interfaces</li>
              <li><strong>Content creation:</strong> Writing clear, helpful guides and tutorials</li>
              <li><strong>Community management:</strong> Listening to player feedback and fostering a positive environment</li>
            </ul>
            <p className="text-slate-400 italic text-sm">
              Project Codename: "Ovenbreak Reborn" – Running classic with the community.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Important Disclaimer</h2>
            <p className="text-yellow-400/90">
              <strong>CookieRun Classic Wiki is an unofficial fan-made website.</strong> We are NOT affiliated with,
              endorsed by, or associated with Devsisters Corporation or the developers of CookieRun Classic.
            </p>
            <p>
              All game content, trademarks, characters, and assets are the property of their respective owners.
              We use game-related content under fair use principles for informational and educational purposes only.
            </p>
            <p>
              CookieRun Classic Wiki is a non-profit, community resource created by fans, for fans.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear from you! Whether you have questions, suggestions, found a bug, or just want to say hi:
            </p>
            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
                <a href="mailto:contact@cookierun-classic.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contact@cookierun-classic.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Bug Reports</h3>
                <a href="mailto:support@cookierun-classic.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  support@cookierun-classic.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Content Submissions</h3>
                <a href="mailto:contribute@cookierun-classic.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contribute@cookierun-classic.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
                <a href="mailto:partnerships@cookierun-classic.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  partnerships@cookierun-classic.wiki
                </a>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              <strong>Response Time:</strong> We aim to respond to all inquiries within 2-3 business days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-y border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest codes, combis, tips, and CookieRun Classic news.
            Bookmark this site and check back regularly for new content!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[hsl(var(--nav-theme-light))] text-white font-semibold hover:opacity-90 transition"
          >
            Explore Resources
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
