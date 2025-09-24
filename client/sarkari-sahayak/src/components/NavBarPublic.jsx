import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/NavBar.css";
import { useI18n, LANG_OPTIONS } from "../contexts/I18nContext";

function NavBarPublic() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">&#9776;</button>
        <div className="logo">{t("appName")}</div>
      </div>
      <select
        className="lang-select"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Select language"
      >
        {LANG_OPTIONS.map((o) => (
          <option key={o.code} value={o.code}>{o.label}</option>
        ))}
      </select>
      <ul className={`nav-links ${open ? 'open' : ''}`}>
        <li onClick={() => setOpen(false)}><Link to="/about">{t("navbar.about")}</Link></li>
        <li onClick={() => setOpen(false)}><Link to="/contact">{t("navbar.contact")}</Link></li>
      </ul>
    </nav>
  );
}

export default NavBarPublic;
