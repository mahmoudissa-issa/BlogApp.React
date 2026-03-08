
import {Navigate} from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { type JSX } from "react";
import { type Roles } from "../constants/enums";


export default function ProtectedRoute({children,roles}:{children:JSX.Element;roles?:Roles[]}) {

    const user=useAppSelector(state=>state.auth.user);
    if(!user) return <Navigate to="/login" />;
    if(roles && !roles.includes(user.role as Roles)) return <Navigate to="/" />;
    return children;
}