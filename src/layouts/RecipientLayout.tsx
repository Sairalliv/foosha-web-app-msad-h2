import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { CURRENT_RECIPIENT } from "../data/seed";

export default function RecipientLayout() {
  const { user } = useAuth();

  const profileName = user?.name ?? CURRENT_RECIPIENT.name;
  const initials = user?.avatarInitials ?? CURRENT_RECIPIENT.avatarInitials;

  return (
    <div className="app">
      <Sidebar
        profileName={profileName}
        profileRole={`Recipient · ${user?.email ?? `Barangay ${CURRENT_RECIPIENT.barangay}`}`}
        avatarInitials={initials}
        avatarTeal
        groups={[
          {
            label: "Get help",
            items: [
              { label: "Home", to: "/recipient", end: true },
              { label: "Request help", to: "/recipient/request" },
              { label: "Browse available", to: "/recipient/browse" },
              { label: "Confirm pickup", to: "/recipient/confirm" },
              { label: "My requests", to: "/recipient/history" },
            ],
          },
          {
            label: "Want to give back?",
            items: [{ label: "Make a donation", to: "/donor" }],
          },
        ]}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
