
import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

export const useLogout = (): (() => void) => {
    // TODO: add type assertion to avoid type error
    const authContext = useContext(AuthContext);
    //
    const {setIsAuthenticated} = authContext as AuthContextType;

    const navigate = useNavigate();
   
   const logout = (): void => {
    Cookies.remove('user');
    Cookies.remove('token');
    setIsAuthenticated(false);
    navigate('/login');
   };

   return logout;
};