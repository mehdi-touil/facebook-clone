import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedJwt = parseJwt(token);
      if (decodedJwt.exp * 1000 < Date.now()) {
        navigate("/login");
      }
    }
    const storedtoken = localStorage.getItem("token");
    if (!storedtoken) {
      navigate("/login");
    }
  }, []);

  return children;
};

export default ProtectedRoute;
