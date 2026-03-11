import { NavLink, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { FaChevronRight, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { SERVER_URL } from "../constants/app";
import logo from "../assets/m-logo-design.svg";
import "../styles/AdminLayout.css";

/* ── shared types ── */
export interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  end?: boolean;
  section: "main" | "manage";
}

export interface DashboardLayoutProps {
  panelLabel: string;
  navItems: NavItem[];
}

/* ── helpers ── */
const renderNavItem = (item: NavItem, closeSidebar: () => void) => (
  <NavLink
    key={item.to}
    to={item.to}
    end={item.end}
    className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
    onClick={closeSidebar}
  >
    <span className="sidebar-nav-icon">{item.icon}</span>
    <span className="sidebar-nav-label-text">{item.label}</span>
  </NavLink>
);

/* ── component ── */
export default function DashboardLayout({ panelLabel, navItems }: DashboardLayoutProps) {
  const { user } = useAppSelector((s) => s.auth);
  const [expanded, setExpanded] = useState(false);

  const close = () => setExpanded(false);
  const initials = user
    ? (user.username[0] + (user.username[1] ?? "")).toUpperCase()
    : "";

  const mainItems = navItems.filter((n) => n.section === "main");
  const manageItems = navItems.filter((n) => n.section === "manage");

  return (
    <div className={`admin-layout ${expanded ? "sidebar-expanded" : ""}`}>
      {expanded && <div className="sidebar-overlay" onClick={close} />}

      <aside className={`admin-sidebar ${expanded ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logo} alt="logo" width="24" height="24" />
          </div>
          <span className="sidebar-brand">{panelLabel}</span>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <FaTimes /> : <FaChevronRight />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {mainItems.map((n) => renderNavItem(n, close))}
          <div className="sidebar-nav-label">Manage</div>
          {manageItems.map((n) => renderNavItem(n, close))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.avatarUrl
                ? <img src={`${SERVER_URL}${user.avatarUrl}`} alt={user.username} />
                : initials}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.username}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
