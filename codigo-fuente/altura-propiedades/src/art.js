// Ilustraciones arquitectónicas generadas en SVG (sin imágenes externas).
const PALETAS = [
  ['#1a1410', '#6b4a2b', '#e8c27a'],
  ['#0b1320', '#1f3b5c', '#9cc6ff'],
  ['#0f1a12', '#2f5a3c', '#b8e0a4'],
  ['#1b0f18', '#6a2e4c', '#ffb3a1'],
  ['#15130c', '#5a5230', '#f3e3a0'],
  ['#101014', '#3a3a48', '#d9d9ff'],
];

const formas = {
  villa: (c) => `<rect x="60" y="150" width="280" height="90" fill="${c[0]}" opacity=".85"/><rect x="120" y="100" width="190" height="55" fill="${c[0]}"/>
    <rect x="135" y="112" width="160" height="30" fill="${c[2]}" opacity=".55"/><rect x="80" y="170" width="240" height="40" fill="${c[2]}" opacity=".35"/>
    <rect x="40" y="238" width="320" height="6" fill="${c[2]}" opacity=".6"/><rect x="0" y="244" width="400" height="56" fill="${c[1]}" opacity=".35"/>`,
  torre: (c) => `<rect x="150" y="30" width="100" height="220" fill="${c[0]}"/>${Array.from({ length: 11 }, (_, i) =>
    `<rect x="160" y="${42 + i * 19}" width="80" height="9" fill="${c[2]}" opacity="${0.25 + (i % 3) * 0.2}"/>`).join('')}
    <rect x="90" y="140" width="55" height="110" fill="${c[0]}" opacity=".6"/><rect x="258" y="110" width="60" height="140" fill="${c[0]}" opacity=".5"/>`,
  casa: (c) => `<path d="M90 250V150l110-70 110 70v100z" fill="${c[0]}"/><rect x="120" y="170" width="60" height="45" fill="${c[2]}" opacity=".5"/>
    <rect x="220" y="170" width="60" height="80" fill="${c[2]}" opacity=".35"/><path d="M70 155 200 72l130 83" fill="none" stroke="${c[2]}" stroke-width="3" opacity=".6"/>`,
  lote: (c) => `<path d="M0 230 Q120 200 200 215 T400 205 V300 H0z" fill="${c[1]}" opacity=".7"/>
    <path d="M60 250 L340 235" stroke="${c[2]}" stroke-dasharray="6 6" stroke-width="2"/><circle cx="300" cy="190" r="16" fill="${c[0]}"/><rect x="298" y="200" width="4" height="30" fill="${c[0]}"/>`,
  loft: (c) => `<rect x="70" y="80" width="260" height="170" fill="${c[0]}"/>${[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) =>
    `<rect x="${85 + k * 62}" y="${95 + r * 52}" width="50" height="38" fill="${c[2]}" opacity="${0.2 + ((r + k) % 3) * 0.2}"/>`).join('')).join('')}`,
};

export function propertyArt(p) {
  const c = PALETAS[p.paleta % PALETAS.length];
  const id = `g${p.id.replace(/\W/g, '')}`;
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustración de la propiedad">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient>
  <radialGradient id="${id}s" cx=".75" cy=".25" r=".5"><stop offset="0" stop-color="${c[2]}" stop-opacity=".8"/><stop offset="1" stop-color="${c[2]}" stop-opacity="0"/></radialGradient></defs>
  <rect width="400" height="300" fill="url(#${id})"/><rect width="400" height="300" fill="url(#${id}s)"/>
  ${formas[p.forma](c)}</svg>`;
}
