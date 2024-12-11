import Link from "next/link";
import { useRouter } from "next/navigation";
import "./clientNavbar.css";
import Cookies from "js-cookie";

const ClientNavbar = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");

    router.push("/");
  };
  const goBack = () => {
    router.back();
  };

  const goFurther = () => {
    router.forward();
  };

  return (
    <nav className="navbar">
      <div className="navbarContainer">
        <div className="navbarLeft">
          <button onClick={goBack} className="navbarButton">
            &larr; Back
          </button>
          <button onClick={goFurther} className="navbarButton">
            Forward &rarr;
          </button>
        </div>

        <div className="navbarCenter">
          <Link href="/" className="navbarTitle">
            PayFlow
          </Link>
        </div>

        <div className="navbarLinks">
          <Link href="/" className="navbarLink">
            Home
          </Link>
          <Link href="/client/about-us" className="navbarLink">
            About Us
          </Link>
          <Link href="/client/profile" className="navbarLink">
            Profile
          </Link>
        </div>

        <Link onClick={handleLogout} href="/login" className="navbarLogout">
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default ClientNavbar;
