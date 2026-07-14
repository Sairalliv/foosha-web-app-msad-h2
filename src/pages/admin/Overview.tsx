import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminOverviewStats,
  listTickets,
  getLeaderboard,
} from "../../data/api";
import type {
  AdminOverviewStats,
  MatchTicket,
  LeaderboardEntry,
} from "../../data/types";
import { PriorityTag, LoadingState } from "../../components/Shared";

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [queue, setQueue] = useState<MatchTicket[]>([]);
  const [verified, setVerified] = useState<MatchTicket[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminOverviewStats(),
      listTickets(),
      getLeaderboard(),
    ]).then(([s, tickets, lb]) => {
      setStats(s);
      
      // Matching Queue: tickets that are paired but waiting for pickup/dispatch
      setQueue(tickets.filter((t) => t.status === "awaiting_pickup").slice(0, 5));
      
      // Verification Tracker: recently confirmed tickets
      // In a real app we'd sort by confirmedAt descending, here we just filter
      setVerified(tickets.filter((t) => t.status === "confirmed").slice(0, 4));
      
      setLeaderboard(lb.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading || !stats) return <LoadingState />;

  return (
    <>
      <div className="page-head" style={{ marginBottom: 24 }}>
        <div>
          <div className="eyebrow">City-wide overview</div>
          <h1>Logistics & Verification</h1>
          <p className="sub">Real-time view of supply, demand, and secure handovers across Mandaue.</p>
        </div>
        <Link to="/admin/queue" className="btn btn-primary">Process matches</Link>
      </div>

      {/* Advanced Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 32 }}>
        
        {/* Active Requests Card */}
        <div className="admin-stat-card urgent">
          <h4>Total Active Requests</h4>
          <div className="primary-num">{stats.activeRequestsTotal}</div>
          <div className="stat-breakdown">
            <span className="stat-pill elderly">Elderly <span className="val">{stats.activeRequestsElderly}</span></span>
            <span className="stat-pill pwd">PWD <span className="val">{stats.activeRequestsPWD}</span></span>
            <span className="stat-pill infant">Infant <span className="val">{stats.activeRequestsInfant}</span></span>
          </div>
        </div>

        {/* Donations Split Card */}
        <div className="admin-stat-card">
          <h4>Donations Received (This Month)</h4>
          <div className="double-stat-wrap">
            <div className="half-stat">
              <div className="primary-num">{stats.foodDonationsCount}</div>
              <div className="sub-label">Food Items</div>
            </div>
            <div className="half-stat cash">
              <div className="primary-num">₱{(stats.cashDonationsTotal / 1000).toFixed(1)}K</div>
              <div className="sub-label">Cash Total</div>
            </div>
          </div>
        </div>

        {/* Deliveries Card */}
        <div className="admin-stat-card">
          <h4>Successful Deliveries</h4>
          <div className="primary-num" style={{ color: "var(--paper)" }}>{stats.deliveredThisMonth}</div>
          <div className="stat-breakdown">
            <span className="stat-pill" style={{ background: "rgba(143,184,168,0.15)", color: "var(--teal)" }}>
              {stats.confirmedWithin24hPct}% verified within 24h
            </span>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        {/* Left Column: Logistics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* Priority Matching Queue */}
          <div className="admin-table-panel">
            <div className="panel-head">
              <h3>Priority Matching Queue</h3>
              <Link to="/admin/queue">View all ({stats.pendingMatches})</Link>
            </div>
            {queue.length === 0 ? (
              <p className="sub" style={{ padding: "24px" }}>Queue is clear. No pending matches right now.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Requestor / Priority</th>
                    <th>Matched Donor</th>
                    <th>Item Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="td-primary">{t.recipientName}</div>
                        <div style={{ marginTop: 6 }}><PriorityTag tier="elderly" /></div> {/* Mocking tier as Elderly for UI since ticket doesn't store tier directly */}
                      </td>
                      <td>
                        <div className="td-primary">{t.donorName}</div>
                        <div className="td-secondary">Ticket: #{t.id}</div>
                      </td>
                      <td>
                        <div className="td-primary">{t.contents}</div>
                      </td>
                      <td>
                        <span className="status-chip awaiting_pickup">Pending Dispatch</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Verification Tracker */}
          <div className="admin-table-panel">
            <div className="panel-head">
              <h3>Live Verification Tracker</h3>
              <span className="status-chip confirmed" style={{ background: "rgba(143,184,168,0.1)", border: "1px solid rgba(143,184,168,0.3)" }}>Real-time updates</span>
            </div>
            <div className="verification-feed">
              {verified.map((v) => (
                <div className="feed-item" key={v.id}>
                  <div className="feed-icon">✓</div>
                  <div className="feed-content">
                    <p>
                      <strong>{v.recipientName}</strong> successfully received donation from <strong>{v.donorName}</strong>.
                    </p>
                    <div className="feed-meta">
                      <span>{v.contents}</span>
                      <span>·</span>
                      <span className="ticket-ref">Ticket #{v.id}</span>
                      <span>·</span>
                      <span>Confirmed via OTP</span>
                    </div>
                  </div>
                </div>
              ))}
              {verified.length === 0 && <p className="sub">No recent verifications.</p>}
            </div>
          </div>

        </div>

        {/* Right Column: Leaderboard */}
        <div>
          <div className="leaderboard-widget">
            <div className="eyebrow">Community Engagement</div>
            <h3>Top Donors Leaderboard</h3>
            <div className="lb-list">
              {leaderboard.map((lb, index) => (
                <div className="lb-item" key={lb.donorId}>
                  <div className="lb-rank">{index + 1}</div>
                  <div className="lb-info">
                    <div className="lb-name">{lb.name}</div>
                    <div className="lb-amount">₱{lb.totalGivenPhp.toLocaleString()} · {lb.matchesCount} matches</div>
                    {lb.badgeIds.length > 0 && (
                      <div className="lb-badges">
                        {lb.badgeIds.map((bId) => (
                          <div className="lb-badge-icon" key={bId} title={bId}>
                            {bId === "first-harvest" ? "🌱" : "🏅"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
