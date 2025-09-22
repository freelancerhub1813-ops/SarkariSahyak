import { Link } from "react-router-dom";
import "../styles/NavBar.css";

function NavBarPublic() {
  return (
    <nav className="navbar">
      Sarkari Sahayak
      <ul className="nav-links">
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default NavBarPublic;
