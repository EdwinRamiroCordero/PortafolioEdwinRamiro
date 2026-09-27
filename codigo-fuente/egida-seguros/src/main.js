import '@fontsource-variable/space-grotesk';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { waLink, sanitize, throttleOk } from './wa.js';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = (n) => n.toLocaleString('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const $ = (s) => document.querySelector(s);

/* ---------- Datos ---------- */
const SEGUROS = [
  { k: 'vida', n: 'Vida', color: '#22d3ee', base: 18, d: 'Tranquilidad financiera para quienes más quieres, pase lo que pase.', items: ['Muerte por cualquier causa', 'Invalidez total y permanente', 'Enfermedades graves', 'Gastos exequiales'] },
  { k: 'salud', n: 'Salud', color: '#34d399', base: 42, d: 'Atención médica privada con red de clínicas y reembolsos ágiles.', items: ['Hospitalización y cirugía', 'Consultas y exámenes', 'Maternidad', 'Telemedicina 24/7'] },
  { k: 'vehiculo', n: 'Vehículo', color: '#f59e0b', base: 35, d: 'Cobertura total para tu auto, con grúa y auto sustituto.', items: ['Choque, robo y daños a terceros', 'Asistencia vial 24/7', 'Auto sustituto', 'Cobertura en todo el país'] },
  { k: 'hogar', n: 'Hogar', color: '#a78bfa', base: 12, d: 'Tu casa y lo que hay dentro, protegidos contra imprevistos.', items: ['Incendio y terremoto', 'Robo de contenidos', 'Daños por agua', 'Plomería y cerrajería'] },
  { k: 'empresa', n: 'Empresa', color: '#f472b6', base: 65, d: 'Pólizas corporativas para operar sin sobresaltos.', items: ['Responsabilidad civil', 'Equipos electrónicos', 'Vida y salud colectiva', 'Transporte de mercadería'] },
];

/* ---------- WhatsApp ---------- */
function wireWa() {
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener noreferrer';
  });
}

/* ---------- Escena 3D (carga diferida, con fallback) ---------- */
let scene3d = null;
async function init3d() {
  try {
    const test = document.createElement('canvas');
    if (!(test.getContext('webgl2') || test.getContext('webgl'))) throw new Error('sin WebGL');
    const { createScene } = await import('./scene.js');
    scene3d = createScene($('#scene'));
    setupScrollMorph();
  } catch {
    document.body.classList.add('no-webgl');
  }
}

function layout(section) {
  const wide = innerWidth > 900;
  const map = {
    top: { s: 0, x: wide ? 2.2 : 0, y: wide ? 0 : 1.2, scale: wide ? 1 : 0.75 },
    statement: { s: 0.5, x: 0, y: 0, scale: 1.25 },
    coberturas: { s: 1, x: wide ? 2.6 : 0, y: wide ? 0.2 : 1.6, scale: wide ? 0.95 : 0.6 },
    cotizar: { s: 1, x: wide ? -2.8 : 0, y: 0, scale: wide ? 0.8 : 0.5 },
    siniestros: { s: 2, x: wide ? 2.4 : 0, y: 0, scale: wide ? 1 : 0.6 },
    numbers: { s: 3, x: 0, y: -0.5, scale: 1.1 },
  };
  return map[section] || map.top;
}

function setupScrollMorph() {
  const sections = [
    ['#top', 'top'], ['.statement', 'statement'], ['#coberturas', 'coberturas'],
    ['#cotizar', 'cotizar'], ['#siniestros', 'siniestros'], ['.numbers', 'numbers'],
  ];
  sections.forEach(([sel, key]) => {
    ScrollTrigger.create({
      trigger: sel, start: 'top 55%', end: 'bottom 45%',
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.to(scene3d.state, { ...layout(key), duration: reduce ? 0 : 1.8, ease: 'power3.inOut', overwrite: true });
        if (key !== 'coberturas') scene3d.setColor(key === 'siniestros' ? '#f43f5e' : '#22d3ee');
        else scene3d.setColor(SEGUROS[currentTab].color);
      },
    });
  });
}

