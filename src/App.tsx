import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Roles } from "./constants/enums";
import "./App.css";

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div className="page-spinner" />
  </div>
);

import ProtectedRoute from "./core/protectedRoute";
import Settings from "./pages/Settings/Settings";
import PasswordSettings from "./pages/Settings/PasswordSettings";
import ProfileSettings from "./pages/Settings/ProfileSettings";

// Lazy load components for code splitting
const UserLayout = lazy(() => import("./layouts/UserLayout"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./features/auth/Login"));
const Register = lazy(() => import("./features/auth/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout."));
const AuthorLayout = lazy(() => import("./layouts/AuthorLayout"));
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts"));
const AdminTags = lazy(() => import("./pages/admin/AdminTags"));
const AdminComments = lazy(() => import("./pages/admin/AdminComments"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const PostForm = lazy(() => import("./pages/admin/PostForm"));
const AuthorPosts = lazy(() => import("./pages/author/AuthorPosts"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const ForgotPassword = lazy(() => import("./features/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./features/auth/ResetPassword"));
const CheckEmail = lazy(() => import("./features/auth/CheckEmail"));
const VerifyEmail = lazy(() => import("./features/auth/VerifyEmail"));

export default function App() {

  return (
    
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<UserLayout/>}>
         <Route path="/" element= {<Home/>}/>
          <Route path="/login" element= {<Login/>}/>
          <Route path="/register" element ={<Register/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/check-email" element={<CheckEmail/>}/>
          <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
          <Route path="/profile" element ={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          <Route path="/posts/:id" element={<PostDetail/>}/>
          <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}>
            <Route index element ={<Navigate to="profile" replace/>}/>
            <Route path="profile" element ={<ProfileSettings/>}/>
            <Route path="password" element ={<PasswordSettings/>}/>
          </Route>
        </Route>

        {/* ── Admin routes (Admin only) ── */}
        <Route path="/admin" element={
          <ProtectedRoute roles={[Roles.ADMIN]}>
            <AdminLayout/>
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard/>}/>
          <Route path="posts" element={<AdminPosts/>}/>
          <Route path="posts/new" element={<PostForm/>}/>
          <Route path="posts/edit/:id" element={<PostForm/>}/>
          <Route path="tags" element={<AdminTags/>}/>
          <Route path="comments" element={<AdminComments/>}/>
          <Route path="users" element={<AdminUsers/>}/>
        </Route>

        {/* ── Author routes (Author only) ── */}
        <Route path="/author" element={
          <ProtectedRoute roles={[Roles.AUTHOR]}>
            <AuthorLayout/>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="posts" replace/>}/>
          <Route path="posts" element={<AuthorPosts/>}/>
          <Route path="posts/new" element={<PostForm/>}/>
          <Route path="posts/edit/:id" element={<PostForm/>}/>
        </Route>

        <Route path="*" element={<NotFound/>}/>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
