import { useEffect, useState } from "react";
import { getAnalyticsSnapshot } from "../../data/api";
import type { AnalyticsSnapshot } from "../../data/types";
import { LoadingState } from "../../components/Shared";

export default function Analytics() {
  const [s, setS] = useState<AnalyticsSnapshot | null>(null);

  useEffect(() => {
    getAnalyticsSnapshot().then(setS);
  }, []);

  if (!s) return <LoadingState />;

  const maxBarangay = Math.max(...s.matchesByBarangay.map((b) => b.matches));
  const maxPriority = Math.max(...Object.values(s.priorityMix));

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Insights</div>
          <h1>Network analytics</h1>
          <p className="sub">How the city's giving network is performing, at a glance.</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>Export as PDF</button>
      </div>

      <div className="filter-bar">
        <select><option>Last 30 days</option><option>Last 90 days</option><option>This quarter</option></select>
        <select><option>All barangays</option>{s.matchesByBarangay.map((b) => <option key={b.barangay}>{b.barangay}</option>)}</select>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="num">{s.householdsHelped}</div>
          <div className="lbl">Households helped</div>
          <span className="delta up">↑ 18% vs last period</span>
        </div>
        <div className="stat-card">
          <div className="num">₱{(s.totalValuePhp / 1000).toFixed(0)}K</div>
          <div className="lbl">Total value distributed</div>
          <span className="delta up">↑ 9% vs last period</span>
        </div>
        <div className="stat-card">
          <div className="num">{s.avgMatchTimeHours} hrs</div>
          <div className="lbl">Avg. time to match</div>
          <span className="delta up">↓ 22% faster</span>
        </div>
        <div className="stat-card">
          <div className="num">{s.confirmedWithin24hPct}%</div>
          <div className="lbl">Confirmed within 24h</div>
          <span className="delta down">↓ 2pt vs last period</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Food vs. cash</h3></div>
          <div className="donut-wrap">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="52" fill="none" stroke="var(--bg-deep)" strokeWidth="18" />
              <circle
                cx="70" cy="70" r="52" fill="none" stroke="var(--jeepney)" strokeWidth="18"
                strokeDasharray={`${(s.foodVsCash.food / 100) * 327} 327`}
                transform="rotate(-90 70 70)"
              />
              <circle
                cx="70" cy="70" r="52" fill="none" stroke="var(--kalamansi)" strokeWidth="18"
                strokeDasharray={`${(s.foodVsCash.cash / 100) * 327} 327`}
                strokeDashoffset={-((s.foodVsCash.food / 100) * 327)}
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="66" textAnchor="middle" fontFamily="Fraunces" fontWeight="800" fontSize="22" fill="var(--paper)">{s.foodVsCash.food}%</text>
              <text x="70" y="84" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill="#6f8377">food</text>
            </svg>
            <div>
              <div className="legend-item" style={{ marginBottom: 10 }}><span className="legend-dot" style={{ background: "var(--jeepney)" }} />Food · {s.foodVsCash.food}%</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: "var(--kalamansi)" }} />Cash · {s.foodVsCash.cash}%</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Priority tier mix</h3></div>
          {Object.entries(s.priorityMix).map(([tier, count]) => (
            <div className="hbar-row" key={tier}>
              <div className="hbar-top"><span className="nm" style={{ textTransform: "capitalize" }}>{tier}</span><span className="val">{count}</span></div>
              <div className="hbar-track"><div className="hbar-fill" style={{ width: `${(count / maxPriority) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <div className="panel-head"><h3>Matches by barangay</h3><span className="meta">This month</span></div>
        {s.matchesByBarangay.map((b) => (
          <div className="hbar-row" key={b.barangay}>
            <div className="hbar-top"><span className="nm">{b.barangay}</span><span className="val">{b.matches} matches</span></div>
            <div className="hbar-track"><div className="hbar-fill" style={{ width: `${(b.matches / maxBarangay) * 100}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <div className="panel-head"><h3>Top donors this period</h3></div>
        <table>
          <thead><tr><th>Donor</th><th>Given</th><th>Trend</th></tr></thead>
          <tbody>
            {s.topDonors.map((d, i) => (
              <tr key={d.name}>
                <td><span className="rank-dot">{i + 1}</span>{d.name}</td>
                <td>₱{d.givenPhp.toLocaleString()}</td>
                <td className={d.trendPct >= 0 ? "trend-up" : "trend-down"}>
                  {d.trendPct >= 0 ? "↑" : "↓"} {Math.abs(d.trendPct)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
