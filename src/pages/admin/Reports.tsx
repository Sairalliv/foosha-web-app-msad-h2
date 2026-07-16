import { useEffect, useState } from "react";
import { getAnalyticsSnapshot } from "../../data/api";
import type { AnalyticsSnapshot } from "../../data/types";
import { LoadingState } from "../../components/Shared";

export default function AdminReports() {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);

  useEffect(() => {
    getAnalyticsSnapshot().then(setSnapshot);
  }, []);

  if (!snapshot) return <LoadingState />;

  // Calculate percentages for the breakdown charts
  const totalMix = Object.values(snapshot.priorityMix).reduce((a, b) => a + b, 0);
  const elderlyPct = Math.round((snapshot.priorityMix.elderly / totalMix) * 100);
  const pwdPct = Math.round((snapshot.priorityMix.pwd / totalMix) * 100);
  const infantPct = Math.round((snapshot.priorityMix.infant / totalMix) * 100);
  
  // Pending vs Delivered 
  // We approximate total matches for the month based on households helped + a pending factor
  const totalMatches = snapshot.householdsHelped + 42; // mock pending
  const deliveredPct = Math.round((snapshot.householdsHelped / totalMatches) * 100);
  const pendingPct = 100 - deliveredPct;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Reports &amp; impact</div>
          <h1>City impact report</h1>
          <p className="sub">Pull a snapshot of the network's impact for any date range or barangay.</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>Export as PDF</button>
      </div>

      <div className="filter-bar">
        <select><option>Last 30 days</option><option>This quarter</option><option>Year to date</option></select>
        <select><option>All barangays</option><option>Basak</option><option>Tipolo</option><option>Subangdaku</option></select>
        <select><option>Food + cash</option><option>Food only</option><option>Cash only</option></select>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="num">{snapshot.householdsHelped}</div>
          <div className="lbl">Households helped</div>
        </div>
        <div className="stat-card">
          <div className="num">₱{(snapshot.totalValuePhp / 1000).toFixed(0)}K</div>
          <div className="lbl">Total value distributed</div>
        </div>
        <div className="stat-card">
          <div className="num">{snapshot.avgMatchTimeHours}h</div>
          <div className="lbl">Avg. time to match</div>
        </div>
        <div className="stat-card">
          <div className="num">{snapshot.confirmedWithin24hPct}%</div>
          <div className="lbl">Confirmation rate</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Pending vs Completed Deliveries */}
        <div className="panel">
          <div className="panel-head"><h3>Fulfillment Status</h3></div>
          <div className="hbar-row">
            <div className="hbar-top">
              <span className="nm">Completed (Confirmed)</span>
              <span className="val">{deliveredPct}%</span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: `${deliveredPct}%`, background: "linear-gradient(90deg, var(--teal), #a2c6b7)" }} />
            </div>
          </div>
          <div className="hbar-row" style={{ marginTop: 24 }}>
            <div className="hbar-top">
              <span className="nm">Pending Dispatch/Pickup</span>
              <span className="val">{pendingPct}%</span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill alt" style={{ width: `${pendingPct}%` }} />
            </div>
          </div>
        </div>

        {/* Priority Tier Distribution */}
        <div className="panel">
          <div className="panel-head"><h3>Priority Distribution</h3></div>
          <div className="hbar-row">
            <div className="hbar-top">
              <span className="nm" style={{ color: "var(--kalamansi)" }}>Elderly (Tier 1)</span>
              <span className="val">{elderlyPct}%</span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: `${elderlyPct}%` }} />
            </div>
          </div>
          <div className="hbar-row" style={{ marginTop: 16 }}>
            <div className="hbar-top">
              <span className="nm" style={{ color: "#ff8a63" }}>PWD (Tier 1)</span>
              <span className="val">{pwdPct}%</span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: `${pwdPct}%`, background: "linear-gradient(90deg, #ff8a63, var(--jeepney-dark))" }} />
            </div>
          </div>
          <div className="hbar-row" style={{ marginTop: 16 }}>
            <div className="hbar-top">
              <span className="nm" style={{ color: "var(--teal)" }}>Infant (Tier 1)</span>
              <span className="val">{infantPct}%</span>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: `${infantPct}%`, background: "linear-gradient(90deg, var(--teal), #a2c6b7)" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Donations matched per week</h3></div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 160, padding: "16px 0" }}>
          {[55, 72, 64, 90, 100].map((h, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  height: `${h}%`,
                  borderRadius: "6px 6px 0 0",
                  background: i === 4 ? "linear-gradient(180deg, var(--jeepney), var(--jeepney-dark))" : "linear-gradient(180deg, var(--kalamansi), #a9c23e)",
                }}
              />
              <div style={{ textAlign: "center", fontSize: 11, color: "var(--paper-dim)", marginTop: 8, fontFamily: "var(--font-mono)" }}>
                Wk {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
