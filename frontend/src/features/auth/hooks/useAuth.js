import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

export const useAuth = async() => {

    const context = useContext(AuthContext)

    return context
}