import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const I18nContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

const DICTS = {
  en: {
    appName: "Sarkari Sahayak",
    navbar: {
      about: "About Us",
      contact: "Contact",
      logout: "Logout",
    },
    dashboard: {
      title: "Sarkari Sahayak",
      welcome: "Welcome, {{name}}",
      profile: "My Profile",
      changePassword: "Change Password",
      myApplications: "My Applications",
      sections: {
        agriculture: "Agriculture",
        banking: "Banking",
        business: "Business",
        education: "Education",
        health: "Health",
        it_science: "IT & Science",
        women: "Women",
      },
    },
    common: {
      backToDashboard: "← Back to Dashboard",
    },
    modal: {
      chooseLanguage: "Choose your language",
      continue: "Continue",
    },
  },
  mr: {
    appName: "सरकारी सहाय्यक",
    navbar: {
      about: "आमच्याबद्दल",
      contact: "संपर्क",
      logout: "लॉगआउट",
    },
    dashboard: {
      title: "सरकारी सहाय्यक",
      welcome: "स्वागत, {{name}}",
      profile: "माझी माहिती",
      changePassword: "पासवर्ड बदला",
      myApplications: "माझ्या अर्जांची यादी",
      sections: {
        agriculture: "कृषी",
        banking: "बँकिंग",
        business: "व्यवसाय",
        education: "शिक्षण",
        health: "आरोग्य",
        it_science: "आयटी आणि विज्ञान",
        women: "महिला",
      },
    },
    common: { backToDashboard: "← डॅशबोर्डवर परत" },
    modal: { chooseLanguage: "भाषा निवडा", continue: "पुढे" },
  },
  hi: {
    appName: "सरकारी सहायक",
    navbar: { about: "हमारे बारे में", contact: "संपर्क", logout: "लॉगआउट" },
    dashboard: {
      title: "सरकारी सहायक",
      welcome: "स्वागत है, {{name}}",
      profile: "मेरी प्रोफ़ाइल",
      changePassword: "पासवर्ड बदलें",
      myApplications: "मेरे आवेदन",
      sections: {
        agriculture: "कृषि",
        banking: "बैंकिंग",
        business: "व्यापार",
        education: "शिक्षा",
        health: "स्वास्थ्य",
        it_science: "आईटी और विज्ञान",
        women: "महिला",
      },
    },
    common: { backToDashboard: "← डैशबोर्ड पर वापस" },
    modal: { chooseLanguage: "भाषा चुनें", continue: "जारी रखें" },
  },
  kn: {
    appName: "ಸರ್ಕಾರಿ ಸಹಾಯಕ",
    navbar: { about: "ನಮ್ಮ ಬಗ್ಗೆ", contact: "ಸಂಪರ್ಕ", logout: "ಲಾಗ್ ಔಟ್" },
    dashboard: {
      title: "ಸರ್ಕಾರಿ ಸಹಾಯಕ",
      welcome: "ಸ್ವಾಗತ, {{name}}",
      profile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
      changePassword: "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
      myApplications: "ನನ್ನ ಅರ್ಜಿಗಳು",
      sections: {
        agriculture: "ಕೃಷಿ",
        banking: "ಬ್ಯಾಂಕಿಂಗ್",
        business: "ವ್ಯಾಪಾರ",
        education: "ಶಿಕ್ಷಣ",
        health: "ಆರೋಗ್ಯ",
        it_science: "ಐಟಿ ಮತ್ತು ವಿಜ್ಞಾನ",
        women: "ಮಹಿಳೆ",
      },
    },
    common: { backToDashboard: "← ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂದಿರುಗಿ" },
    modal: { chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", continue: "ಮುಂದುವರಿಸಿ" },
  },
  ta: {
    appName: "சர்காரி உதவியாளர்",
    navbar: { about: "எங்களை பற்றி", contact: "தொடர்பு", logout: "வெளியேறு" },
    dashboard: {
      title: "சர்காரி உதவியாளர்",
      welcome: "வரவேற்கிறோம், {{name}}",
      profile: "என் சுயவிவரம்",
      changePassword: "கடவுச்சொல்லை மாற்றவும்",
      myApplications: "என் விண்ணப்பங்கள்",
      sections: {
        agriculture: "விவசாயம்",
        banking: "வங்கி",
        business: "வணிகம்",
        education: "கல்வி",
        health: "சுகாதாரம்",
        it_science: "ஐடி & அறிவியல்",
        women: "பெண்கள்",
      },
    },
    common: { backToDashboard: "← டாஷ்போர்டுக்கு திரும்ப" },
    modal: { chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்", continue: "தொடரவும்" },
  },
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("ui_lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("ui_lang", lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = DICTS[lang] || DICTS.en;
    const translate = (key, vars) => {
      const parts = key.split(".");
      let cur = dict;
      for (const p of parts) {
        if (cur && typeof cur === "object" && p in cur) cur = cur[p];
        else return key;
      }
      if (typeof cur === "string" && vars) {
        return cur.replace(/\{\{(.*?)\}\}/g, (_, k) => vars[k.trim()] ?? "");
      }
      return cur;
    };
    return translate;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export const LANG_OPTIONS = [
  { code: "mr", label: "Marathi" },
  { code: "hi", label: "Hindi" },
  { code: "en", label: "English" },
  { code: "kn", label: "Kannada" },
  { code: "ta", label: "Tamil" },
];
