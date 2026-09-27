import { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, animate } from 'framer-motion';
import { PRODUCTOS, cuotaFrancesa, amortizacion, money } from './finance.js';
import { waLink, sanitize, throttleOk } from './wa.js';

const ease = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: i * 0.08 } }),
};

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
      <path d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.3 23.7l6.2-1.6A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.5-8.5ZM12 21.6a9.7 9.7 0 0 1-5-1.4l-.3-.2-3.7 1 1-3.6-.2-.4A9.7 9.7 0 1 1 12 21.6Zm5.3-7.3c-.3-.1-1.7-.9-2-1s-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

function Counter({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{prefix}{v.toLocaleString('es-EC')}{suffix}</span>;
}

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 30);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`nav ${solid ? 'solid' : ''}`}>
      <a href="#top" className="logo" aria-label="Kapital Ya, inicio"><span className="logo-mark">K</span>Kapital<b>Ya</b></a>
      <nav aria-label="Principal">
        <ul>
          <li><a href="#productos">Productos</a></li>
          <li><a href="#simulador">Simulador</a></li>
          <li><a href="#proceso">Proceso</a></li>
          <li><a href="#faq">Preguntas</a></li>
        </ul>
      </nav>
      <a className="btn btn-dark btn-sm" href="#solicitar">Solicitar</a>
    </header>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.82]), { stiffness: 120, damping: 30 });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <motion.div className="hero-copy" style={{ y: titleY, opacity }}>
        <motion.span className="pill" initial="hidden" animate="show" variants={fadeUp}>● Respuesta en menos de 24 horas</motion.span>
        <h1>
          {['Tu', 'próximo', 'paso,'].map((w, i) => (
            <motion.span key={w} className="word" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.1 + i * 0.08 }}>{w}&nbsp;</motion.span>
          ))}
          <br />
          <motion.span className="word grad" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.4 }}>financiado hoy.</motion.span>
        </h1>
        <motion.p initial="hidden" animate="show" custom={4} variants={fadeUp}>
          Préstamos claros, sin letra pequeña. Simula tu cuota, envía tu solicitud por WhatsApp y recibe respuesta el mismo día.
        </motion.p>
        <motion.div className="cta" initial="hidden" animate="show" custom={5} variants={fadeUp}>
          <a className="btn btn-primary" href="#simulador">Simular mi préstamo</a>
          <a className="btn btn-ghost" href={waLink('Hola Kapital Ya, quiero información sobre sus préstamos.')} target="_blank" rel="noopener noreferrer"><WaIcon /> Hablar con un asesor</a>
        </motion.div>
      </motion.div>

      <motion.div className="phone-wrap" style={{ scale, rotateX: rotate, y }}>
        <div className="phone">
          <div className="phone-notch" />
          <div className="app">
            <p className="app-hi">Hola, María 👋</p>
            <div className="app-card">
              <span>Préstamo aprobado</span>
              <strong>$8.500,00</strong>
              <div className="app-bar"><motion.i initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 2, ease, delay: 0.8 }} /></div>
              <small>Desembolso en tu cuenta · hoy 15:30</small>
            </div>
            <div className="app-row"><span>Cuota mensual</span><b>$287,40</b></div>
            <div className="app-row"><span>Plazo</span><b>36 meses</b></div>
            <div className="app-row"><span>Tasa fija</span><b>13,8%</b></div>
            <div className="app-btn">Ver calendario de pagos</div>
          </div>
        </div>
        <motion.div className="float f1" animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>✓ Sin costos ocultos</motion.div>
        <motion.div className="float f2" animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>⚡ Aprobación en 24 h</motion.div>
      </motion.div>
    </section>
  );
}

