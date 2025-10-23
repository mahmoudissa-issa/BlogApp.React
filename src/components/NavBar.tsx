import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";


export default function NavBar() {
    const {user}=useAppSelector(state=>state.auth);
    const dispatch=useAppDispatch();

    return (
        <nav className="nav-bar-container">
            <Link to ="/">Mimo Blog App</Link>
            <div style={{marginLeft:"auto"}}>
                {!user && <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>}
                {user && <>
                {user.role==="Admin" && <Link to="/admin">Admin</Link>}
                <Link to="/profile">Settings</Link>
             
                <button onClick={() => dispatch(logout())}>Logout</button>                
                </>}
            </div>
            
        </nav>
    );


}