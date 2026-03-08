import { FaHome, FaNewspaper } from "react-icons/fa";
import DashboardLayout, { type NavItem } from "./DashboardLayout";
import "../styles/AdminLayout.css";

const NAV_ITEMS: NavItem[] = [
  { label: "Frontend", icon: <FaHome />,      to: "/",              end: true, section: "main" },
  { label: "Posts",    icon: <FaNewspaper />, to: "/author/posts",             section: "manage" },
];

export default function AuthorLayout() {
  return <DashboardLayout panelLabel="Author Panel" navItems={NAV_ITEMS} />;
}
