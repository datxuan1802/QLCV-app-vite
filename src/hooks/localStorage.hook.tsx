import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useDefaultPage = () => {
  const navigate = useNavigate();
  const defaultNavigation = localStorage.getItem("defaultNavigation");
  useEffect(() => {
    if (defaultNavigation) {
      navigate(defaultNavigation);
    } else {
      return;
    }
  }, []);
};
