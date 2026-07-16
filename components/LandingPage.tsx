import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div>
      <header className="site">
        <nav className="site">
          <Image
            className="logo-mark"
            style={{ marginBottom: 0, height: 30, width: "auto" }}
            src="/assets/foosha-logo.png"
            alt="Foosha"
            width={712}
            height={201}
            priority
          />
          <div className="navlinks">
            <a href="#how-it-works">How it works</a>
            <a href="#trust-codes">Trust &amp; codes</a>
            <a href="#leaderboard">Leaderboard</a>
          </div>
          <div className="nav-cta">
            <Link href="/login" className="btn btn-ghost">Log in</Link>
            <Link href="/register" className="btn btn-primary">Get the app</Link>
          </div>
        </nav>
      </header>

      <section className="hero wrap">
        <div>
          <div className="eyebrow">Mandaue City Food Assistance Network</div>
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
          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary btn-lg">I want to give</Link>
            <Link href="/register" className="btn btn-ghost btn-lg">I need help</Link>
          </div>
        </div>

        <div className="ticket" style={{ transform: "rotate(2.5deg)", maxWidth: 340, marginLeft: "auto" }}>
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

      <section id="how-it-works" className="landing wrap">
        <div className="section-head">
          <div className="eyebrow">How it works</div>
          <h2>One app, three ways in.</h2>
          <p className="sub">Donors give, recipients ask, the city makes sure it lands where it&apos;s needed most.</p>
        </div>
        <div className="roles">
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

      <section id="trust-codes" className="landing wrap">
        <div className="section-head">
          <div className="eyebrow">Trust &amp; codes</div>
          <h2>Nothing counts until it&apos;s confirmed.</h2>
          <p className="sub">
            Every match gets a one-time code, like an OTP. No fake deliveries, no stolen donations.
          </p>
        </div>
        <div className="trust-wrap">
          <div className="flow">
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
          <div className="ticket" style={{ transform: "rotate(-2deg)", margin: "0 auto" }}>
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

      <section id="leaderboard" className="landing wrap">
        <div className="section-head" style={{ marginBottom: 40, margin: "0 auto 48px", textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: "var(--kalamansi)" }}>
            Mandaue City · Top donors this month
          </div>
          <h2>The city&apos;s biggest hearts.</h2>
        </div>

        <div className="public-leaderboard">
          <div className="lb-header">
            <div>Rank</div>
            <div>Donor</div>
            <div style={{ textAlign: "right" }}>Lifetime Given</div>
          </div>

          <div className="lb-row top-rank">
            <div className="rank-num">1</div>
            <div>
              <div className="name">Basak Sari-Sari Store</div>
              <div className="badges">
                <span className="badge-pill bayani">Bayani ng Barangay</span>
                <span className="badge-pill first">First Harvest</span>
              </div>
            </div>
            <div className="amount">₱18,400</div>
          </div>

          <div className="lb-row">
            <div className="rank-num">2</div>
            <div>
              <div className="name">Dela Peña Family</div>
              <div className="badges">
                <span className="badge-pill first">First Harvest</span>
              </div>
            </div>
            <div className="amount">₱11,050</div>
          </div>

          <div className="lb-row">
            <div className="rank-num">3</div>
            <div>
              <div className="name">Tipolo Bakeshop</div>
              <div className="badges">
                <span className="badge-pill first">First Harvest</span>
              </div>
            </div>
            <div className="amount">₱7,900</div>
          </div>

          <div className="lb-row">
            <div className="rank-num">4</div>
            <div>
              <div className="name">Subangdaku Rotary Club</div>
            </div>
            <div className="amount">₱6,200</div>
          </div>

          <div className="lb-row">
            <div className="rank-num">5</div>
            <div>
              <div className="name">M. Fernandez</div>
            </div>
            <div className="amount">₱4,850</div>
          </div>
        </div>
      </section>

      <section className="cta-band wrap">
        <div className="eyebrow" style={{ justifyContent: "center" }}>Join the network</div>
        <h2>Mandaue takes care of Mandaue.</h2>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <Link href="/register" className="btn btn-primary btn-lg">I want to give</Link>
          <Link href="/register" className="btn btn-ghost btn-lg">I need help</Link>
        </div>
      </section>

      <footer className="site">
        <div className="foot-wrap wrap">
          <p>PROJECT FOOSHA · Mandaue City Food Assistance Network</p>
          <p>Built with the city, for the city.</p>
        </div>
      </footer>
    </div>
  );
}
