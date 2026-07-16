import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDonations, getCurrentDonor } from "../../data/api";
import type { Donation, DonorProfile } from "../../data/types";
import { StatCard, StatusChip, LoadingState } from "../../components/Shared";
import { BADGES } from "../../data/seed";
import { useAuth } from "../../context/AuthContext";

// Seeded activity items — in production, these would come from a real activity log
const ACTIVITY_FEED = [
  { type: "give", title: "You donated Rice, canned goods, milk", meta: "2 days ago · Barangay Basak", delay: 0 },
  { type: "match", title: "Matched with P. Ramos household", meta: "2 days ago · Ticket #MC-0417", delay: 0.07 },
  { type: "give", title: "You donated ₱1,200 cash gift", meta: "3 days ago · Barangay Basak", delay: 0.14 },
  { type: "confirm", title: "Pickup confirmed by Lolo Vicente", meta: "5 days ago · Ticket #MC-0298", delay: 0.21 },
  { type: "badge", title: "Earned badge: Bayani ng Barangay", meta: "1 week ago · 25 matches milestone", delay: 0.28 },
];

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCurrentDonor(), listDonations({ donorId: "donor-1" })]).then(([d, dons]) => {
      setDonor(d);
      setDonations(dons);
      setLoading(false);
    });
  }, []);

  if (loading || !donor) return <LoadingState />;

  const active = donations.filter((d) => d.status !== "confirmed").slice(0, 4);
  const awaitingCount = donations.filter((d) => d.status === "awaiting_pickup").length;
  const earnedBadges = BADGES.filter((b) => donor.badges.includes(b.id));
  const nextBadge = BADGES.find((b) => !donor.badges.includes(b.id) && b.thresholdMatches > donor.matchesCount);

  // Use logged-in user's name if available, fall back to seed donor name
  const displayName = user?.name ?? donor.name;
  const initials = user?.avatarInitials ?? donor.avatarInitials;

  return (
    <>
      {/* Welcome card */}
      <div className="welcome-card">
        <div className="welcome-text">
          <div className="eyebrow">Welcome back</div>
          <h1>Kamusta, {displayName}</h1>
          <p className="sub">Here's what's happening with your giving this month.</p>
        </div>
        <div className="welcome-avatar">{initials}</div>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <Link to="/donor/new" className="quick-action">
          <div className="qa-icon give">🎁</div>
          <div>
            <div className="qa-label">New donation</div>
            <div className="qa-sub">Give food or cash</div>
          </div>
        </Link>
        <Link to="/donor/history" className="quick-action">
          <div className="qa-icon history">📋</div>
          <div>
            <div className="qa-label">My donations</div>
            <div className="qa-sub">View full history</div>
          </div>
        </Link>
        <Link to="/donor/badges" className="quick-action">
          <div className="qa-icon badges">🏅</div>
          <div>
            <div className="qa-label">Badges & rank</div>
            <div className="qa-sub">#{donor.cityRank} in city</div>
          </div>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stat-row stagger">
        <StatCard num={donor.matchesCount} label="Matches this month" />
        <StatCard num={`₱${donor.totalGivenPhp.toLocaleString()}`} label="Total given" />
        <StatCard num={awaitingCount} label="Awaiting pickup" />
        <StatCard num={`#${donor.cityRank}`} label="City rank" />
      </div>

      <div className="grid-2">
        {/* Active pledges */}
        <div className="panel slide-up">
          <div className="panel-head">
            <h3>Active pledges</h3>
            <Link to="/donor/history">View all</Link>
          </div>
          {active.length === 0 ? (
            <p className="sub">No active pledges right now — give something to get started.</p>
          ) : (
            active.map((d) => (
              <div className="row-item" key={d.id}>
                <div>
                  <div className="name">{d.description}</div>
                  <div className="meta">
                    {d.matchedRequestId ? `Ticket #${d.ticketId}` : "Waiting to be matched"}
                  </div>
                </div>
                <StatusChip status={d.status} />
              </div>
            ))
          )}
        </div>

        {/* Standing + activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="panel slide-up" style={{ animationDelay: ".08s" }}>
            <div className="panel-head"><h3>Your standing</h3></div>
            <div className="rank-card">
              <div className="rank-num">#{donor.cityRank}</div>
              <div className="rank-sub">Top donor in Barangay {donor.barangay}</div>
            </div>
            {nextBadge && (
              <>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, (donor.matchesCount / nextBadge.thresholdMatches) * 100)}%` }}
                  />
                </div>
                <div className="progress-lbl" style={{ fontSize: 12, color: "var(--paper-dim)", display: "flex", justifyContent: "space-between" }}>
                  <span>{donor.matchesCount} matches</span>
                  <span>{nextBadge.thresholdMatches - donor.matchesCount} to "{nextBadge.name}"</span>
                </div>
              </>
            )}
            <div className="badge-row">
              {earnedBadges.map((b) => (
                <span className="badge earned" key={b.id}>{b.name}</span>
              ))}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="panel slide-up" style={{ animationDelay: ".16s" }}>
            <div className="panel-head"><h3>Recent activity</h3></div>
            <div className="activity-timeline">
              {ACTIVITY_FEED.map((item, i) => (
                <div className="timeline-item" key={i} style={{ animationDelay: `${item.delay + 0.2}s` }}>
                  <div className={`timeline-dot ${item.type}`} />
                  <div className="timeline-text">
                    <div className="tl-title">{item.title}</div>
                    <div className="tl-meta">{item.meta}</div>
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
