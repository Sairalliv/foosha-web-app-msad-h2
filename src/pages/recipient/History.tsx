import { useEffect, useState } from "react";
import { listRequests } from "../../data/api";
import type { HelpRequest } from "../../data/types";
import { StatusChip, LoadingState, EmptyState } from "../../components/Shared";

type Filter = "all" | "awaiting_pickup" | "confirmed" | "food" | "cash";

export default function RecipientHistory() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    listRequests({ recipientId: "recipient-1" }).then((r) => {
      setRequests(r);
      setLoading(false);
    });
  }, []);

  const filtered = requests.filter((r) => {
    if (filter === "all") return true;
    if (filter === "awaiting_pickup") return r.status === "awaiting_pickup";
    if (filter === "confirmed") return r.status === "confirmed";
    return r.kind === filter;
  });

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Your history</div>
          <h1>My requests</h1>
          <p className="sub">Every request you've made, and where it stands.</p>
        </div>
      </div>

      <div className="filter-bar">
        {(["all", "awaiting_pickup", "confirmed", "food", "cash"] as Filter[]).map((f) => (
          <button key={f} className={`filter-chip${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "awaiting_pickup" ? "Awaiting pickup" : f === "confirmed" ? "Confirmed" : f === "food" ? "Food" : "Cash"}
          </button>
        ))}
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No requests match this filter yet." />
        ) : (
          <table>
            <thead>
              <tr><th>Ticket</th><th>Requested</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="id-cell">{r.ticketId ?? "—"}</td>
                  <td>{r.description}</td>
                  <td>{r.createdAt}</td>
                  <td><StatusChip status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
