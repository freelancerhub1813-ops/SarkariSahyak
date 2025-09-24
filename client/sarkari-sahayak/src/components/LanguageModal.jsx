import React from "react";
import { useI18n, LANG_OPTIONS } from "../contexts/I18nContext";
import "../styles/LanguageModal.css";

export default function LanguageModal({ onClose }) {
  const { lang, setLang, t } = useI18n();

  const handleContinue = () => {
    if (onClose) onClose();
  };

  return (
    <div className="lang-modal-backdrop" role="dialog" aria-modal="true">
      <div className="lang-modal">
        <h3 className="lang-title">{t("modal.chooseLanguage")}</h3>
        <div className="lang-options">
          {LANG_OPTIONS.map((opt) => (
            <label key={opt.code} className={`lang-option ${lang === opt.code ? "active" : ""}`}>
              <input
                type="radio"
                name="ui_lang"
                value={opt.code}
                checked={lang === opt.code}
                onChange={() => setLang(opt.code)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        <button className="lang-continue" onClick={handleContinue}>{t("modal.continue")}</button>
      </div>
    </div>
  );
}
