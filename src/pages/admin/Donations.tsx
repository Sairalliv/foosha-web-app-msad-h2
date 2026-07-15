import { useEffect, useState } from "react";
import { listDonations } from "../../data/api";
import type { Donation, MatchStatus } from "../../data/types";
import { StatusChip, LoadingState, EmptyState } from "../../components/Shared";

type StatusFilter = "all" | MatchStatus;

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    listDonations().then((d) => {
      setDonations(d);
      setLoading(false);
    });
  }, []);

  const filtered = donations
    .filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          d.donorName.toLowerCase().includes(q) ||
          (d.ticketId ?? "").toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const statusCounts = {
    all: donations.length,
    unmatched: donations.filter((d) => d.status === "unmatched").length,
    matching: donations.filter((d) => d.status === "matching").length,
    awaiting_pickup: donations.filter((d) => d.status === "awaiting_pickup").length,
    confirmed: donations.filter((d) => d.status === "confirmed").length,
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Records</div>
          <h1>All donations</h1>
          <p className="sub">Every food and cash donation submitted across the city.</p>
        </div>
      </div>

      <div className="filter-bar">
        {(["all", "unmatched", "matching", "awaiting_pickup", "confirmed"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            className={`filter-chip${statusFilter === f ? " active" : ""}`}
            onClick={() => setStatusFilter(f)}
          >
            {f === "all" ? "All" : f === "awaiting_pickup" ? "Awaiting" : f.charAt(0).toUpperCase() + f.slice(1)}
            {" "}({statusCounts[f]})
          </button>
        ))}
        <input
          className="search-input"
          placeholder="Search donor, ticket, or item…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No donations match your filters." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Donor</th>
                <th>Type</th>
                <th>Given</th>
                <th>Barangay</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="id-cell">{d.ticketId ?? "—"}</td>
                  <td>{d.donorName}</td>
                  <td>
                    <span className={`kind-badge ${d.kind}`}>
                      {d.kind === "food" ? "🍚" : "💵"} {d.kind}
                    </span>
                  </td>
                  <td>{d.description}</td>
                  <td>{d.barangay}</td>
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
