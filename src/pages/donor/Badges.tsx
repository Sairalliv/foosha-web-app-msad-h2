import { useEffect, useState } from "react";
import { getLeaderboard, getCurrentDonor } from "../../data/api";
import { BADGES } from "../../data/seed";
import type { LeaderboardEntry, DonorProfile } from "../../data/types";
import { LoadingState } from "../../components/Shared";

export default function DonorBadges() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLeaderboard(), getCurrentDonor()]).then(([lb, d]) => {
      setLeaderboard(lb);
      setDonor(d);
      setLoading(false);
    });
  }, []);

  if (loading || !donor) return <LoadingState />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Recognition</div>
          <h1>Badges &amp; city rank</h1>
          <p className="sub">Keep giving to unlock the next badge and climb the leaderboard.</p>
        </div>
      </div>

      <div className="badge-grid">
        {BADGES.map((b) => {
          const earned = donor.badges.includes(b.id);
          return (
            <div className={`badge-tile${earned ? "" : " locked"}`} key={b.id}>
              <div className="badge-icon">✦</div>
              <h4>{b.name}</h4>
              <p>{b.description}</p>
            </div>
          );
        })}
      </div>

      <div className="panel" style={{ marginTop: 28 }}>
        <div className="panel-head"><h3>City leaderboard — this month</h3></div>
        <div className="leader-list">
          {leaderboard.map((entry, i) => (
            <div className={`lrow${entry.donorId === donor.id ? " you" : ""}`} key={entry.donorId}>
              <div className="rk">{String(i + 1).padStart(2, "0")}</div>
              <div className="nm">{entry.name}{entry.donorId === donor.id ? " (you)" : ""}</div>
              <div className="pt">₱{entry.totalGivenPhp.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
