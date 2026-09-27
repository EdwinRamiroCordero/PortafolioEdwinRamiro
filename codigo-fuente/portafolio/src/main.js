import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import 'lenis/dist/lenis.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { perfil, sitios, proyectos, otros, stack } from './data.js';
import { waLink } from './wa.js';
import { startNetwork } from './net.js';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const ext = (a, href) => { a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; };

/* ---------- Enlaces ---------- */
ext($('#navWa'), waLink(perfil.whatsapp));
ext($('#waBig'), waLink(perfil.whatsapp));
ext($('#ghLink'), perfil.github);
ext($('#ghBig'), perfil.github);
$('#year').textContent = new Date().getFullYear();

/* ---------- Sitios web ---------- */
const sites = $('#sites');
sitios.forEach((s, i) => {
  const a = el('a', 'site');
  a.href = `./proyectos/${s.slug}/`;
  a.style.setProperty('--bg', s.colores[0]);
  a.style.setProperty('--ac', s.colores[1]);
  const prev = el('div', 'site-prev');
  prev.setAttribute('aria-hidden', 'true');
  prev.append(el('span', 'sp-bar'), el('span', 'sp-title', s.nombre), el('span', 'sp-line'), el('span', 'sp-line short'), el('span', 'sp-btn'));
  const body = el('div', 'site-body');
  body.append(el('p', 'mono num', `0${i + 1} · ${s.rubro}`), el('h3', null, s.nombre), el('p', 'method mono', s.metodo));
  const ul = el('ul', 'fx');
  s.efectos.forEach((f) => ul.appendChild(el('li', null, f)));
  body.append(ul, el('span', 'go mono', 'Abrir sitio ↗'));
  a.append(prev, body);
  sites.appendChild(a);
});

/* ---------- Proyectos (tarjetas apiladas) ---------- */
const cards = $('#cards');
proyectos.forEach((p, i) => {
  const c = el('article', 'pcard');
  c.style.setProperty('--c', p.color);
  c.style.setProperty('--i', i);
  const head = el('div', 'pc-head');
  head.append(el('span', 'mono pc-n', `${String(i + 1).padStart(2, '0')}`), el('span', 'mono pc-tag', p.tag));
  const left = el('div', 'pc-left');
  left.append(el('h3', null, p.titulo), el('p', 'pc-sum', p.resumen));
  const chips = el('ul', 'chips');
  p.stack.forEach((t) => chips.appendChild(el('li', 'mono', t)));
  left.appendChild(chips);
  const pts = el('ul', 'pc-pts');
  p.puntos.forEach((t) => pts.appendChild(el('li', null, t)));
  const grid = el('div', 'pc-grid');
  grid.append(left, pts);
  c.append(head, grid);
  cards.appendChild(c);
});
const others = $('#others');
otros.forEach((o) => { const li = el('li'); li.append(el('b', null, o.t), el('span', null, o.d)); others.appendChild(li); });

/* ---------- Stack ---------- */
const half = Math.ceil(stack.length / 2);
[[$('#mq1'), stack.slice(0, half)], [$('#mq2'), stack.slice(half)]].forEach(([box, list]) => {
  for (let r = 0; r < 2; r++) list.forEach((t) => box.appendChild(el('span', null, t)));
});
stack.forEach((t) => $('#stackList').appendChild(el('li', null, t)));

/* ---------- Texto tipeado ---------- */
const typed = $('#typed');
if (reduce) typed.textContent = perfil.roles[0];
else {
  let r = 0, c = 0, del = false;
  (function tick() {
    const word = perfil.roles[r];
    typed.textContent = word.slice(0, c);
    if (!del && c < word.length) c++;
    else if (!del) { del = true; return setTimeout(tick, 1600); }
    else if (c > 0) c--;
    else { del = false; r = (r + 1) % perfil.roles.length; }
    setTimeout(tick, del ? 28 : 55);
  })();
}

/* ---------- Nav ---------- */
addEventListener('scroll', () => $('#nav').classList.toggle('solid', scrollY > 40), { passive: true });

/* ---------- Red neuronal de fondo ---------- */
startNetwork($('#net'), { reduce });

/* ---------- Animaciones ---------- */
if (!reduce) {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -40 }); }
  }));

  gsap.from('.hero-name .row > span', { yPercent: 115, duration: 1.4, stagger: 0.12, ease: 'expo.out', delay: 0.1 });
  gsap.from('.hero-k, .hero-role, .hero-foot > *, .scroll-cue', { y: 24, opacity: 0, duration: 1, stagger: 0.1, delay: 0.8, ease: 'power3.out' });
  gsap.to('.hero-name', { yPercent: -25, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  const about = $('#about');
  const words = about.textContent.trim().split(/\s+/);
  about.textContent = '';
  words.forEach((w) => about.appendChild(el('span', 'w', w + ' ')));
  gsap.fromTo('#about .w', { opacity: 0.1 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top 75%', end: 'center 45%', scrub: true } });

  gsap.utils.toArray('.h2, .lead, .mega-cta').forEach((h) =>
    gsap.from(h, { y: 70, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%' } }));
  gsap.from('.site', { y: 90, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: '.sites', start: 'top 80%' } });

  // Tarjetas apiladas: cada una se reduce cuando la siguiente la cubre
  const all = gsap.utils.toArray('.pcard');
  all.forEach((card, i) => {
    if (i === all.length - 1) return;
    gsap.to(card, {
      scale: 0.92, opacity: 0.35, filter: 'blur(2px)', ease: 'none',
      scrollTrigger: { trigger: all[i + 1], start: 'top bottom', end: 'top 12%', scrub: true },
    });
  });
}
document.querySelectorAll('[data-n]').forEach((n) => {
  const to = +n.dataset.n;
  if (reduce) { n.textContent = to; return; }
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: n, start: 'top 90%' }, onUpdate: () => (n.textContent = Math.round(o.v)) });
});
