// Lightweight translator using LibreTranslate (public endpoint) with localStorage caching.
// For production, configure a paid/hosted service and move API URL to env.

const API_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_TRANSLATE_URL) ||
  'https://libretranslate.de/translate';

function hashKey(str) {
  try {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return String(h);
  } catch {
    return String(Math.random());
  }
}

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cacheSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export async function translateText(text, targetLang) {
  if (!text) return text;
  // English baseline: don't translate if en
  if (!targetLang || targetLang === 'en') return text;
  const key = `tr_v1_${targetLang}_${hashKey(text)}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'auto', target: targetLang, format: 'text' }),
    });
    if (!res.ok) throw new Error(`Translate HTTP ${res.status}`);
    const data = await res.json();
    const translated = data?.translatedText || text;
    cacheSet(key, translated);
    return translated;
  } catch (e) {
    console.warn('translateText failed; using original', e);
    return text; // fallback to original text
  }
}

export async function translateScheme(scheme, lang) {
  if (!scheme || !lang || lang === 'en') return scheme;
  const copy = { ...scheme };
  // Translate key fields; run sequentially to avoid rate issues
  copy.name = await translateText(String(scheme.name || ''), lang);
  copy.basic_info = await translateText(String(scheme.basic_info || ''), lang);
  copy.objectives = await translateText(String(scheme.objectives || ''), lang);
  copy.benefits = await translateText(String(scheme.benefits || ''), lang);
  copy.eligibility = await translateText(String(scheme.eligibility || ''), lang);
  // Documents: translate each item
  if (scheme.documents) {
    const parts = String(scheme.documents).split(',').map(s => s.trim()).filter(Boolean);
    const out = [];
    for (const p of parts) {
      out.push(await translateText(p, lang));
    }
    copy.documents = out.join(', ');
  }
  return copy;
}

export async function translateSchemes(list, lang) {
  if (!Array.isArray(list) || !list.length || !lang || lang === 'en') return list;
  const out = [];
  for (const s of list) {
    out.push(await translateScheme(s, lang));
  }
  return out;
}
