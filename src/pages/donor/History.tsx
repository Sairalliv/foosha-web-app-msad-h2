import { useEffect, useState } from "react";
import { listDonations } from "../../data/api";
import type { Donation } from "../../data/types";
import { StatusChip, LoadingState, EmptyState } from "../../components/Shared";

type Filter = "all" | "awaiting_pickup" | "confirmed" | "food" | "cash";

export default function DonorHistory() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    listDonations({ donorId: "donor-1" }).then((d) => {
      setDonations(d);
      setLoading(false);
    });
  }, []);

  const filtered = donations.filter((d) => {
    if (filter === "all") return true;
    if (filter === "awaiting_pickup") return d.status === "awaiting_pickup";
    if (filter === "confirmed") return d.status === "confirmed";
    return d.kind === filter;
  });

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Your giving history</div>
          <h1>My donations</h1>
          <p className="sub">Every match you've made, and whether it's been confirmed.</p>
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
          <EmptyState label="No donations match this filter yet." />
        ) : (
          <table>
            <thead>
              <tr><th>Ticket</th><th>Given</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="id-cell">{d.ticketId ?? "—"}</td>
                  <td>{d.description}</td>
                  <td>{d.createdAt}</td>
                  <td><StatusChip status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
