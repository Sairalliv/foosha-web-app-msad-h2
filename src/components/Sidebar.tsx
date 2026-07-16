import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export interface NavItem {
  label: string;
  to: string;
  count?: number;
  end?: boolean;
}

export interface NavGroupConfig {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  groups: NavGroupConfig[];
  profileName: string;
  profileRole: string;
  avatarInitials: string;
  avatarTeal?: boolean;
  subtitle?: string;
}

export default function Sidebar({ groups, profileName, profileRole, avatarInitials, avatarTeal, subtitle }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <img
        className={`logo-mark${subtitle ? " compact" : ""}`}
        src={`${import.meta.env.BASE_URL}assets/foosha-logo.png`}
        alt="Foosha"
      />
      {subtitle && <div className="logo-sub">{subtitle}</div>}

      {groups.map((group) => (
        <div className="nav-group" key={group.label}>
          <div className="nav-label">{group.label}</div>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
            >
              <span>◆ {item.label}</span>
              {typeof item.count === "number" && <span className="nav-count">{item.count}</span>}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-foot">
        <button className="mini-profile" onClick={logout} title="Switch role">
          <div className={`avatar${avatarTeal ? " teal" : ""}`}>{avatarInitials}</div>
          <div>
            <div className="who">{profileName}</div>
            <div className="role">{profileRole}</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
