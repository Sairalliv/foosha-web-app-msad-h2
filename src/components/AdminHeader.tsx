import { useAuth } from "../context/AuthContext";

export default function AdminHeader() {
  const { user } = useAuth();
  const profileName = user?.name ?? "Mandaue City Hall";
  const initials = user?.avatarInitials ?? "CH";

  return (
    <header className="admin-header">
      <div className="header-left">
        <h2 className="header-title">Admin Dashboard</h2>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className="header-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search families, donors, or ID..." />
        </div>

        {/* Notifications */}
        <button className="header-btn notifications" aria-label="Notifications">
          <span className="bell-icon">🔔</span>
          <span className="notif-badge">3</span>
        </button>

        {/* Profile Menu Placeholder */}
        <div className="header-profile">
          <div className="avatar teal">{initials}</div>
          <span className="profile-name">{profileName}</span>
        </div>
      </div>
    </header>
  );
}
