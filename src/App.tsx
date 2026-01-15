import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ProtectedRoute from "./core/protectedRoute";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout.";
import NotFound from "./pages/NotFound";
import PostDetail from "./pages/PostDetail";

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
