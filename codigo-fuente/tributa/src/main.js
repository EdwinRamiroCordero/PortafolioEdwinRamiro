import '@fontsource-variable/inter';
import './style.css';
import Alpine from '@alpinejs/csp'; // build CSP de Alpine: sin eval(), compatible con Content-Security-Policy estricta
import { waLink, sanitize, throttleOk } from './wa.js';

// Fechas máximas de declaración mensual según el noveno dígito del RUC/cédula (SRI).
const DIAS = { 1: 10, 2: 12, 3: 14, 4: 16, 5: 18, 6: 20, 7: 22, 8: 24, 9: 26, 0: 28 };

Alpine.data('nav', () => ({
  solid: false,
  init() { const on = () => (this.solid = window.scrollY > 30); on(); window.addEventListener('scroll', on, { passive: true }); },
  get navClass() { return this.solid ? 'bg-white/75 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,.06)]' : ''; },
}));

Alpine.data('calendario', () => ({
  ruc: '',
  error: '',
  clean() {
    this.ruc = this.ruc.replace(/\D/g, '').slice(0, 13);
    if (this.ruc.length && this.ruc.length < 9) this.error = '';
    else if (this.ruc.length >= 9 && this.ruc.length !== 10 && this.ruc.length !== 13) this.error = 'La cédula tiene 10 dígitos y el RUC 13.';
    else if (this.ruc.length === 13 && !this.ruc.endsWith('001')) this.error = 'Un RUC de persona natural suele terminar en 001.';
    else this.error = '';
  },
  get valido() { return this.ruc.length === 10 || this.ruc.length === 13; },
  get digito() { return this.valido ? Number(this.ruc[8]) : null; },
  get dia() { return this.valido ? DIAS[this.digito] : ''; },
  get restantes() {
    if (!this.valido) return 0;
    const hoy = new Date();
    let venc = new Date(hoy.getFullYear(), hoy.getMonth(), this.dia);
    if (hoy.getDate() > this.dia) venc = new Date(hoy.getFullYear(), hoy.getMonth() + 1, this.dia);
    return Math.ceil((venc - new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) / 86400000);
  },
  get mensaje() {
    if (!this.valido) return '';
    const r = this.restantes;
    if (r === 0) return '¡Vence hoy! Escríbenos ya.';
    if (r === 1) return 'Te queda 1 día.';
    return `Te quedan ${r} días para tu próxima declaración.`;
  },
  get barStyle() { return `width:${Math.max(4, 100 - (this.restantes / 31) * 100)}%`; },
  get tabla() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => ({
      d, dia: DIAS[d], label: `dígito ${d}`,
      clase: this.digito === d ? 'bg-leaf-600 text-white scale-105' : 'bg-white text-mute',
    }));
  },
}));

Alpine.data('checklist', () => ({
  items: [
    { id: 1, t: 'RUC activo y clave del SRI en línea', done: true },
    { id: 2, t: 'Facturas electrónicas de gastos personales del año', done: false },
    { id: 3, t: 'Certificado de retenciones (Formulario 107) de tu empleador', done: false },
    { id: 4, t: 'Ingresos adicionales: arriendos, honorarios, inversiones', done: false },
    { id: 5, t: 'Anexo de Gastos Personales (si aplica)', done: false },
    { id: 6, t: 'Datos de cargas familiares', done: false },
  ],
  toggle(id) { const it = this.items.find((i) => i.id === id); it.done = !it.done; },
  get hechos() { return this.items.filter((i) => i.done).length; },
  get progressStyle() { return `width:${(this.hechos / this.items.length) * 100}%`; },
  get progressLabel() { return `${this.hechos}/${this.items.length}`; },
}));

Alpine.data('planes', () => ({
  anual: false,
  setMensual() { this.anual = false; },
  setAnual() { this.anual = true; },
  get lista() {
    const f = this.anual ? 0.85 : 1;
    const mk = (n, tag, base, feats, dest = false) => ({
      n, tag, dest, f: feats,
      precio: `$${Math.round(base * f)}`,
      wa: waLink(`Hola Tributa, me interesa el plan ${n} (${this.anual ? 'anual' : 'mensual'}).`),
    });
    return [
      mk('Personal', 'Personas naturales', 19, ['✓ Declaración de Renta anual', '✓ Anexo de gastos personales', '✓ Recordatorios por WhatsApp']),
      mk('Emprendedor', 'RIMPE y profesionales', 39, ['✓ IVA y retenciones', '✓ Facturación electrónica', '✓ Renta anual incluida', '✓ Asesor dedicado'], true),
      mk('Pyme', 'Sociedades', 149, ['✓ Contabilidad completa', '✓ Nómina e IESS', '✓ Estados financieros', '✓ Supercias y anexos']),
    ];
  },
}));

Alpine.data('contacto', () => ({
  nombre: '', perfil: 'Persona natural', mensaje: '', trampa: '', error: '',
  enviar() {
    if (this.trampa) return;
    const n = sanitize(this.nombre, 60);
    if (n.length < 2) { this.error = 'Escribe tu nombre.'; return; }
    if (!throttleOk('tributa')) { this.error = 'Espera unos segundos antes de reenviar.'; return; }
    this.error = '';
    const m = sanitize(this.mensaje, 400);
    window.open(waLink(`Hola Tributa, soy ${n} (${sanitize(this.perfil, 30)}).${m ? ' ' + m : ''}`), '_blank', 'noopener,noreferrer');
  },
}));

window.Alpine = Alpine;
Alpine.start();

// Fallback de animaciones para navegadores sin scroll-driven animations.
if (!CSS.supports('animation-timeline: view()')) {
  document.documentElement.classList.add('no-sda');
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.scroll-in, .svc, .reveal-words span').forEach((el) => io.observe(el));
}

const wa = document.getElementById('waFloat');
wa.href = waLink('Hola Tributa, necesito asesoría tributaria.');
wa.target = '_blank'; wa.rel = 'noopener noreferrer';
document.getElementById('year').textContent = new Date().getFullYear();