/* ---------- Tabs de coberturas ---------- */
let currentTab = 0;
const tabs = $('#tabs');
SEGUROS.forEach((s, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.role = 'tab'; b.textContent = s.n; b.dataset.i = i;
  b.style.setProperty('--c', s.color);
  b.addEventListener('click', () => selectTab(i));
  tabs.appendChild(b);
});
function selectTab(i) {
  currentTab = i;
  const s = SEGUROS[i];
  [...tabs.children].forEach((b, j) => { b.setAttribute('aria-selected', j === i); b.classList.toggle('on', j === i); });
  $('#tpTitle').textContent = `Seguro de ${s.n}`;
  $('#tpDesc').textContent = s.d;
  const ul = $('#tpList'); ul.replaceChildren(...s.items.map((t) => { const li = document.createElement('li'); li.textContent = t; return li; }));
  $('#tpPrice').textContent = money(s.base);
  $('#tabPanel').style.setProperty('--c', s.color);
  const wa = $('#tpWa'); wa.href = waLink(`Hola Égida, quiero cotizar un seguro de ${s.n}.`); wa.target = '_blank'; wa.rel = 'noopener noreferrer';
  scene3d?.setColor(s.color);
  if (!reduce) gsap.fromTo('#tabPanel > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
}
selectTab(0);

/* ---------- Cotizador ---------- */
const chips = $('#chips');
SEGUROS.forEach((s, i) => {
  const l = document.createElement('label'); l.className = 'chip'; l.style.setProperty('--c', s.color);
  const inp = document.createElement('input'); inp.type = 'checkbox'; inp.name = 'cob'; inp.value = s.k; if (i === 0) inp.checked = true;
  const sp = document.createElement('span'); sp.textContent = s.n;
  l.append(inp, sp); chips.appendChild(l);
});
const qf = $('#quoteForm');
function prima() {
  const f = new FormData(qf);
  const edad = +f.get('edad'), personas = +f.get('personas');
  const sel = f.getAll('cob');
  $('#ageOut').textContent = edad; $('#peopleOut').textContent = personas;
  let total = 0;
  sel.forEach((k) => {
    const s = SEGUROS.find((x) => x.k === k);
    let p = s.base;
    if (k === 'vida' || k === 'salud') p *= (1 + Math.max(0, edad - 30) * 0.025) * (k === 'salud' ? personas : 1);
    total += p;
  });
  if (sel.length >= 3) total *= 0.88; // descuento multipóliza
  $('#total').textContent = money(total);
  return { total, sel, edad, personas };
}
qf.addEventListener('input', prima);
prima();
qf.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(qf);
  if (f.get('web')) return;
  const { total, sel, edad, personas } = prima();
  const err = $('#qErr');
  if (!sel.length) { err.textContent = 'Selecciona al menos una cobertura.'; return; }
  if (!throttleOk('egida')) { err.textContent = 'Espera unos segundos antes de reenviar.'; return; }
  err.textContent = '';
  const nombre = sanitize(f.get('nombre'), 60) || 'cliente';
  const names = sel.map((k) => SEGUROS.find((x) => x.k === k).n).join(', ');
  window.open(waLink(`Hola Égida, soy ${nombre}. Quiero cotizar: ${names}. Edad ${edad}, ${personas} persona(s). Prima estimada ${money(total)}/mes.`), '_blank', 'noopener,noreferrer');
});

/* ---------- Animaciones de texto ---------- */
function splitChars(el) {
  const html = el.innerHTML.split(/<br\s*\/?>/i);
  el.textContent = '';
  html.forEach((line, li) => {
    const ln = document.createElement('span'); ln.className = 'ln';
    [...line.replace(/&nbsp;/g, ' ')].forEach((ch) => {
      const c = document.createElement('span'); c.className = 'ch'; c.textContent = ch === ' ' ? ' ' : ch; ln.appendChild(c);
    });
    el.appendChild(ln);
    if (li < html.length - 1) el.appendChild(document.createElement('br'));
  });
}

if (!reduce) {
  document.querySelectorAll('[data-split]').forEach(splitChars);
  gsap.from('.hero .ch', { yPercent: 120, opacity: 0, rotateX: -80, duration: 1.2, stagger: 0.025, ease: 'expo.out', delay: 0.2 });
  gsap.from('.hero-foot > *, .hud', { y: 30, opacity: 0, duration: 1, stagger: 0.12, delay: 0.9, ease: 'power3.out' });
  gsap.fromTo('.big-line', { '--p': '0%' }, { '--p': '100%', ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'bottom 60%', scrub: true } });
  gsap.utils.toArray('.h2, .claim-steps li, .glass, .tab-panel').forEach((el) =>
    gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));
}
document.querySelectorAll('[data-n]').forEach((n) => {
  const o = { v: 0 }, to = +n.dataset.n;
  if (reduce) { n.textContent = to.toLocaleString('es-EC'); return; }
  gsap.to(o, { v: to, duration: 2.2, ease: 'power2.out', scrollTrigger: { trigger: n, start: 'top 85%' }, onUpdate: () => (n.textContent = Math.round(o.v).toLocaleString('es-EC')) });
});

addEventListener('scroll', () => $('#nav').classList.toggle('solid', scrollY > 40), { passive: true });
$('#year').textContent = new Date().getFullYear();
wireWa();
init3d();
