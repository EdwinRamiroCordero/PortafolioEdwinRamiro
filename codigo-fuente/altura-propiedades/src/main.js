import '@fontsource-variable/inter';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/400-italic.css';
import 'lenis/dist/lenis.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { waLink, sanitize, throttleOk } from './wa.js';
import { propiedades } from './data.js';
import { propertyArt } from './art.js';

gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = (n) => n.toLocaleString('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/* ---------- WhatsApp links (todos los data-wa) ---------- */
function wireWa(root = document) {
  root.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
}

/* ---------- Tarjetas (creadas con DOM seguro, sin innerHTML con datos) ---------- */
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function card(p, variant = 'h') {
  const c = el('article', variant === 'h' ? 'h-card' : 'g-card');
  const media = el('div', 'media');
  media.innerHTML = propertyArt(p); // SVG generado localmente a partir de números, sin texto de usuario
  const tag = el('span', 'tag', p.op);
  media.appendChild(tag);
  const body = el('div', 'body');
  body.append(el('p', 'zone', `${p.zona} · ${p.tipo}`), el('h3', null, p.nombre));
  const meta = el('ul', 'meta');
  [p.hab ? `${p.hab} hab.` : null, p.banos ? `${p.banos} baños` : null, `${p.m2} m²`]
    .filter(Boolean)
    .forEach((t) => meta.appendChild(el('li', null, t)));
  const foot = el('div', 'foot');
  foot.appendChild(el('strong', 'price', p.op === 'Renta' ? `${money(p.precio)}/mes` : money(p.precio)));
  const a = el('a', 'btn btn-sm btn-gold', 'Consultar');
  a.dataset.wa = `Hola Altura, me interesa "${p.nombre}" (${p.zona}, código ${p.id}). ¿Está disponible para visita?`;
  foot.appendChild(a);
  body.append(meta, foot);
  c.append(media, body);
  return c;
}

const track = document.getElementById('hTrack');
propiedades.filter((p) => p.destacada).forEach((p) => track.appendChild(card(p, 'h')));

/* ---------- Buscador ---------- */
const form = document.getElementById('filters');
const grid = document.getElementById('grid');
const count = document.getElementById('resultCount');
const precioOut = document.getElementById('precioOut');

function renderGrid() {
  const f = new FormData(form);
  const tipo = f.get('tipo'), zona = f.get('zona'), op = f.get('op');
  const max = Number(f.get('precio'));
  precioOut.textContent = max >= 900000 ? 'Sin límite' : money(max);
  const list = propiedades.filter((p) =>
    (!tipo || p.tipo === tipo) && (!zona || p.zona === zona) && (!op || p.op === op) && (max >= 900000 || p.precio <= max));
  grid.replaceChildren(...list.map((p) => card(p, 'g')));
  count.textContent = list.length ? `${list.length} propiedades encontradas` : 'Sin resultados. Escríbenos y buscamos por ti.';
  wireWa(grid);
  if (!reduce) gsap.from(grid.children, { y: 30, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
}
form.addEventListener('input', renderGrid);
renderGrid();

/* ---------- Calculadora hipotecaria ---------- */
const calc = document.getElementById('calcForm');
function renderCalc() {
  const f = new FormData(calc);
  const valor = +f.get('valor'), ent = +f.get('entrada'), plazo = +f.get('plazo'), tasa = +f.get('tasa');
  const monto = valor * (1 - ent / 100);
  const i = tasa / 100 / 12, n = plazo * 12;
  const cuota = (monto * i) / (1 - Math.pow(1 + i, -n));
  document.getElementById('vOut').textContent = money(valor);
  document.getElementById('eOut').textContent = `${ent}% · ${money(valor * ent / 100)}`;
  document.getElementById('pOut').textContent = `${plazo} años`;
  document.getElementById('tOut').textContent = `${tasa.toFixed(2)}%`;
  document.getElementById('cuota').textContent = money(cuota);
  document.getElementById('cuotaMeta').textContent = `Financias ${money(monto)} a ${n} meses`;
  const wa = document.getElementById('calcWa');
  wa.href = waLink(`Hola Altura, quiero precalificar un crédito: propiedad de ${money(valor)}, entrada ${ent}%, plazo ${plazo} años (cuota estimada ${money(cuota)}).`);
  wa.target = '_blank'; wa.rel = 'noopener noreferrer';
}
calc.addEventListener('input', renderCalc);
renderCalc();

/* ---------- Formulario de contacto -> WhatsApp ---------- */
const cf = document.getElementById('contactForm');
const err = document.getElementById('formError');
cf.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(cf);
  if (f.get('empresa')) return; // honeypot anti-bots
  const nombre = sanitize(f.get('nombre'), 60);
  const mensaje = sanitize(f.get('mensaje'), 400);
  if (nombre.length < 2) { err.textContent = 'Escribe tu nombre para poder atenderte.'; return; }
  if (!throttleOk('altura-contact')) { err.textContent = 'Espera unos segundos antes de volver a enviar.'; return; }
  err.textContent = '';
  const txt = `Hola Altura, soy ${nombre}. Me interesa: ${sanitize(f.get('interes'), 20)}.${mensaje ? ' ' + mensaje : ''}`;
  window.open(waLink(txt), '_blank', 'noopener,noreferrer');
});

wireWa();
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Nav ---------- */
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

/* ---------- Animaciones ---------- */
if (!reduce) {
  const lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -60 }); }
    }));

  // Hero: dibujo del skyline + título
  const paths = document.querySelectorAll('.skyline path');
  paths.forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(paths, { strokeDashoffset: 0, duration: 2.6, stagger: 0.08, ease: 'power2.inOut' })
    .from('.hero-title .line', { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.15 }, 0.3)
    .from('.hero .reveal', { y: 24, opacity: 0, duration: 1, stagger: 0.12 }, 0.8);

  gsap.to('.skyline', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-copy', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '80% top', scrub: true } });

  // Manifiesto: palabra por palabra (estilo Apple)
  const m = document.getElementById('manifesto');
  const words = m.textContent.trim().split(/\s+/);
  m.textContent = '';
  words.forEach((w) => { const s = el('span', 'w', w + ' '); m.appendChild(s); });
  gsap.fromTo('#manifesto .w', { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true } });

  // Scroll horizontal fijado
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const view = track.parentElement;
    const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.collection', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
    });
  });

  // Contadores
  document.querySelectorAll('[data-count]').forEach((n) => {
    const o = { v: 0 };
    gsap.to(o, { v: +n.dataset.count, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: n, start: 'top 85%' }, onUpdate: () => (n.textContent = Math.round(o.v)) });
  });

  gsap.utils.toArray('section h2').forEach((h) =>
    gsap.from(h, { y: 60, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 85%' } }));
} else {
  document.querySelectorAll('[data-count]').forEach((n) => (n.textContent = n.dataset.count));
}
