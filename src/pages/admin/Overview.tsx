import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminOverviewStats,
  listTickets,
  listRequests,
  getLeaderboard,
  confirmPickup,
} from "../../data/api";
import type {
  AdminOverviewStats,
  MatchTicket,
  HelpRequest,
  LeaderboardEntry,
} from "../../data/types";
import { PriorityTag, LoadingState } from "../../components/Shared";

// Priority sort order: vulnerable populations first
const TIER_ORDER: Record<string, number> = { elderly: 0, pwd: 1, infant: 2, general: 3 };

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [queue, setQueue] = useState<MatchTicket[]>([]);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [verified, setVerified] = useState<MatchTicket[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP verification state
  const [otpTickets, setOtpTickets] = useState<MatchTicket[]>([]);
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpErrors, setOtpErrors] = useState<Record<string, string>>({});
  const [justConfirmed, setJustConfirmed] = useState<Set<string>>(new Set());

  async function loadData() {
    const [s, tickets, reqs, lb] = await Promise.all([
      getAdminOverviewStats(),
      listTickets(),
      listRequests(),
      getLeaderboard(),
    ]);
    setStats(s);
    setRequests(reqs);

    // Matching Queue: tickets that are paired but waiting for pickup/dispatch
    setQueue(tickets.filter((t) => t.status === "awaiting_pickup").slice(0, 5));

    // OTP verification: all awaiting_pickup tickets available for admin to verify
    setOtpTickets(tickets.filter((t) => t.status === "awaiting_pickup"));

    // Verification Tracker: recently confirmed tickets
    setVerified(tickets.filter((t) => t.status === "confirmed").slice(0, 4));

    setLeaderboard(lb.slice(0, 5));
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Look up the priority tier for a ticket by matching its requestId to the requests list
  function getTierForTicket(ticket: MatchTicket): string {
    const req = requests.find((r) => r.id === ticket.requestId);
    return req?.priorityTier ?? "general";
  }

  // Handle OTP verification from the admin side
  async function handleOtpVerify(ticketId: string) {
    const code = otpInputs[ticketId]?.trim();
    if (!code) {
      setOtpErrors((prev) => ({ ...prev, [ticketId]: "Enter the code" }));
      return;
    }
    const result = await confirmPickup(ticketId, code);
    if (!result.success) {
      setOtpErrors((prev) => ({ ...prev, [ticketId]: result.message }));
      return;
    }
    // Success: flash the confirmed animation and reload
    setOtpErrors((prev) => {
      const next = { ...prev };
      delete next[ticketId];
      return next;
    });
    setJustConfirmed((prev) => new Set(prev).add(ticketId));
    setTimeout(() => {
      setJustConfirmed((prev) => {
        const next = new Set(prev);
        next.delete(ticketId);
        return next;
      });
      loadData();
    }, 1500);
  }

  if (loading || !stats) return <LoadingState />;

  // Compute pending vs completed for the impact widget
  const totalPending = stats.pendingMatches;
  const totalDelivered = stats.deliveredThisMonth;
  const totalAll = totalPending + totalDelivered;
  const deliveredPct = totalAll > 0 ? Math.round((totalDelivered / totalAll) * 100) : 0;
  const circumference = 2 * Math.PI * 40;

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

        {/* Deliveries Card with Ring Chart */}
        <div className="admin-stat-card">
          <h4>Delivery Performance</h4>
          <div className="delivery-summary">
            <div className="delivery-ring">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-deep)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="var(--teal)" strokeWidth="10"
                  strokeDasharray={`${(deliveredPct / 100) * circumference} ${circumference}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="var(--jeepney)" strokeWidth="10"
                  strokeDasharray={`${((100 - deliveredPct) / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-((deliveredPct / 100) * circumference)}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="delivery-ring-label">
                <div className="ring-num">{deliveredPct}%</div>
                <div className="ring-sub">delivered</div>
              </div>
            </div>
            <div className="delivery-legend">
              <div className="delivery-legend-item">
                <div className="delivery-legend-dot" style={{ background: "var(--teal)" }} />
                <span>Confirmed: <strong>{totalDelivered}</strong></span>
              </div>
              <div className="delivery-legend-item">
                <div className="delivery-legend-dot" style={{ background: "var(--jeepney)" }} />
                <span>Pending: <strong>{totalPending}</strong></span>
              </div>
              <div className="delivery-legend-item" style={{ marginTop: 4, fontSize: 12, color: "var(--paper-dim)" }}>
                {stats.confirmedWithin24hPct}% verified within 24h
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        {/* Left Column: Logistics + OTP Verification */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* Priority Matching Queue — now with real priority tiers */}
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
                  {queue
                    .sort((a, b) => (TIER_ORDER[getTierForTicket(a)] ?? 3) - (TIER_ORDER[getTierForTicket(b)] ?? 3))
                    .map((t) => {
                      const tier = getTierForTicket(t);
                      return (
                        <tr key={t.id}>
                          <td>
                            <div className="td-primary">{t.recipientName}</div>
                            <div style={{ marginTop: 6 }}>
                              <PriorityTag tier={tier as "elderly" | "pwd" | "infant" | "general"} />
                            </div>
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
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>

          {/* OTP Security Verification Interface */}
          <div className="otp-verify-panel">
            <div className="panel-head">
              <h3>OTP Security Verification</h3>
              <span className="status-chip awaiting_pickup" style={{ background: "rgba(199,217,77,0.1)", border: "1px solid rgba(199,217,77,0.3)" }}>
                {otpTickets.length} awaiting code
              </span>
            </div>
            <div className="otp-ticket-list">
              {otpTickets.length === 0 ? (
                <p className="sub" style={{ padding: "24px" }}>No tickets awaiting OTP verification.</p>
              ) : (
                otpTickets.map((ticket) => (
                  <div
                    className={`otp-ticket-item${justConfirmed.has(ticket.id) ? " just-confirmed" : ""}`}
                    key={ticket.id}
                  >
                    <div className="otp-ticket-info">
                      <div className="otp-ticket-id">Ticket #{ticket.id}</div>
                      <div className="otp-names">
                        {ticket.donorName} → {ticket.recipientName}
                      </div>
                      <div className="otp-contents">{ticket.contents}</div>
                    </div>
                    {justConfirmed.has(ticket.id) ? (
                      <div className="otp-confirmed-label">✓ Confirmed</div>
                    ) : (
                      <div>
                        <div className="otp-input-wrap">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="CODE"
                            value={otpInputs[ticket.id] ?? ""}
                            onChange={(e) =>
                              setOtpInputs((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleOtpVerify(ticket.id);
                            }}
                          />
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOtpVerify(ticket.id)}
                          >
                            Verify
                          </button>
                        </div>
                        {otpErrors[ticket.id] && (
                          <div className="otp-error">{otpErrors[ticket.id]}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
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
