import { useEffect, useState, useRef } from "react";
import { listRequests, confirmPickup } from "../../data/api";
import type { HelpRequest } from "../../data/types";
import { LoadingState, EmptyState, TicketStub } from "../../components/Shared";

export default function ConfirmPickup() {
  const [pending, setPending] = useState<HelpRequest[]>([]);
  const [selected, setSelected] = useState<HelpRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    listRequests({ recipientId: "recipient-1" }).then((all) => {
      const awaiting = all.filter((r) => r.status === "awaiting_pickup" && r.ticketId);
      setPending(awaiting);
      setSelected(awaiting[0] ?? null);
      setLoading(false);
    });
  }, []);

  function handleCodeChange(i: number, value: string) {
    const char = value.slice(-1).toUpperCase();
    const next = [...code];
    next[i] = char;
    setCode(next);
    if (char && i < 5) inputRefs.current[i + 1]?.focus();
  }

  async function handleConfirm() {
    if (!selected?.ticketId) return;
    setConfirming(true);
    const res = await confirmPickup(selected.ticketId, code.join(""));
    setResult(res);
    setConfirming(false);
  }

  if (loading) return <LoadingState />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Confirm pickup</div>
          <h1>Got your items? Confirm it here.</h1>
          <p className="sub">Enter the one-time code from your match ticket. This is what closes the loop and protects both sides.</p>
        </div>
      </div>

      {pending.length === 0 ? (
        <EmptyState label="Nothing is awaiting pickup confirmation right now." />
      ) : (
        <div className="confirm-wrap">
          {pending.length > 1 && (
            <div className="field" style={{ textAlign: "left", marginBottom: 24 }}>
              <label>Which ticket are you confirming?</label>
              <select
                value={selected?.id}
                onChange={(e) => {
                  setSelected(pending.find((p) => p.id === e.target.value) ?? null);
                  setResult(null);
                  setCode(["", "", "", "", "", ""]);
                }}
              >
                {pending.map((p) => (
                  <option key={p.id} value={p.id}>#{p.ticketId} — {p.description}</option>
                ))}
              </select>
            </div>
          )}

          {selected && (
            <>
              <TicketStub
                ticketId={selected.ticketId!}
                rows={[
                  { label: "Contents", value: selected.description },
                  { label: "Pickup location", value: `Barangay ${selected.barangay}` },
                ]}
              />

              {!result?.success && (
                <>
                  <div className="confirm-helper" style={{ marginTop: 24 }}>
                    Enter the 6-character code shown by the donor at handoff
                  </div>
                  <div className="code-entry">
                    {code.map((c, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        className="code-box"
                        maxLength={1}
                        value={c}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                      />
                    ))}
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    style={{ marginTop: 8 }}
                    onClick={handleConfirm}
                    disabled={confirming || code.some((c) => !c)}
                  >
                    {confirming ? "Checking…" : "Confirm I received this"}
                  </button>
                  {result && !result.success && <p className="error-text">{result.message}</p>}
                  <p className="helper" style={{ marginTop: 14 }}>
                    Wrong code, or nothing handed to you? Report an issue instead.
                  </p>
                </>
              )}

              {result?.success && (
                <div style={{ marginTop: 28 }}>
                  <div className="confirmed-badge">✓ Pickup confirmed just now</div>
                  <p className="sub" style={{ margin: "0 auto" }}>
                    Ticket #{selected.ticketId} is now closed. Thank you — this lets the donor know it reached you safely.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
