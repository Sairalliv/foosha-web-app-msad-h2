import { useEffect, useState } from "react";
import { listUnmatchedDonations, listUnmatchedRequests, confirmMatch } from "../../data/api";
import type { Donation, HelpRequest, MatchTicket } from "../../data/types";
import { PriorityTag, LoadingState, EmptyState, TicketStub } from "../../components/Shared";

// Priority sort order: vulnerable populations first
const TIER_ORDER: Record<string, number> = { elderly: 0, pwd: 1, infant: 2, general: 3 };

export default function AdminQueue() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [lastTicket, setLastTicket] = useState<MatchTicket | null>(null);

  async function refresh() {
    const [d, r] = await Promise.all([listUnmatchedDonations(), listUnmatchedRequests()]);
    setDonations(d);
    // Sort requests: vulnerable populations first
    const sorted = [...r].sort((a, b) => (TIER_ORDER[a.priorityTier] ?? 3) - (TIER_ORDER[b.priorityTier] ?? 3));
    setRequests(sorted);
    setSelectedDonation(d[0] ?? null);
    setSelectedRequest(sorted[0] ?? null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleConfirmMatch() {
    if (!selectedDonation || !selectedRequest) return;
    setConfirming(true);
    const ticket = await confirmMatch(selectedDonation.id, selectedRequest.id);
    setLastTicket(ticket);
    setConfirming(false);
    await refresh();
    // Clear the ticket stub after 8 seconds
    setTimeout(() => setLastTicket(null), 8000);
  }

  if (loading) return <LoadingState />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Matching queue</div>
          <h1>Match donations to requests</h1>
          <p className="sub">
            Pick one from each side, then confirm — this issues a real match ticket with a one-time pickup code.
            Requests are sorted by priority: Elderly → PWD → Infant → General.
          </p>
        </div>
      </div>

      {/* Show the generated match ticket stub after confirmation */}
      {lastTicket && (
        <div style={{ maxWidth: 380, margin: "0 auto 32px" }}>
          <TicketStub
            ticketId={lastTicket.id}
            rows={[
              { label: "Donor", value: lastTicket.donorName },
              { label: "Recipient", value: lastTicket.recipientName },
              { label: "Contents", value: lastTicket.contents },
            ]}
            stamp="PICKUP READY"
            code={lastTicket.code}
            codeLabel="Recipient enters this code on pickup to confirm"
          />
        </div>
      )}

      <div className="queue-cols">
        <div>
          <div className="queue-col-head">
            <h3>Pending donations</h3>
            <span>{donations.length} unmatched</span>
          </div>
          {donations.length === 0 ? (
            <EmptyState label="No pending donations." />
          ) : (
            donations.map((d) => (
              <div
                className={`queue-item${selectedDonation?.id === d.id ? " selected" : ""}`}
                key={d.id}
                onClick={() => setSelectedDonation(d)}
              >
                <div className="nm">{d.description}</div>
                <div className="meta">
                  from {d.donorName} · Barangay {d.barangay}
                  <span className={`kind-badge ${d.kind}`} style={{ marginLeft: 8 }}>
                    {d.kind === "food" ? "🍚" : "💵"} {d.kind}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div>
          <div className="queue-col-head">
            <h3>Pending requests</h3>
            <span>{requests.length} waiting</span>
          </div>
          {requests.length === 0 ? (
            <EmptyState label="No pending requests." />
          ) : (
            requests.map((r) => (
              <div
                className={`queue-item${selectedRequest?.id === r.id ? " selected" : ""}`}
                key={r.id}
                onClick={() => setSelectedRequest(r)}
              >
                <div className="nm">{r.recipientName}</div>
                <div className="meta" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  Needs {r.description}
                </div>
                <div style={{ marginTop: 6 }}>
                  <PriorityTag tier={r.priorityTier} />
                </div>
              </div>
            ))
          )}
        </div>

        {selectedDonation && selectedRequest && (
          <>
            <div className="match-arrow">SELECTED PAIR — READY TO CONFIRM</div>
            <div className="queue-item selected">
              <div className="nm">{selectedDonation.description}</div>
              <div className="meta">from {selectedDonation.donorName}</div>
            </div>
            <div className="queue-item selected">
              <div className="nm">{selectedRequest.recipientName}</div>
              <div className="meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PriorityTag tier={selectedRequest.priorityTier} />
              </div>
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn btn-primary" onClick={handleConfirmMatch} disabled={confirming}>
                {confirming ? "Confirming…" : "Confirm this match"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
