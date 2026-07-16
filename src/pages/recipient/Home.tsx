import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listRequests, listAvailableListings, getCurrentRecipient } from "../../data/api";
import type { HelpRequest, Donation, RecipientProfile } from "../../data/types";
import { StatCard, StatusChip, LoadingState, PriorityTag } from "../../components/Shared";

export default function RecipientHome() {
  const [recipient, setRecipient] = useState<RecipientProfile | null>(null);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [listings, setListings] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCurrentRecipient(), listRequests({ recipientId: "recipient-1" }), listAvailableListings()]).then(
      ([r, reqs, list]) => {
        setRecipient(r);
        setRequests(reqs);
        setListings(list.slice(0, 2));
        setLoading(false);
      }
    );
  }, []);

  if (loading || !recipient) return <LoadingState />;

  const active = requests.filter((r) => r.status !== "confirmed");
  const awaiting = requests.filter((r) => r.status === "awaiting_pickup").length;
  const matching = requests.filter((r) => r.status === "matching" || r.status === "unmatched").length;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Welcome back</div>
          <h1>Kamusta, {recipient.name}</h1>
          <p className="sub">Here's where your requests stand, and what's available nearby right now.</p>
        </div>
        <Link to="/recipient/request" className="btn btn-primary">+ Request help</Link>
      </div>

      <div className="priority-banner">
        <span className="tag-dot" />
        Your household is flagged <strong>&nbsp;<PriorityTag tier={recipient.priorityTier} />&nbsp;</strong> priority, so requests are matched faster.
      </div>

      <div className="stat-row" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <StatCard num={awaiting} label="Awaiting pickup" />
        <StatCard num={matching} label="Matching now" />
        <StatCard num={recipient.confirmedAllTime} label="Confirmed all-time" />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3>Your active requests</h3>
            <Link to="/recipient/history">View all</Link>
          </div>
          {active.length === 0 ? (
            <p className="sub">No active requests — request help whenever you need it.</p>
          ) : (
            active.map((r) => (
              <div className="row-item" key={r.id}>
                <div>
                  <div className="name">{r.description}</div>
                  <div className="meta">{r.matchedDonationId ? `Ticket #${r.ticketId}` : "Looking for a match"}</div>
                </div>
                <StatusChip status={r.status} />
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Available nearby</h3></div>
          {listings.map((l) => (
            <div className="listing-card" key={l.id}>
              <div className="listing-top">
                <div>
                  <div className="name">{l.description}</div>
                  <div className="from">from {l.donorName}</div>
                </div>
                <div className="listing-dist">{l.distanceKm ? `${l.distanceKm} km` : ""}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <Link to="/recipient/browse" className="btn btn-ghost btn-block">Browse all listings</Link>
          </div>
        </div>
      </div>
    </>
  );
}
