
import {Navigate} from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { Role } from "../types/auth";
import { use, type JSX } from "react";


export default function ProtectedRoute({children,roles}:{children:JSX.Element;roles?:Role[]}) {

    const user=useAppSelector(state=>state.auth.user);
    if(!user) return <Navigate to="/login" />;
    if(roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
}