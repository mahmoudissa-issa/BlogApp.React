import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../pages/Footer";
import "../styles/Navbar.css";

export default function UserLayout() {
    return (
      
        <div className="d-flex flex-column " style={{minHeight:"100vh"}}>
            <NavBar/>
            <main className="flex-grow-1 main-content" style={{backgroundColor: "#F4F4F6"}}>
            <Outlet/>
            </main>
            <Footer/>
        </div>
    );
}