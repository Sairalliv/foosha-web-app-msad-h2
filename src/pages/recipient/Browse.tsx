import { useEffect, useState } from "react";
import { listAvailableListings, createRequest } from "../../data/api";
import { CURRENT_RECIPIENT } from "../../data/seed";
import type { Donation } from "../../data/types";
import { LoadingState, EmptyState } from "../../components/Shared";

export default function Browse() {
  const [listings, setListings] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  useEffect(() => {
    listAvailableListings().then((l) => {
      setListings(l);
      setLoading(false);
    });
  }, []);

  async function handleRequest(listing: Donation) {
    setRequestedIds((prev) => [...prev, listing.id]);
    await createRequest({
      recipientId: CURRENT_RECIPIENT.id,
      recipientName: CURRENT_RECIPIENT.name,
      kind: listing.kind,
      description: listing.description,
      amountPhp: listing.amountPhp,
      barangay: CURRENT_RECIPIENT.barangay,
      priorityTier: CURRENT_RECIPIENT.priorityTier,
    });
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Available now</div>
          <h1>Browse what's ready for pickup</h1>
          <p className="sub">These donations are unclaimed and near you. Claiming still goes through the city's matching system.</p>
        </div>
      </div>

      <div className="panel">
        {loading ? (
          <LoadingState />
        ) : listings.length === 0 ? (
          <EmptyState label="Nothing unclaimed right now — check back soon." />
        ) : (
          listings.map((l) => {
            const requested = requestedIds.includes(l.id);
            return (
              <div className="listing-card" key={l.id}>
                <div className="listing-top">
                  <div>
                    <div className="name">{l.description}</div>
                    <div className="from">from {l.donorName}{l.distanceKm ? ` · ${l.distanceKm} km` : ""}</div>
                  </div>
                </div>
                <div className="listing-actions">
                  <button className="btn btn-primary btn-sm" disabled={requested} onClick={() => handleRequest(l)}>
                    {requested ? "Requested ✓" : "Request this"}
                  </button>
                  <button className="btn btn-ghost btn-sm" type="button">Details</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
