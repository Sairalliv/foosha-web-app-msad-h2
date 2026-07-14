import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <header className="site">
        <nav className="site">
          <img className="logo-mark" style={{ marginBottom: 0, height: 30 }} src={`${import.meta.env.BASE_URL}assets/foosha-logo.png`} alt="Foosha" />
          <div className="navlinks">
            <a href="#roles">How it works</a>
            <a href="#trust">Trust &amp; codes</a>
            <a href="#board">Leaderboard</a>
          </div>
          <div className="nav-cta">
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/login" className="btn btn-primary">Get the app</Link>
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
            Give food or cash, ask for help when you're short, and let the city match it fairly — elderly, PWD, and
            infants first. Every handoff is sealed with a one-time code, so nothing gets marked done until it's
            really in someone's hands.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">I want to give</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">I need help</Link>
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

      <section id="roles" className="landing wrap">
        <div className="section-head">
          <div className="eyebrow">How it works</div>
          <h2>One app, three ways in.</h2>
          <p className="sub">Donors give, recipients ask, the city makes sure it lands where it's needed most.</p>
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
            <h3>Ask for help, see what's available</h3>
            <ul>
              <li>Request food or cash assistance</li>
              <li>Browse what's currently available for pickup nearby</li>
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

      <section id="trust" className="landing wrap">
        <div className="section-head">
          <div className="eyebrow">Trust &amp; codes</div>
          <h2>Nothing counts until it's confirmed.</h2>
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
                <p>The city's records update instantly.</p>
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

      <section className="cta-band wrap">
        <div className="eyebrow" style={{ justifyContent: "center" }}>Join the network</div>
        <h2>Mandaue takes care of Mandaue.</h2>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <Link to="/login" className="btn btn-primary btn-lg">I want to give</Link>
          <Link to="/login" className="btn btn-ghost btn-lg">I need help</Link>
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
