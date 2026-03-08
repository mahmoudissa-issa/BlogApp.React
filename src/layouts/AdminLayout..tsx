import {
  FaHome, FaUsers, FaTags, FaNewspaper, FaComments,
} from "react-icons/fa";
import DashboardLayout, { type NavItem } from "./DashboardLayout";
import "../styles/AdminLayout.css";

const NAV_ITEMS: NavItem[] = [
  { label: "Frontend",  icon: <FaHome />,      to: "/",                end: true, section: "main" },
  { label: "Users",     icon: <FaUsers />,     to: "/admin/users",               section: "manage" },
  { label: "Tags",      icon: <FaTags />,      to: "/admin/tags",                section: "manage" },
  { label: "Posts",     icon: <FaNewspaper />, to: "/admin/posts",               section: "manage" },
  { label: "Comments",  icon: <FaComments />,  to: "/admin/comments",            section: "manage" },
];

export default function AdminLayout() {
  return <DashboardLayout panelLabel="Admin Panel" navItems={NAV_ITEMS} />;
}