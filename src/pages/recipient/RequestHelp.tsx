import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../data/api";
import { CURRENT_RECIPIENT } from "../../data/seed";
import type { DonationKind, PriorityTier } from "../../data/types";

export default function RequestHelp() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<DonationKind>("food");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [elderly, setElderly] = useState(true);
  const [pwd, setPwd] = useState(false);
  const [infant, setInfant] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function derivePriority(): PriorityTier {
    if (elderly) return "elderly";
    if (pwd) return "pwd";
    if (infant) return "infant";
    return "general";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const desc = kind === "food" ? description || "Food assistance" : `₱${amount || "0"} cash assistance`;
    await createRequest({
      recipientId: CURRENT_RECIPIENT.id,
      recipientName: CURRENT_RECIPIENT.name,
      kind,
      description: desc,
      amountPhp: kind === "cash" ? Number(amount) || undefined : undefined,
      barangay: CURRENT_RECIPIENT.barangay,
      priorityTier: derivePriority(),
    });
    setSubmitting(false);
    navigate("/recipient/history");
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Request help</div>
          <h1>What do you need right now?</h1>
          <p className="sub">Tell us your situation — households with elderly, PWD, or infant members are matched first.</p>
        </div>
      </div>

      <div className="type-toggle">
        <button className={kind === "food" ? "active" : ""} onClick={() => setKind("food")} type="button">Food</button>
        <button className={kind === "cash" ? "active" : ""} onClick={() => setKind("cash")} type="button">Cash</button>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        {kind === "food" ? (
          <div className="field">
            <label>What kind of food help do you need?</label>
            <textarea
              placeholder="e.g. Rice, canned goods, milk for two young children"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        ) : (
          <div className="field">
            <label>How much assistance do you need?</label>
            <input type="text" placeholder="e.g. 800" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        )}

        <div className="field">
          <label>Does your household include any of the following?</label>
          <div className="checkbox-group">
            <label className="checkbox-row">
              <input type="checkbox" checked={elderly} onChange={(e) => setElderly(e.target.checked)} /> Elderly member (60+)
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={pwd} onChange={(e) => setPwd(e.target.checked)} /> Person with disability (PWD)
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={infant} onChange={(e) => setInfant(e.target.checked)} /> Infant or young child
            </label>
          </div>
        </div>

        <div className="field">
          <label>Pickup or delivery address</label>
          <input type="text" defaultValue={`Barangay ${CURRENT_RECIPIENT.barangay}, Mandaue City`} />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        </div>
        <p className="helper">We'll notify you the moment this is matched to a donation.</p>
      </form>
    </>
  );
}
