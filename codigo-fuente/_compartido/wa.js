// Utilidades de contacto seguras compartidas por los sitios del portafolio.
// Número de WhatsApp en formato internacional (Ecuador +593, sin el 0 inicial).
export const WA_NUMBER = '593960913089';

/** Limpia texto de usuario: quita caracteres de control y etiquetas, recorta longitud. */
export function sanitize(value, max = 300) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Construye un enlace wa.me con el mensaje codificado. */
export function waLink(message = '') {
  const text = sanitize(message, 1000);
  return `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Limita envíos repetidos (anti-spam del lado del cliente). */
const last = new Map();
export function throttleOk(key, ms = 8000) {
  const now = Date.now();
  if (now - (last.get(key) || 0) < ms) return false;
  last.set(key, now);
  return true;
}
