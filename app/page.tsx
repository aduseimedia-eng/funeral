"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Heart,
  ShieldCheck,
  QrCode,
  Globe2,
  BookHeart,
  Flower2,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  Navbar,
  Footer,
  CampaignCard,
  CheckLine,
} from "@/components/common/ui";
import { useDemo } from "@/components/providers";
import { money, totalFor } from "@/lib/utils";
export default function Home() {
  const { state } = useDemo();
  const heroCampaign =
    state.campaigns.find((campaign) => campaign.id === "kwasi-mensah") ??
    state.campaigns[0];
  const heroTotal = totalFor(state.contributions, heroCampaign?.id);
  return (
    <>
      <Navbar />
      <main>
        <section className="hero container">
          <img
            className="hero-remembrance-art"
            src="/images/hero-remembrance-v2.png"
            alt="White flowers and candlelight arranged with Ghanaian woven cloth"
          />
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <Flower2 size={18} strokeWidth={1.5} /> A place to remember. A
              community ready to help.
            </div>
            <h1>
              A life remembered.
              <br />
              <em>A family held.</em>
            </h1>
            <p>
              Bring together the stories, people, and practical support that
              matter when a loved one is being honoured.
            </p>
            <div className="hero-actions">
              <Link
                href="/dashboard/family/campaigns/?create=1"
                className="btn"
              >
                Create a funeral page <ArrowUpRight size={18} />
              </Link>
              <Link href="/campaigns/" className="text-link">
                Explore memorials <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-trust">
              <span>
                <ShieldCheck size={17} />
                One clear contribution record
              </span>
              <span>
                <Globe2 size={16} />
                Together, wherever you are
              </span>
            </div>
            <p className="hero-tribute">In memory. In community. In every gesture.</p>
          </div>
          <div className="hero-visual hero-memorial-stage">
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
            <div className="hero-memory-card">
              <div className="hero-memory-image">
                <img
                  src={heroCampaign?.image ?? "/images/kwasi-portrait.png"}
                  alt={`Portrait of ${heroCampaign?.name ?? "Nana Kwasi Mensah"}`}
                />
                <span>IN LOVING MEMORY</span>
              </div>
              <div className="hero-memory-copy">
                <p>{heroCampaign?.location ?? "Kumasi, Ghana"}</p>
                <h2>{heroCampaign?.name ?? "Nana Kwasi Mensah"}</h2>
                <span>{heroCampaign?.years ?? "1948 — 2026"}</span>
                <div className="hero-card-progress">
                  <div>
                    <span>Community support</span>
                    <strong>{money(heroTotal)}</strong>
                  </div>
                  <div className="hero-progress-line">
                    <span
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((heroTotal / (heroCampaign?.target ?? 1)) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-side-note">
              <Heart size={18} fill="currentColor" />
              <span>Every contribution is a way of saying, “we are with you.”</span>
            </div>
          </div>
        </section>
        <section className="values-strip">
          <div className="container">
            <span>
              <Users />
              For families, by community
            </span>
            <span>
              <Globe2 />
              Support from anywhere
            </span>
            <span>
              <QrCode />
              One scan. A meaningful gesture.
            </span>
            <span>
              <ShieldCheck />
              Every contribution, accounted for
            </span>
          </div>
        </section>
        <section className="section container" id="how-it-works">
          <div className="section-head">
            <div>
              <div className="eyebrow">SIMPLE STEPS. MEANINGFUL SUPPORT.</div>
              <h2>A little easier, when it matters most.</h2>
            </div>
            <p>
              Less to organise. More space to remember.
              <br />
              We bring everything together in one place.
            </p>
          </div>
          <div className="steps-grid">
            {[
              {
                i: "01",
                icon: BookHeart,
                title: "Create a place to remember",
                text: "Share their story, funeral details, and a cherished photograph on a personal memorial page.",
              },
              {
                i: "02",
                icon: QrCode,
                title: "Bring your community together",
                text: "Share a link or QR code with family and friends, at home in Ghana or across the world.",
              },
              {
                i: "03",
                icon: Heart,
                title: "Receive support, with clarity",
                text: "Keep digital and cash contributions organised, with a clear register and thoughtful acknowledgements.",
              },
            ].map((s) => (
              <div className="step" key={s.i}>
                <div className="step-top">
                  <s.icon size={28} strokeWidth={1.3} />
                  <span>{s.i}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="featured-section">
          <div className="container section">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  A LIFE REMEMBERED. A FAMILY SUPPORTED.
                </div>
                <h2>In loving memory</h2>
              </div>
              <Link href="/campaigns/" className="text-link">
                Explore all memorials <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="campaign-grid">
              {state.campaigns
                .filter((c) => c.status === "Active")
                .slice(0, 3)
                .map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
            </div>
            <p className="demo-caption">
              Illustrative memorials and contributions shown for demonstration.
            </p>
          </div>
        </section>
        <section className="section container support-section">
          <div className="support-art">
            <div className="support-art-top">
              <Flower2 strokeWidth={1} size={39} />
              <span>
                A SHARED TRADITION.
                <br />A SIMPLER WAY.
              </span>
            </div>
            <h2>
              Distance shouldn’t
              <br />
              stand in the way
              <br />
              of <em>being there.</em>
            </h2>
            <div className="support-art-bottom">
              <span>
                From Accra to London.
                <br />
                From Kumasi to wherever you call home.
              </span>
              <Globe2 size={48} strokeWidth={0.7} />
            </div>
          </div>
          <div className="support-copy">
            <div className="eyebrow">CARE, WITHOUT THE COMPLICATIONS</div>
            <h2>
              For the family.
              <br />
              For everyone who cares.
            </h2>
            <p>
              Funeral contributions are more than money. They are a way of
              saying, “we are with you.” We help that gesture reach the people
              who need it.
            </p>
            <div className="benefit">
              <span>01</span>
              <div>
                <h3>A lighter load for families</h3>
                <p>
                  One memorial, one contribution register, and a clear picture
                  of the support received.
                </p>
              </div>
            </div>
            <div className="benefit">
              <span>02</span>
              <div>
                <h3>A personal way to give</h3>
                <p>
                  Choose how you’re acknowledged, leave a message, and keep a
                  record of your support.
                </p>
              </div>
            </div>
            <Link className="text-link" href="/about/">
              The story behind Nsaabɔdeɛ <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
        <section className="qr-section">
          <div className="container qr-section-inner">
            <div>
              <div className="eyebrow">
                FROM THE FUNERAL GROUNDS TO YOUR PHONE
              </div>
              <h2>
                One scan.
                <br />A meaningful connection.
              </h2>
              <p>
                Add your memorial QR code to funeral programmes, invitation
                cards, or a poster at the venue. Loved ones can open the
                memorial and contribute in a few simple steps.
              </p>
              <div className="check-row">
                <CheckLine>Easy to share</CheckLine>
                <CheckLine>Ready to print</CheckLine>
                <CheckLine>No app needed</CheckLine>
              </div>
              <Link href="/dashboard/family/qr/" className="text-link">
                Explore QR contributions <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="qr-illustration">
              <div className="qr-poster-mini">
                <Flower2 size={23} />
                <span>IN LOVING MEMORY</span>
                <h3>Nana Kwasi Mensah</h3>
                <div className="decorative-qr" aria-hidden="true">
                  <QrCode size={130} strokeWidth={1} />
                </div>
                <p>
                  Scan to remember.
                  <br />
                  Scan to support.
                </p>
                <small>nsaabɔdeɛ</small>
              </div>
              <div className="scan-tag">
                <QrCode size={18} /> A small gesture. A world of support.
              </div>
            </div>
          </div>
        </section>
        <section className="section container trust-section">
          <div className="eyebrow">THOUGHTFUL BY DESIGN</div>
          <h2>Trust is part of the tradition.</h2>
          <p>Support should feel personal. Managing it should feel clear.</p>
          <div className="trust-grid">
            <div>
              <ShieldCheck />
              <h3>Clarity at every step</h3>
              <p>
                See contribution records, payment status, and a complete
                register in one place.
              </p>
            </div>
            <div>
              <Heart />
              <h3>Your gesture. Your choice.</h3>
              <p>
                Full acknowledgement, name only, or anonymous. Your preference
                is respected.
              </p>
            </div>
            <div>
              <Users />
              <h3>Built around our culture</h3>
              <p>
                Family administrators, cash contributions, and an MC
                announcement view that understands the occasion.
              </p>
            </div>
          </div>
        </section>
        <section className="faq-section section container" id="faq">
          <div>
            <div className="eyebrow">A LITTLE MORE CLARITY</div>
            <h2>Here to help.</h2>
            <p>Some things you might be wondering.</p>
          </div>
          <div className="faqs">
            {[
              [
                "What is Nsaabɔdeɛ?",
                "Nsaabɔdeɛ is inspired by the Ghanaian tradition of supporting bereaved families through funeral contributions. This frontend demonstration brings memorials, contributions, and acknowledgements into one place.",
              ],
              [
                "Can family and friends contribute from abroad?",
                "This demo shows how supporters could contribute from anywhere. Payment methods are visual demonstrations only; international payments are not connected.",
              ],
              [
                "Can we record cash contributions?",
                "Yes. In the family demo dashboard, use “Record cash” to add a verified cash contribution to your local register. Cash and digital records are clearly separated.",
              ],
              [
                "Can I contribute anonymously?",
                "Yes. Choose Anonymous at checkout. The MC view removes your name and amount; organisers retain the local demonstration register.",
              ],
              [
                "Does this demo collect real payments?",
                "No. Every campaign and transaction is illustrative. Checkout only simulates payment processing, and no money is transferred.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={17} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing-cta">
          <div className="container">
            <Flower2 size={33} strokeWidth={1} />
            <h2>
              A beautiful life deserves
              <br />a meaningful remembrance.
            </h2>
            <p>Create a place for memories. Bring your community together.</p>
            <Link
              className="btn btn-gold"
              href="/dashboard/family/campaigns/?create=1"
            >
              Create a funeral page <ArrowUpRight size={18} />
            </Link>
            <span>No real payments · Explore the frontend demo</span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
