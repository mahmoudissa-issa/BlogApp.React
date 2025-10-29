import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../pages/Footer";

export default function UserLayout() {
    return (
        <div>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </div>
    );
}