import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonation } from "../../data/api";
import { CURRENT_DONOR } from "../../data/seed";
import type { DonationKind } from "../../data/types";

export default function NewDonation() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<DonationKind>("food");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(200);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const desc = kind === "food" ? description || "Food donation" : `₱${amount.toLocaleString()} cash gift`;
    await createDonation({
      donorId: CURRENT_DONOR.id,
      donorName: CURRENT_DONOR.name,
      kind,
      description: desc,
      amountPhp: kind === "cash" ? amount : undefined,
      barangay: CURRENT_DONOR.barangay,
    });
    setSubmitting(false);
    navigate("/donor/history");
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">New donation</div>
          <h1>What are you giving today?</h1>
          <p className="sub">
            We'll match it to whoever needs it most — priority goes to elderly, PWD, and infant households first.
          </p>
        </div>
      </div>

      <div className="type-toggle">
        <button className={kind === "food" ? "active" : ""} onClick={() => setKind("food")} type="button">Food</button>
        <button className={kind === "cash" ? "active" : ""} onClick={() => setKind("cash")} type="button">Cash</button>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        {kind === "food" ? (
          <>
            <div className="field">
              <label>What are you giving?</label>
              <input
                type="text"
                placeholder="e.g. Rice (5kg), canned sardines, milk"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Estimated servings</label>
                <input type="text" placeholder="e.g. Feeds 4–5 people" />
              </div>
              <div className="field">
                <label>Best before</label>
                <input type="text" placeholder="e.g. 3 days" />
              </div>
            </div>
            <div className="field">
              <label>Pickup location</label>
              <select>
                <option>Basak Sari-Sari Store, Barangay Basak</option>
                <option>Other address…</option>
              </select>
            </div>
            <div className="field">
              <label>Notes for the recipient (optional)</label>
              <textarea placeholder="e.g. Available for pickup after 4pm on weekdays" />
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label>Amount</label>
              <div className="quick-amounts" style={{ display: "flex", gap: 10 }}>
                {[200, 500, 1000].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setAmount(v)}
                    style={{
                      flex: 1, padding: 10, borderRadius: 7, fontFamily: "var(--font-mono)", fontSize: 13, cursor: "pointer",
                      border: amount === v ? "1px solid var(--kalamansi)" : "1px solid var(--line)",
                      background: "var(--bg-deep)", color: amount === v ? "var(--kalamansi)" : "var(--paper)",
                    }}
                  >
                    ₱{v}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Where should this go?</label>
              <select>
                <option>Let the city match it to whoever needs it most</option>
                <option>Barangay Basak households only</option>
                <option>Elderly &amp; PWD priority fund</option>
              </select>
            </div>
            <div className="field">
              <label>Payment method</label>
              <select>
                <option>GCash</option>
                <option>Bank transfer</option>
                <option>Over the counter at City Hall</option>
              </select>
            </div>
          </>
        )}

        <div className="form-actions">
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : kind === "food" ? "Submit donation" : `Give ₱${amount.toLocaleString()}`}
          </button>
        </div>
        <p className="helper">You'll get a notification once this is matched to someone in need.</p>
      </form>
    </>
  );
}
