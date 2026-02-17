import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import "./App.css";

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
const NotFound = lazy(() => import("./pages/NotFound"));
const PostDetail = lazy(() => import("./pages/PostDetail"));

export default function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout/>}>
         <Route path="/" element= {<Home/>}/>
          <Route path="/login" element= {<Login/>}/>
          <Route path="/register" element ={<Register/>}/>
          <Route path="/profile" element ={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          <Route path="/posts/:id" element={<PostDetail/>}/>
          <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}>
            <Route index element ={<Navigate to="profile" replace/>}/>
            <Route path="profile" element ={<ProfileSettings/>}/>
            <Route path="password" element ={<PasswordSettings/>}/>
          
          </Route>
        </Route>
          <Route path="/admin" element={
          <ProtectedRoute roles={['Admin']}>
            <AdminLayout/>
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard/>}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}
