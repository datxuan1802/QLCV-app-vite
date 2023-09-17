import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { roles } from "../utils/role";
import { path } from "../utils/path";

const PrivateRoute = ({ component, role }: any) => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");
  useEffect(() => {
    if (!auth) {
      navigate(path.login);
      return;
    }
    // if (JSON.parse(auth).role === roles.editor && role === roles.admin) {
    //   // TODO: navigate to not permissions
    //   console.log("run");
    //   return navigate(path.notFound);
    // }
    const getPermission = async () => {
      //NOTE: get role here
      return;
    };
    getPermission();
  }, []);

  return component;
};

export default PrivateRoute;

// PrivateRoute.defaultProps = {
//   role: roles.editor,
// };
