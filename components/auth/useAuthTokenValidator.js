// hooks/useAuthTokenValidator.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

// Update this import to your actual logout or clear auth action
import { logout } from "../../store/authSlice";

const useAuthTokenValidator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          const decoded = jwtDecode < DecodedToken > token;
          const now = Math.floor(Date.now() / 1000);

          if (decoded.exp < now) {
            console.log("Token expired");
            Cookies.remove("token");
            Cookies.set("tokenValid", "false");
            dispatch(logout());
          }
        } catch (err) {
          console.error("Invalid token format:", err);
          Cookies.remove("token");
          Cookies.set("tokenValid", "false");
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
    };

    checkTokenExpiry(); // Initial check
    const interval = setInterval(checkTokenExpiry, 60 * 1000); // Check every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [dispatch]);
};

export default useAuthTokenValidator;
