import type { MatchStatus, PriorityTier } from "../data/types";

const STATUS_LABELS: Record<MatchStatus, string> = {
  unmatched: "Unmatched",
  matching: "Matching now",
  awaiting_pickup: "Awaiting pickup",
  confirmed: "Confirmed",
};

export function StatusChip({ status }: { status: MatchStatus }) {
  return <span className={`status-chip ${status}`}>{STATUS_LABELS[status]}</span>;
}

const PRIORITY_LABELS: Record<PriorityTier, string> = {
  elderly: "Elderly · Tier 1",
  pwd: "PWD · Tier 1",
  infant: "Infant · Tier 1",
  general: "General",
};

export function PriorityTag({ tier }: { tier: PriorityTier }) {
  return <span className={`priority-tag ${tier}`}>{PRIORITY_LABELS[tier]}</span>;
}

export function StatCard({ num, label, urgent }: { num: string | number; label: string; urgent?: boolean }) {
  return (
    <div className={`stat-card${urgent ? " urgent" : ""}`}>
      <div className="num">{num}</div>
      <div className="lbl">{label}</div>
    </div>
  );
}

interface TicketStubProps {
  ticketId: string;
  rows: { label: string; value: string }[];
  stamp?: string;
  stampDone?: boolean;
  code?: string;
  codeLabel?: string;
}

export function TicketStub({ ticketId, rows, stamp, stampDone, code, codeLabel }: TicketStubProps) {
  return (
    <div className="ticket">
      <div className="ticket-top">
        <div>
          <div className="ticket-label">Match ticket</div>
          <div className="ticket-id">#{ticketId}</div>
        </div>
        {stamp && <div className={`stamp${stampDone ? " done" : ""}`}>{stamp}</div>}
      </div>
      {rows.map((r) => (
        <div className="ticket-row" key={r.label}>
          <span>{r.label}</span>
          <span>{r.value}</span>
        </div>
      ))}
      {code && (
        <>
          <div className="ticket-code">{code}</div>
          {codeLabel && <div className="ticket-hint">{codeLabel}</div>}
        </>
      )}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return <div className="loading-state">{label}</div>;
}

export function EmptyState({ label }: { label: string }) {
  return <div className="empty-state">{label}</div>;
}
