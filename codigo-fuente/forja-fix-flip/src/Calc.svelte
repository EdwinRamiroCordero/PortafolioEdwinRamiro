<script>
  import { waLink } from './wa.js';
  let compra = 85000;
  let remodelacion = 30000;
  let arv = 160000; // After Repair Value: valor de venta tras remodelar
  let meses = 5;
  let mensual = 600; // costos de tenencia: servicios, impuestos, seguro, intereses
  let cierrePct = 6; // comisiones, escrituras y gastos de venta

  const money = (n) => n.toLocaleString('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  $: tenencia = meses * mensual;
  $: cierre = arv * (cierrePct / 100);
  $: inversion = compra + remodelacion + tenencia;
  $: ganancia = arv - inversion - cierre;
  $: roi = inversion > 0 ? (ganancia / inversion) * 100 : 0;
  $: maxOferta = arv * 0.7 - remodelacion; // regla del 70%
  $: cumple = compra <= maxOferta;
  $: veredicto = roi >= 20 && cumple ? 'EXCELENTE' : roi >= 10 ? 'VIABLE' : roi > 0 ? 'AJUSTADO' : 'NO CONVIENE';
  $: color = roi >= 20 && cumple ? '#22c55e' : roi >= 10 ? '#ff5a1f' : roi > 0 ? '#eab308' : '#ef4444';
  $: msg = `Hola Forja, analicé un Fix & Flip: compra ${money(compra)}, remodelación ${money(remodelacion)}, venta estimada ${money(arv)}. ROI ${roi.toFixed(1)}%. Quiero que lo evalúen.`;

  const fields = [
    { k: 'compra', label: 'Precio de compra', min: 20000, max: 400000, step: 1000, fmt: money },
    { k: 'remodelacion', label: 'Costo de remodelación', min: 5000, max: 150000, step: 1000, fmt: money },
    { k: 'arv', label: 'Valor de venta tras remodelar (ARV)', min: 30000, max: 600000, step: 1000, fmt: money },
    { k: 'meses', label: 'Meses del proyecto', min: 1, max: 18, step: 1, fmt: (v) => `${v} meses` },
    { k: 'mensual', label: 'Costos mensuales de tenencia', min: 0, max: 3000, step: 50, fmt: money },
    { k: 'cierrePct', label: 'Gastos de venta y cierre', min: 0, max: 12, step: 0.5, fmt: (v) => `${v}%` },
  ];
  let vals = { compra, remodelacion, arv, meses, mensual, cierrePct };
  $: ({ compra, remodelacion, arv, meses, mensual, cierrePct } = vals);
</script>

<div class="calc">
  <div class="inputs">
    {#each fields as f}
      <label>
        <span class="row"><span>{f.label}</span><b>{f.fmt(vals[f.k])}</b></span>
        <input type="range" min={f.min} max={f.max} step={f.step} bind:value={vals[f.k]} />
      </label>
    {/each}
  </div>
  <div class="out">
    <span class="k">Ganancia neta estimada</span>
    <strong class="big" style="color:{ganancia >= 0 ? '#fff' : '#ef4444'}">{money(ganancia)}</strong>
    <div class="badge" style="--c:{color}">{veredicto} · ROI {roi.toFixed(1)}%</div>
    <dl>
      <div><dt>Inversión total</dt><dd>{money(inversion)}</dd></div>
      <div><dt>Tenencia</dt><dd>{money(tenencia)}</dd></div>
      <div><dt>Gastos de cierre</dt><dd>{money(cierre)}</dd></div>
      <div><dt>Oferta máx. (regla 70%)</dt><dd class:ok={cumple} class:bad={!cumple}>{money(maxOferta)}</dd></div>
    </dl>
    <p class="note">La regla del 70% sugiere no pagar más del 70% del ARV menos el costo de remodelación. Cálculo referencial.</p>
    <a class="btn" href={waLink(msg)} target="_blank" rel="noopener noreferrer">Evaluar esta propiedad con Forja</a>
  </div>
</div>

<style>
  .calc { display: grid; grid-template-columns: 1.1fr 1fr; border: 1px solid var(--line); }
  .inputs { display: grid; gap: 1.6rem; padding: clamp(20px, 3vw, 40px); }
  label { display: grid; gap: 0.6rem; }
  .row { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.9rem; color: var(--muted); }
  .row b { color: #fff; font-family: var(--display); font-size: 1.3rem; letter-spacing: 0.02em; }
  input { width: 100%; accent-color: var(--orange); }
  .out { background: #141414; padding: clamp(20px, 3vw, 40px); display: grid; gap: 1rem; align-content: start; border-left: 1px solid var(--line); }
  .k { color: var(--muted); text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.75rem; }
  .big { font-family: var(--display); font-size: clamp(3rem, 7vw, 5.5rem); line-height: 1; letter-spacing: -0.01em; }
  .badge { justify-self: start; padding: 0.45rem 0.9rem; border: 1px solid var(--c); color: var(--c); font-family: var(--display); letter-spacing: 0.15em; font-size: 0.9rem; }
  dl { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--line); padding-top: 1rem; }
  dt { color: var(--muted); font-size: 0.78rem; }
  dd { font-family: var(--display); font-size: 1.3rem; }
  .ok { color: #22c55e; } .bad { color: #ef4444; }
  .note { color: var(--muted); font-size: 0.8rem; }
  .btn { display: block; text-align: center; background: var(--orange); color: #000; padding: 1rem; font-family: var(--display); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; transition: background 0.3s; }
  .btn:hover { background: #ff7a45; }
  @media (max-width: 860px) { .calc { grid-template-columns: 1fr; } .out { border-left: 0; border-top: 1px solid var(--line); } }
</style>
