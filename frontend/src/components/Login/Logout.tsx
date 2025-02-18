import { useAuth } from "../Login/LoginContext";
import { useNavigate } from "react-router-dom";

function Logout(){
  const { setIsLoggedIn, setRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole("");

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("teacherName");

    navigate("/");
  };

  return (<a className="dropdown-item" onClick={handleLogout}>Sign out</a>);
};

export default Logout;
