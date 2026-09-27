<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import House from './House.svelte';
  import BeforeAfter from './BeforeAfter.svelte';
  import Calc from './Calc.svelte';
  import { waLink, sanitize, throttleOk } from './wa.js';

  gsap.registerPlugin(ScrollTrigger);

  // Progreso de la secuencia "del plano a la llave"
  let p = 0;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  $: draw = clamp(p / 0.35);
  $: blueprint = 1 - clamp((p - 0.35) / 0.2);
  $: fill = clamp((p - 0.4) / 0.25);
  $: glow = clamp((p - 0.7) / 0.25);
  $: stage = p < 0.35 ? 0 : p < 0.7 ? 1 : 2;

  const etapas = [
    { t: 'PLANOS', d: 'Arquitectura, ingeniería y permisos municipales listos antes de mover una piedra.' },
    { t: 'OBRA', d: 'Cuadrillas propias, cronograma semanal y reportes con fotos cada viernes.' },
    { t: 'ENTREGA', d: 'Acabados premium, garantía por escrito y llaves en tu mano.' },
  ];

  const servicios = [
    { n: '01', t: 'Fix & Flip', d: 'Compramos propiedades con potencial, las remodelamos y las vendemos revalorizadas. Participa como inversionista.' },
    { n: '02', t: 'Remodelación integral', d: 'Cocinas, baños, fachadas, pisos, instalaciones eléctricas y sanitarias. Un solo responsable.' },
    { n: '03', t: 'Vivienda nueva', d: 'Diseñamos y construimos tu casa desde el terreno: planos, permisos, obra gris y acabados.' },
    { n: '04', t: 'Ampliaciones', d: 'Segundo piso, terrazas, cuartos adicionales y locales comerciales con estructura garantizada.' },
  ];

  const proyectos = [
    { z: 'Urdesa Central', compra: 92000, venta: 168000, dias: 118, tipo: 'Fix & Flip' },
    { z: 'Ceibos Norte', compra: 145000, venta: 245000, dias: 150, tipo: 'Fix & Flip' },
    { z: 'Vía a Samborondón', compra: 0, venta: 210000, dias: 240, tipo: 'Vivienda nueva' },
  ];
  const money = (n) => n.toLocaleString('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  // Formulario
  let nombre = '', tipo = 'Remodelación', presupuesto = '10.000 – 30.000', detalle = '', trampa = '', error = '';
  function enviar() {
    if (trampa) return;
    const n = sanitize(nombre, 60);
    if (n.length < 2) { error = 'Escribe tu nombre.'; return; }
    if (!throttleOk('forja')) { error = 'Espera unos segundos antes de reenviar.'; return; }
    error = '';
    const d = sanitize(detalle, 400);
    window.open(waLink(`Hola Forja, soy ${n}. Proyecto: ${tipo}. Presupuesto: $${presupuesto}.${d ? ' ' + d : ''}`), '_blank', 'noopener,noreferrer');
  }

  let solid = false;
  onMount(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => (solid = scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true });

    const ctx = gsap.context(() => {
      if (reduce) { p = 1; return; }
      gsap.from('.hero .mask > span', { yPercent: 110, duration: 1.3, stagger: 0.1, ease: 'expo.out', delay: 0.15 });
      gsap.from('.hero .sub, .hero .ctas, .ticker', { y: 30, opacity: 0, duration: 1, stagger: 0.12, delay: 0.7, ease: 'power3.out' });
      gsap.to('.hero-bg', { yPercent: 25, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

      ScrollTrigger.create({
        trigger: '.build', start: 'top top', end: '+=250%', pin: true, scrub: 0.6,
        onUpdate: (s) => (p = s.progress),
      });

      gsap.utils.toArray('.svc').forEach((el, i) =>
        gsap.from(el, { y: 80, opacity: 0, duration: 1, ease: 'power4.out', delay: (i % 2) * 0.1, scrollTrigger: { trigger: el, start: 'top 88%' } }));
      gsap.utils.toArray('.reveal').forEach((el) =>
        gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));
      gsap.utils.toArray('.bigtype').forEach((el) =>
        gsap.fromTo(el, { xPercent: 10 }, { xPercent: -25, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));
    });
    return () => { ctx.revert(); removeEventListener('scroll', onScroll); };
  });
</script>

<a class="skip" href="#calculadora">Ir a la calculadora</a>
<header class="nav" class:solid>
  <a class="logo" href="#top" aria-label="Forja Fix and Flip, inicio"><span class="mark" aria-hidden="true"></span>FORJA<small>FIX &amp; FLIP</small></a>
  <nav aria-label="Principal">
    <ul>
      <li><a href="#servicios">Servicios</a></li>
      <li><a href="#antes-despues">Antes / Después</a></li>
      <li><a href="#calculadora">Calculadora</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
  </nav>
  <a class="btn btn-o" href={waLink('Hola Forja, quiero cotizar una remodelación.')} target="_blank" rel="noopener noreferrer">Cotizar obra</a>
</header>

<main>
  <section class="hero" id="top">
    <div class="hero-bg" aria-hidden="true"><House variant="after" /></div>
    <div class="shade" aria-hidden="true"></div>
    <div class="hero-in">
      <p class="eyebrow">Remodelación · Construcción · Inversión</p>
      <h1>
        <span class="mask"><span>COMPRAMOS.</span></span>
        <span class="mask"><span>REMODELAMOS.</span></span>
        <span class="mask"><span class="o">REVALORIZAMOS.</span></span>
      </h1>
      <p class="sub">Forja es el brazo de remodelación y construcción del grupo. Transformamos viviendas olvidadas en hogares que valen más, y construimos casas nuevas desde cero.</p>
      <div class="ctas">
        <a class="btn btn-o" href="#calculadora">Calcular mi Fix &amp; Flip</a>
        <a class="btn btn-w" href="#antes-despues">Ver transformación</a>
      </div>
    </div>
    <div class="ticker" aria-hidden="true">
      <div class="tk">
        {#each Array(2) as _}
          <span>COCINAS</span><i>/</i><span>BAÑOS</span><i>/</i><span>FACHADAS</span><i>/</i><span>OBRA NUEVA</span><i>/</i><span>AMPLIACIONES</span><i>/</i><span>INVERSIÓN INMOBILIARIA</span><i>/</i>
        {/each}
      </div>
    </div>
  </section>

  <section class="build" aria-label="Del plano a la llave">
    <div class="build-in">
      <div class="build-copy">
        <p class="eyebrow">Del plano a la llave</p>
        {#each etapas as e, i}
          <div class="etapa" class:on={stage === i}>
            <span class="en">0{i + 1}</span>
            <div><h2>{e.t}</h2><p>{e.d}</p></div>
          </div>
        {/each}
        <div class="meter" aria-hidden="true"><i style="width:{p * 100}%"></i></div>
      </div>
      <div class="build-art">
        <House variant="build" {draw} {fill} {glow} {blueprint} />
      </div>
    </div>
  </section>

  <section class="sec" id="servicios">
    <p class="bigtype" aria-hidden="true">CONSTRUIMOS VALOR</p>
    <div class="wrap">
      <p class="eyebrow reveal">Servicios</p>
      <h2 class="h2 reveal">Una sola empresa.<br />Toda la obra.</h2>
      <div class="svcs">
        {#each servicios as s}
          <article class="svc">
            <span class="sn">{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <a href={waLink(`Hola Forja, me interesa el servicio: ${s.t}.`)} target="_blank" rel="noopener noreferrer">Consultar →</a>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section class="sec" id="antes-despues">
    <div class="wrap">
      <p class="eyebrow reveal">Antes / Después</p>
      <h2 class="h2 reveal">Desliza. Mira la<br /><span class="o">transformación.</span></h2>
      <div class="reveal"><BeforeAfter /></div>
    </div>
  </section>

  <section class="sec" id="calculadora">
    <div class="wrap">
      <p class="eyebrow reveal">Para inversionistas</p>
      <h2 class="h2 reveal">Calculadora<br />Fix &amp; Flip.</h2>
      <div class="reveal"><Calc /></div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <p class="eyebrow reveal">Proyectos recientes</p>
      <h2 class="h2 reveal">Números que<br />hablan solos.</h2>
      <div class="projs">
        {#each proyectos as pr}
          <article class="proj reveal">
            <p class="pt">{pr.tipo}</p>
            <h3>{pr.z}</h3>
            <dl>
              {#if pr.compra}<div><dt>Compra + obra</dt><dd>{money(pr.compra)}</dd></div>{/if}
              <div><dt>{pr.compra ? 'Vendida en' : 'Valor final'}</dt><dd class="o">{money(pr.venta)}</dd></div>
              <div><dt>Duración</dt><dd>{pr.dias} días</dd></div>
            </dl>
          </article>
        {/each}
      </div>
      <p class="fine">Proyectos ilustrativos para este portafolio demostrativo.</p>
    </div>
  </section>

  <section class="sec contact" id="contacto">
    <div class="wrap cgrid">
      <div>
        <p class="eyebrow reveal">Contacto</p>
        <h2 class="h2 reveal">¿Qué vamos<br />a construir?</h2>
        <p class="lead reveal">Visita técnica sin costo en Guayaquil y Samborondón. Presupuesto detallado en 72 horas.</p>
      </div>
      <form class="form reveal" on:submit|preventDefault={enviar} novalidate>
        <input class="hp" tabindex="-1" autocomplete="off" bind:value={trampa} aria-hidden="true" />
        <label>Nombre<input bind:value={nombre} maxlength="60" autocomplete="name" /></label>
        <label>Tipo de proyecto
          <select bind:value={tipo}>
            <option>Remodelación</option><option>Fix &amp; Flip / Inversión</option><option>Vivienda nueva</option><option>Ampliación</option>
          </select>
        </label>
        <label>Presupuesto aproximado (USD)
          <select bind:value={presupuesto}>
            <option>5.000 – 10.000</option><option>10.000 – 30.000</option><option>30.000 – 80.000</option><option>80.000 o más</option>
          </select>
        </label>
        <label>Detalles<textarea bind:value={detalle} rows="3" maxlength="400" placeholder="Ej.: remodelar cocina y 2 baños en Urdesa"></textarea></label>
        <p class="err" role="alert">{error}</p>
        <button class="btn btn-o" type="submit">Enviar por WhatsApp</button>
      </form>
    </div>
  </section>
</main>

<footer class="footer">
  <p>© {new Date().getFullYear()} Forja Fix &amp; Flip · Marca ficticia, proyecto demostrativo de portafolio.</p>
  <p>Desarrollado por <a href="../../">Edwin Ramiro Cordero Navarrete</a> · Svelte + GSAP</p>
</footer>
<a class="wa-float" href={waLink('Hola Forja, quiero información sobre remodelación y construcción.')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.3 23.7l6.2-1.6A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.5-8.5ZM12 21.6a9.7 9.7 0 0 1-5-1.4l-.3-.2-3.7 1 1-3.6-.2-.4A9.7 9.7 0 1 1 12 21.6Zm5.3-7.3c-.3-.1-1.7-.9-2-1s-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3Z"/></svg>
</a>
