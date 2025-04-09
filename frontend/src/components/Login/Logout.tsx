import { useAuth } from "../Login/LoginContext";
import { useNavigate } from "react-router-dom";
import { BoxArrowRight } from "react-bootstrap-icons";

function Logout() {
  const { setIsLoggedIn, setRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole("");

    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("teacherName");

    navigate("/");
  };

  return (
    <button
      className="btn btn-outline-light w-100 d-flex align-items-center gap-2 text-danger"
      onClick={handleLogout}
    >
      <BoxArrowRight size={18} />
      Kijelentkezés
    </button>
  );
}

export default Logout;
