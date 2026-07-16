import { useEffect, useState } from "react";
import { listRequests } from "../../data/api";
import type { HelpRequest, PriorityTier } from "../../data/types";
import { StatusChip, PriorityTag, LoadingState, EmptyState } from "../../components/Shared";

type FilterTier = "all" | PriorityTier;

// Priority sort order: vulnerable populations first
const TIER_ORDER: Record<PriorityTier, number> = { elderly: 0, pwd: 1, infant: 2, general: 3 };

export default function AdminRequests() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<FilterTier>("all");

  useEffect(() => {
    listRequests().then((r) => {
      // Default sort by priority
      const sorted = [...r].sort((a, b) => TIER_ORDER[a.priorityTier] - TIER_ORDER[b.priorityTier]);
      setRequests(sorted);
      setLoading(false);
    });
  }, []);

  const filtered = requests
    .filter((r) => {
      if (tierFilter !== "all" && r.priorityTier !== tierFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.recipientName.toLowerCase().includes(q) ||
          (r.ticketId ?? "").toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const tierCounts = {
    all: requests.length,
    elderly: requests.filter((r) => r.priorityTier === "elderly").length,
    pwd: requests.filter((r) => r.priorityTier === "pwd").length,
    infant: requests.filter((r) => r.priorityTier === "infant").length,
    general: requests.filter((r) => r.priorityTier === "general").length,
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Records</div>
          <h1>All requests</h1>
          <p className="sub">Every request for help submitted across the city.</p>
        </div>
      </div>

      <div className="filter-bar">
        {(["all", "elderly", "pwd", "infant", "general"] as FilterTier[]).map((f) => (
          <button
            key={f}
            className={`filter-chip${tierFilter === f ? " active" : ""}`}
            onClick={() => setTierFilter(f)}
          >
            {f === "all" ? "All" : f === "pwd" ? "PWD" : f.charAt(0).toUpperCase() + f.slice(1)}
            {" "}({tierCounts[f]})
          </button>
        ))}
        <input
          className="search-input"
          placeholder="Search recipient, ticket, or need…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No requests match your filters." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Recipient</th>
                <th>Needs</th>
                <th>Priority</th>
                <th>Barangay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="id-cell">{r.ticketId ?? "—"}</td>
                  <td>{r.recipientName}</td>
                  <td>{r.description}</td>
                  <td><PriorityTag tier={r.priorityTier} /></td>
                  <td>{r.barangay}</td>
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
