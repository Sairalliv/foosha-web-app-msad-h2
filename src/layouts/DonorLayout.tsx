import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { CURRENT_DONOR } from "../data/seed";

export default function DonorLayout() {
  const { user } = useAuth();

  // Use logged-in user's info when available, fall back to seed data
  const profileName = user?.name ?? CURRENT_DONOR.name;
  const initials = user?.avatarInitials ?? CURRENT_DONOR.avatarInitials;

  return (
    <div className="app">
      <Sidebar
        profileName={profileName}
        profileRole={`Donor · ${user?.email ?? `Rank #${CURRENT_DONOR.cityRank}`}`}
        avatarInitials={initials}
        groups={[
          {
            label: "Give",
            items: [
              { label: "Dashboard", to: "/donor", end: true },
              { label: "New donation", to: "/donor/new" },
              { label: "My donations", to: "/donor/history" },
              { label: "Badges & rank", to: "/donor/badges" },
            ],
          },
          {
            label: "Need help?",
            items: [{ label: "Request assistance", to: "/recipient" }],
          },
        ]}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
