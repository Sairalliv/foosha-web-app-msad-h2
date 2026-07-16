import { useEffect, useState } from "react";
import {
  listVerificationQueue,
  approveVerification,
  listTickets,
  confirmPickup,
} from "../../data/api";
import type { VerificationCase, MatchTicket } from "../../data/types";
import { LoadingState, EmptyState } from "../../components/Shared";

export default function AdminVerify() {
  const [cases, setCases] = useState<VerificationCase[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP Verification state
  const [otpTickets, setOtpTickets] = useState<MatchTicket[]>([]);
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpErrors, setOtpErrors] = useState<Record<string, string>>({});
  const [justConfirmed, setJustConfirmed] = useState<Set<string>>(new Set());

  async function refresh() {
    const [c, tickets] = await Promise.all([
      listVerificationQueue(),
      listTickets(),
    ]);
    setCases(c.filter((v) => v.status === "pending"));
    setOtpTickets(tickets.filter((t) => t.status === "awaiting_pickup"));
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleApprove(id: string) {
    await approveVerification(id);
    refresh();
  }

  async function handleOtpVerify(ticketId: string) {
    const code = otpInputs[ticketId]?.trim();
    if (!code) {
      setOtpErrors((prev) => ({ ...prev, [ticketId]: "Enter the pickup code" }));
      return;
    }
    const result = await confirmPickup(ticketId, code);
    if (!result.success) {
      setOtpErrors((prev) => ({ ...prev, [ticketId]: result.message }));
      return;
    }
    // Clear error, flash confirmation
    setOtpErrors((prev) => {
      const next = { ...prev };
      delete next[ticketId];
      return next;
    });
    setJustConfirmed((prev) => new Set(prev).add(ticketId));
    setTimeout(() => {
      setJustConfirmed((prev) => {
        const next = new Set(prev);
        next.delete(ticketId);
        return next;
      });
      refresh();
    }, 1500);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">People & security</div>
          <h1>Verification center</h1>
          <p className="sub">Review recipient eligibility claims and verify OTP pickup codes for active match tickets.</p>
        </div>
      </div>

      {/* ── OTP Security Verification ──────────────────────────────── */}
      <div className="otp-verify-panel" style={{ marginBottom: 32 }}>
        <div className="panel-head">
          <h3>OTP Pickup Verification</h3>
          <span
            className="status-chip awaiting_pickup"
            style={{ background: "rgba(199,217,77,0.1)", border: "1px solid rgba(199,217,77,0.3)" }}
          >
            {otpTickets.length} awaiting code
          </span>
        </div>
        <div className="otp-ticket-list">
          {loading ? (
            <LoadingState />
          ) : otpTickets.length === 0 ? (
            <EmptyState label="No tickets awaiting OTP verification — all caught up." />
          ) : (
            otpTickets.map((ticket) => (
              <div
                className={`otp-ticket-item${justConfirmed.has(ticket.id) ? " just-confirmed" : ""}`}
                key={ticket.id}
              >
                <div className="otp-ticket-info">
                  <div className="otp-ticket-id">Ticket #{ticket.id}</div>
                  <div className="otp-names">
                    {ticket.donorName} → {ticket.recipientName}
                  </div>
                  <div className="otp-contents">{ticket.contents}</div>
                </div>
                {justConfirmed.has(ticket.id) ? (
                  <div className="otp-confirmed-label">✓ Confirmed</div>
                ) : (
                  <div>
                    <div className="otp-input-wrap">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="CODE"
                        value={otpInputs[ticket.id] ?? ""}
                        onChange={(e) =>
                          setOtpInputs((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleOtpVerify(ticket.id);
                        }}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOtpVerify(ticket.id)}
                      >
                        Verify
                      </button>
                    </div>
                    {otpErrors[ticket.id] && (
                      <div className="otp-error">{otpErrors[ticket.id]}</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Recipient Eligibility Verification ─────────────────────── */}
      <div className="panel-head" style={{ marginBottom: 0 }}>
        <h3>Recipient Eligibility Review</h3>
        <span className="status-chip" style={{ background: "rgba(244,236,216,0.06)", color: "var(--paper-dim)" }}>
          {cases.length} pending
        </span>
      </div>
      <div className="panel" style={{ marginTop: 12 }}>
        {loading ? (
          <LoadingState />
        ) : cases.length === 0 ? (
          <EmptyState label="Nothing pending review — all caught up." />
        ) : (
          cases.map((v) => (
            <div className="row-item" key={v.id}>
              <div>
                <div className="name">{v.recipientName} — Barangay {v.barangay}</div>
                <div className="meta">
                  {v.documentSubmitted ? `Submitted document · Claims: ${v.claim}` : "No supporting document uploaded yet"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" disabled={!v.documentSubmitted} onClick={() => handleApprove(v.id)}>
                  Approve
                </button>
                <button className="btn btn-ghost btn-sm">Request info</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
