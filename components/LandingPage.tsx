import Link from "next/link";
import LandingNav from "./LandingNav";
import { getSupabaseService } from "@/lib/supabaseService.server";
import type { LeaderboardEntry } from "@/lib/supabaseService";

export default async function LandingPage() {
  const supabaseService = await getSupabaseService();
  const leaderboard = await supabaseService.getLeaderboard().catch((err) => {
    console.error("Failed to load public leaderboard:", err);
    return [] as LeaderboardEntry[];
  });

  return (
    <div>
      <LandingNav />

      <section className="hero wrap flex flex-col lg:grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 pt-28 sm:pt-32 lg:pt-36">
        <div>
          <div className="eyebrow">Cebu City Food Assistance Network</div>
          <h1>
            Every extra plate
            <br />
            finds <em>the right</em> table.
          </h1>
          <p className="sub">
            Give food or cash, ask for help when you&apos;re short, and let the city match it fairly — elderly, PWD,
            and infants first. Every handoff is sealed with a one-time code, so nothing gets marked done until
            it&apos;s really in someone&apos;s hands.
          </p>
          <div className="hero-actions flex flex-col sm:flex-row w-full gap-4">
            <Link href="/register" className="btn btn-primary btn-lg w-full sm:w-auto text-center justify-center">I want to give</Link>
            <Link href="/register" className="btn btn-ghost btn-lg w-full sm:w-auto text-center justify-center">I need help</Link>
          </div>
        </div>

        <div className="ticket self-center lg:justify-self-end" style={{ transform: "rotate(2.5deg)", maxWidth: 340 }}>
          <div className="ticket-top">
            <div>
              <div className="ticket-label">Match ticket</div>
              <div className="ticket-id">#MC-0417</div>
            </div>
            <div className="stamp">PICKUP READY</div>
          </div>
          <div className="ticket-row"><span>Donor</span><span>Basak Sari-Sari Store</span></div>
          <div className="ticket-row"><span>Recipient</span><span>P. Ramos household</span></div>
          <div className="ticket-row"><span>Contents</span><span>Rice, canned goods, milk</span></div>
          <div className="ticket-code">7Q3K&nbsp;9XM2</div>
          <div className="ticket-hint">Recipient enters this code on pickup to confirm</div>
        </div>
      </section>

      <section id="how-it-works" className="landing wrap py-12 lg:py-20">
        <div className="section-head">
          <div className="eyebrow">How it works</div>
          <h2>One app, three ways in.</h2>
          <p className="sub">Donors give, recipients ask, the city makes sure it lands where it&apos;s needed most.</p>
        </div>
        <div className="roles grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="role-card">
            <span className="tag">Donors</span>
            <h3>Give, and get recognized for it</h3>
            <ul>
              <li>Donate food or cash in a few taps</li>
              <li>Earn badges and climb the city leaderboard as you give</li>
              <li>Request help yourself, any time you need it</li>
            </ul>
          </div>
          <div className="role-card recipient">
            <span className="tag">Recipients</span>
            <h3>Ask for help, see what&apos;s available</h3>
            <ul>
              <li>Request food or cash assistance</li>
              <li>Browse what&apos;s currently available for pickup nearby</li>
              <li>Confirm every pickup with a one-time code</li>
            </ul>
          </div>
          <div className="role-card admin">
            <span className="tag">City Government</span>
            <h3>See everything, match it fairly</h3>
            <ul>
              <li>View every donation and request in one place</li>
              <li>Auto-match, prioritizing elderly, PWD, and infants first</li>
              <li>Pull an impact report anytime</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="trust-codes" className="landing wrap py-12 lg:py-20">
        <div className="section-head">
          <div className="eyebrow">Trust &amp; codes</div>
          <h2>Nothing counts until it&apos;s confirmed.</h2>
          <p className="sub">
            Every match gets a one-time code, like an OTP. No fake deliveries, no stolen donations.
          </p>
        </div>
        <div className="trust-wrap grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center bg-[var(--bg-deep)] border border-[var(--line)] rounded-2xl p-8 lg:p-14">
          <div className="flow w-full max-w-[32rem] mx-auto lg:mx-0 lg:justify-self-center">
            <div className="flow-step done">
              <div className="flow-num">1</div>
              <div className="flow-text">
                <h4>Donation and request are matched</h4>
                <p>The system pairs a donation with the recipient who needs it most right now.</p>
              </div>
            </div>
            <div className="flow-step done">
              <div className="flow-num">2</div>
              <div className="flow-text">
                <h4>A one-time code is generated</h4>
                <p>Both sides see a match ticket with a unique pickup code.</p>
              </div>
            </div>
            <div className="flow-step">
              <div className="flow-num">3</div>
              <div className="flow-text">
                <h4>Recipient enters the code on pickup</h4>
                <p>The code only works once, for this exact match.</p>
              </div>
            </div>
            <div className="flow-step">
              <div className="flow-num">4</div>
              <div className="flow-text">
                <h4>The ticket closes as delivered</h4>
                <p>The city&apos;s records update instantly.</p>
              </div>
            </div>
          </div>
          <div className="ticket justify-self-center self-center" style={{ transform: "rotate(-2deg)" }}>
            <div className="ticket-top">
              <div>
                <div className="ticket-label">Match ticket</div>
                <div className="ticket-id">#MC-0298</div>
              </div>
              <div className="stamp done">CONFIRMED</div>
            </div>
            <div className="ticket-row"><span>Donor</span><span>Anonymous cash gift</span></div>
            <div className="ticket-row"><span>Recipient</span><span>Lolo Vicente, 74</span></div>
            <div className="ticket-row"><span>Priority</span><span>Elderly — Tier 1</span></div>
            <div className="ticket-code" style={{ color: "var(--teal)" }}>CLAIMED</div>
            <div className="ticket-hint">Confirmed on-site, 2:14 PM</div>
          </div>
        </div>
      </section>

      <section id="leaderboard" className="landing wrap py-12 lg:py-20">
        <div className="section-head" style={{ margin: "0 auto clamp(2.5rem, 5vw, 3.5rem)", textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: "var(--kalamansi)" }}>
            Cebu City · Top donors
          </div>
          <h2>The city&apos;s biggest hearts.</h2>
        </div>

        <div className="public-leaderboard mx-auto w-full max-w-2xl bg-[var(--paper)] text-[var(--ink)] rounded-xl p-5 sm:p-6 lg:p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(0,0,0,0.04)]">
          <div className="lb-header grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 sm:gap-x-5 text-[11px] tracking-widest uppercase text-[var(--ink-soft)] border-b-2 border-dashed border-[rgba(28,42,34,0.15)] pb-3 mb-1">
            <div>Rank</div>
            <div>Donor</div>
          </div>

          {leaderboard.length === 0 ? (
            <p className="sub w-full py-6 text-center" style={{ margin: 0 }}>
              No confirmed cash donations yet — be the first name on this list.
            </p>
          ) : (
            leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`lb-row grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 sm:gap-x-5 items-center py-4 border-b border-[rgba(28,42,34,0.1)] ${entry.rank === 1 ? "top-rank" : ""} ${entry.rank <= 3 ? `rank-${entry.rank}` : ""}`}
              >
                <div className="rank-num justify-self-start">{entry.rank}</div>
                <div className="min-w-0">
                  <div className="name">{entry.name}</div>
                  {entry.badges.length > 0 && (
                    <div className="badges flex flex-wrap gap-2 mt-1.5">
                      {entry.badges.map((badge) => (
                        <span key={badge} className={`badge-pill font-mono ${badge}`}>
                          {badge === "bayani" ? "Bayani ng Barangay" : "First Harvest"}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="cta-band wrap py-12 lg:py-24">
        <div className="eyebrow" style={{ justifyContent: "center" }}>Join the network</div>
        <h2>Cebu City takes care of Cebu City.</h2>
        <div className="hero-actions flex flex-col sm:flex-row w-full gap-4 mt-8" style={{ justifyContent: "center" }}>
          <Link href="/register" className="btn btn-primary btn-lg w-full sm:w-auto text-center justify-center">I want to give</Link>
          <Link href="/register" className="btn btn-ghost btn-lg w-full sm:w-auto text-center justify-center">I need help</Link>
        </div>
      </section>

      <footer className="site">
        <div className="foot-wrap wrap">
          <p>PROJECT FOOSHA · Cebu City Food Assistance Network</p>
          <p>Built with the city, for the city.</p>
        </div>
      </footer>
    </div>
  );
}
