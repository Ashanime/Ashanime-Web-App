import { useNavigate } from "react-router";
import { setUser } from "../../../redux/google-slice";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUser({
      uid: "",
      email: "",
      displayName: "",
      photoURL: "",
    });
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="rounded flex lg:justify-end xl:w-16 lg:w-12 text-center  text-gray-300 xl:text-[14px] lg:items-center lg:text-[12px] hover:text-white transition-all cursor-pointer"
      onClick={() => handleSignOut()}
    >
      <span className="inline-block align-text-top">Sign Out</span>
    </div>
  );
};

export default LogoutButton;