function Productos({ onPick }) {
  return (
    <section className="section" id="productos">
      <motion.div className="head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
        <p className="eyebrow">Productos</p>
        <h2>Un préstamo para<br />cada momento.</h2>
      </motion.div>
      <div className="products">
        {Object.entries(PRODUCTOS).map(([k, p], i) => (
          <motion.button
            key={k} type="button" className="product" onClick={() => onPick(k)}
            initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fadeUp}
            whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }}
          >
            <span className="p-icon" aria-hidden="true">{p.icono}</span>
            <h3>{p.nombre}</h3>
            <p>{p.desc}</p>
            <dl>
              <div><dt>Desde</dt><dd>{p.tasa}% anual</dd></div>
              <div><dt>Hasta</dt><dd>{money(p.max)}</dd></div>
            </dl>
            <span className="p-link">Simular →</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function Simulador({ tipo, setTipo }) {
  const prod = PRODUCTOS[tipo];
  const [monto, setMonto] = useState(5000);
  const [plazo, setPlazo] = useState(24);
  const [tabla, setTabla] = useState(false);

  useEffect(() => {
    setMonto((m) => Math.min(Math.max(m, prod.min), prod.max));
    setPlazo((p) => Math.min(p, prod.plazoMax));
  }, [tipo]); // eslint-disable-line react-hooks/exhaustive-deps

  const cuota = cuotaFrancesa(monto, prod.tasa, plazo);
  const total = cuota * plazo;
  const filas = useMemo(() => amortizacion(monto, prod.tasa, plazo), [monto, prod.tasa, plazo]);
  const pctCapital = (monto / total) * 100;

  const msg = `Hola Kapital Ya, simulé un préstamo ${prod.nombre}: ${money(monto)} a ${plazo} meses (cuota aprox. ${money(cuota, 2)}). Quiero iniciar mi solicitud.`;

  return (
    <section className="section sim-section" id="simulador">
      <motion.div className="head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
        <p className="eyebrow">Simulador</p>
        <h2>Conoce tu cuota<br />antes de decidir.</h2>
      </motion.div>
      <motion.div className="sim" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
        <div className="sim-controls">
          <div className="seg" role="tablist" aria-label="Tipo de préstamo">
            {Object.entries(PRODUCTOS).map(([k, p]) => (
              <button key={k} role="tab" aria-selected={k === tipo} className={k === tipo ? 'on' : ''} onClick={() => setTipo(k)} type="button">
                {k === tipo && <motion.span layoutId="seg" className="seg-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="seg-t">{p.nombre}</span>
              </button>
            ))}
          </div>
          <label className="range">
            <span>Monto <b>{money(monto)}</b></span>
            <input type="range" min={prod.min} max={prod.max} step={100} value={monto} onChange={(e) => setMonto(+e.target.value)} />
            <span className="lims"><i>{money(prod.min)}</i><i>{money(prod.max)}</i></span>
          </label>
          <label className="range">
            <span>Plazo <b>{plazo} meses</b></span>
            <input type="range" min={6} max={prod.plazoMax} step={6} value={plazo} onChange={(e) => setPlazo(+e.target.value)} />
            <span className="lims"><i>6 meses</i><i>{prod.plazoMax} meses</i></span>
          </label>
        </div>
        <div className="sim-result">
          <span className="label">Cuota mensual</span>
          <AnimatePresence mode="popLayout">
            <motion.strong key={Math.round(cuota * 100)} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.25 }}>
              {money(cuota, 2)}
            </motion.strong>
          </AnimatePresence>
          <div className="split" aria-label={`Capital ${pctCapital.toFixed(0)}% e intereses ${(100 - pctCapital).toFixed(0)}%`}>
            <motion.i className="cap" animate={{ width: `${pctCapital}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          </div>
          <ul className="legend">
            <li><i className="dot cap" />Capital {money(monto)}</li>
            <li><i className="dot int" />Intereses {money(total - monto)}</li>
          </ul>
          <dl className="facts">
            <div><dt>Tasa referencial</dt><dd>{prod.tasa}% anual</dd></div>
            <div><dt>Total a pagar</dt><dd>{money(total)}</dd></div>
          </dl>
          <a className="btn btn-primary btn-block" href={waLink(msg)} target="_blank" rel="noopener noreferrer"><WaIcon /> Solicitar con esta cuota</a>
          <button className="linkbtn" type="button" onClick={() => setTabla((t) => !t)} aria-expanded={tabla}>
            {tabla ? 'Ocultar' : 'Ver'} tabla de amortización
          </button>
        </div>
      </motion.div>
      <AnimatePresence>
        {tabla && (
          <motion.div className="table-wrap" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }}>
            <table>
              <thead><tr><th>#</th><th>Cuota</th><th>Capital</th><th>Interés</th><th>Saldo</th></tr></thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.n}><td>{f.n}</td><td>{money(f.cuota, 2)}</td><td>{money(f.capital, 2)}</td><td>{money(f.interes, 2)}</td><td>{money(f.saldo, 2)}</td></tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="disclaimer">Simulación referencial con sistema de amortización francés. La tasa final depende de tu perfil crediticio y está sujeta a aprobación.</p>
    </section>
  );
}

const PASOS = [
  { t: 'Simula', d: 'Elige monto y plazo. Ves tu cuota exacta en segundos, sin registrarte.' },
  { t: 'Envía', d: 'Mándanos tu solicitud por WhatsApp con tu cédula y un respaldo de ingresos.' },
  { t: 'Recibe', d: 'Evaluamos en menos de 24 horas y el dinero llega directo a tu cuenta.' },
];

function Proceso() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 50%'] });
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <section className="section" id="proceso" ref={ref}>
      <div className="head"><p className="eyebrow">Proceso</p><h2>Tres pasos.<br />Cero filas.</h2></div>
      <div className="steps">
        <div className="rail" aria-hidden="true"><motion.i style={{ height: h }} /></div>
        {PASOS.map((p, i) => (
          <motion.div key={p.t} className="step" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-120px' }} variants={fadeUp}>
            <span className="num">0{i + 1}</span>
            <div><h3>{p.t}</h3><p>{p.d}</p></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats">
      <div><strong><Counter to={12} suffix="k+" /></strong><span>clientes financiados</span></div>
      <div><strong><Counter to={24} suffix=" h" /></strong><span>tiempo de respuesta</span></div>
      <div><strong><Counter to={0} prefix="$" /></strong><span>costos de apertura</span></div>
      <div><strong><Counter to={100} suffix="%" /></strong><span>proceso digital</span></div>
    </section>
  );
}

const FAQ = [
  ['¿Qué requisitos necesito?', 'Cédula vigente, ser mayor de 18 años, un respaldo de ingresos (rol de pagos, RUC o estados de cuenta) y una planilla de servicio básico.'],
  ['¿Puedo pagar antes de tiempo?', 'Sí. Puedes abonar o precancelar tu préstamo en cualquier momento sin penalidad; solo pagas intereses por el tiempo utilizado.'],
  ['¿Revisan el buró de crédito?', 'Sí, consultamos tu historial con tu autorización. Tener un historial corto no te descalifica: evaluamos tu capacidad de pago real.'],
  ['¿Cómo protegen mis datos?', 'Solo pedimos la información necesaria, se transmite cifrada y nunca la compartimos con terceros sin tu consentimiento.'],
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="head"><p className="eyebrow">Preguntas frecuentes</p><h2>Todo claro,<br />desde el inicio.</h2></div>
      <div className="faq">
        {FAQ.map(([q, a], i) => (
          <div key={q} className={`faq-item ${open === i ? 'open' : ''}`}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`faq-${i}`}>
              {q}<motion.span animate={{ rotate: open === i ? 45 : 0 }} aria-hidden="true">+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}>
                  <p>{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

function Solicitud({ tipo }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ nombre: '', ciudad: 'Guayaquil', ingreso: '', producto: tipo, empresa: '' });
  const [error, setError] = useState('');
  useEffect(() => setData((d) => ({ ...d, producto: tipo })), [tipo]);
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });

  const next = () => {
    if (step === 0 && sanitize(data.nombre, 60).length < 2) return setError('Ingresa tu nombre completo.');
    if (step === 1 && !(Number(data.ingreso) > 0)) return setError('Ingresa un ingreso mensual válido.');
    setError('');
    setStep(step + 1);
  };
  const enviar = (e) => {
    e.preventDefault();
    if (data.empresa) return; // honeypot
    if (!throttleOk('kapital')) return setError('Espera unos segundos antes de reenviar.');
    const txt = `Hola Kapital Ya, soy ${sanitize(data.nombre, 60)} de ${sanitize(data.ciudad, 40)}. Ingreso mensual aprox.: ${money(Number(data.ingreso) || 0)}. Me interesa un préstamo ${PRODUCTOS[data.producto].nombre}.`;
    window.open(waLink(txt), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="section apply" id="solicitar">
      <div className="apply-card">
        <div>
          <p className="eyebrow light">Precalificación</p>
          <h2>Empieza ahora.<br />Toma 1 minuto.</h2>
          <ol className="dots" aria-label="Progreso">{[0, 1, 2].map((i) => <li key={i} className={i <= step ? 'on' : ''} />)}</ol>
        </div>
        <form onSubmit={enviar} noValidate>
          <input className="hp" tabIndex={-1} autoComplete="off" value={data.empresa} onChange={set('empresa')} aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.35, ease }} className="fstep">
              {step === 0 && (<>
                <label>¿Cómo te llamas?<input value={data.nombre} onChange={set('nombre')} maxLength={60} autoComplete="name" placeholder="Nombre y apellido" /></label>
                <label>Ciudad<select value={data.ciudad} onChange={set('ciudad')}>{['Guayaquil', 'Quito', 'Cuenca', 'Manta', 'Machala', 'Otra'].map((c) => <option key={c}>{c}</option>)}</select></label>
              </>)}
              {step === 1 && (<>
                <label>Ingreso mensual (USD)<input inputMode="numeric" value={data.ingreso} onChange={(e) => setData({ ...data, ingreso: e.target.value.replace(/\D/g, '').slice(0, 6) })} placeholder="Ej.: 900" /></label>
                <label>Tipo de préstamo<select value={data.producto} onChange={set('producto')}>{Object.entries(PRODUCTOS).map(([k, p]) => <option key={k} value={k}>{p.nombre}</option>)}</select></label>
              </>)}
              {step === 2 && (
                <div className="review">
                  <p><span>Nombre</span>{sanitize(data.nombre, 60)}</p>
                  <p><span>Ciudad</span>{data.ciudad}</p>
                  <p><span>Ingreso</span>{money(Number(data.ingreso) || 0)}</p>
                  <p><span>Producto</span>{PRODUCTOS[data.producto].nombre}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="err" role="alert">{error}</p>
          <div className="factions">
            {step > 0 && <button type="button" className="btn btn-ghost-light" onClick={() => setStep(step - 1)}>Atrás</button>}
            {step < 2 ? <button type="button" className="btn btn-white" onClick={next}>Continuar</button>
              : <button type="submit" className="btn btn-white"><WaIcon /> Enviar por WhatsApp</button>}
          </div>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const [tipo, setTipo] = useState('personal');
  const pick = (k) => { setTipo(k); document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <>
      <a className="skip" href="#simulador">Ir al simulador</a>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Productos onPick={pick} />
        <Simulador tipo={tipo} setTipo={setTipo} />
        <Proceso />
        <Faq />
        <Solicitud tipo={tipo} />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Kapital Ya. Marca ficticia · proyecto demostrativo de portafolio.</p>
        <p>Desarrollado por <a href="../../">Edwin Ramiro Cordero Navarrete</a></p>
      </footer>
      <a className="wa-float" href={waLink('Hola Kapital Ya, necesito ayuda con un préstamo.')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WaIcon /></a>
    </>
  );
}
