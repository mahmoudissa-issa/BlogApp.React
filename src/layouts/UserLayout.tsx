import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../pages/Footer";

export default function UserLayout() {
    return (
        <div className="d-flex flex-column " style={{minHeight:"100vh"}}>
            <NavBar/>
            <main className="flex-grow-1" style={{backgroundColor: "#F4F4F6"}}>
            <Outlet/>
            </main>
            <Footer/>
        </div>
    );
}