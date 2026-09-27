<script>
  // Casa ilustrada en SVG. variant: 'build' (controlada por progreso) | 'before' | 'after'
  export let variant = 'build';
  export let draw = 1; // 0..1 trazo de planos
  export let fill = 1; // 0..1 muros y materiales
  export let glow = 1; // 0..1 luces y paisajismo
  export let blueprint = 0; // 1 = fondo de plano azul

  $: d = variant === 'build' ? draw : 1;
  $: f = variant === 'build' ? fill : 1;
  $: g = variant === 'build' ? glow : 1;
  $: bp = variant === 'build' ? blueprint : 0;
  $: dash = `stroke-dasharray:1;stroke-dashoffset:${1 - d}`;
</script>

<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img"
  aria-label={variant === 'before' ? 'Casa antes de la remodelación' : 'Casa moderna remodelada'}>
  <defs>
    <linearGradient id="sky-{variant}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color={variant === 'before' ? '#6b6f73' : '#1b2a4a'} />
      <stop offset="1" stop-color={variant === 'before' ? '#b9b3a6' : '#ff9a5a'} />
    </linearGradient>
    <pattern id="grid-{variant}" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1" />
    </pattern>
    <linearGradient id="wood-{variant}" x1="0" x2="1">
      <stop offset="0" stop-color="#8a5a35" /><stop offset="1" stop-color="#c18a57" />
    </linearGradient>
    <radialGradient id="light-{variant}" cx=".5" cy=".5" r=".6">
      <stop offset="0" stop-color="#ffd9a0" /><stop offset="1" stop-color="#ff9f43" />
    </radialGradient>
  </defs>

  {#if variant === 'before'}
    <rect width="800" height="500" fill="url(#sky-before)" />
    <rect y="440" width="800" height="60" fill="#6f6a55" />
    <!-- techo viejo a dos aguas -->
    <path d="M130 250 L310 130 L490 250Z" fill="#5a4b43" />
    <path d="M200 205 l30 -8 M380 190 l40 12" stroke="#3b302a" stroke-width="4" />
    <rect x="150" y="250" width="320" height="190" fill="#9c978c" />
    <path d="M170 270 l40 60 l-10 40 M430 300 l-30 50 l15 30" stroke="#6d6960" stroke-width="3" fill="none" />
    <rect x="180" y="285" width="100" height="90" fill="#4a4a45" />
    <path d="M180 300h100M180 330h100M180 360h100" stroke="#7c6b55" stroke-width="10" />
    <rect x="330" y="320" width="60" height="120" fill="#5b4636" />
    <rect x="470" y="310" width="170" height="130" fill="#8a857a" />
    <rect x="490" y="340" width="130" height="100" fill="#6a665e" />
    <path d="M490 360h130M490 380h130M490 400h130M490 420h130" stroke="#5c584f" stroke-width="3" />
    <!-- cerca rota y árbol seco -->
    <path d="M20 440v-50M50 440v-40M80 440v-55M110 440v-30M20 405h90" stroke="#5b5144" stroke-width="5" />
    <path d="M720 440V300M720 330l-40-40M720 350l35-45M700 310l-20-10" stroke="#4d4035" stroke-width="7" fill="none" stroke-linecap="round" />
    <ellipse cx="560" cy="452" rx="60" ry="6" fill="#57533f" />
  {:else}
    <rect width="800" height="500" fill="url(#sky-{variant})" opacity={1 - bp} />
    <rect width="800" height="500" fill="#0d3b66" opacity={bp} />
    <rect width="800" height="500" fill="url(#grid-{variant})" opacity={bp} />
    <circle cx="640" cy="120" r="46" fill="#ffd1a3" opacity={0.85 * (1 - bp)} />
    <rect y="440" width="800" height="60" fill="#1f2a1c" opacity={f} />

    <g fill="none" stroke={bp > 0.5 ? '#e6f0ff' : '#ff5a1f'} stroke-width="2.5">
      <rect pathLength="1" style={dash} x="150" y="240" width="320" height="200" />
      <rect pathLength="1" style={dash} x="260" y="120" width="300" height="120" />
      <rect pathLength="1" style={dash} x="240" y="106" width="340" height="14" />
      <rect pathLength="1" style={dash} x="470" y="300" width="180" height="140" />
      <rect pathLength="1" style={dash} x="290" y="140" width="240" height="80" />
      <rect pathLength="1" style={dash} x="180" y="280" width="110" height="110" />
      <rect pathLength="1" style={dash} x="320" y="320" width="60" height="120" />
      <rect pathLength="1" style={dash} x="490" y="330" width="140" height="110" />
      <path pathLength="1" style={dash} d="M40 440H760" />
      <!-- cotas -->
      <path pathLength="1" style={dash} d="M150 470H650M150 462v16M650 462v16" opacity={bp} />
      <path pathLength="1" style={dash} d="M680 106V440M672 106h16M672 440h16" opacity={bp} />
    </g>
    {#if bp > 0.3}
      <text x="400" y="492" fill="#e6f0ff" font-size="13" text-anchor="middle" font-family="monospace" opacity={bp}>20.00 m</text>
      <text x="700" y="280" fill="#e6f0ff" font-size="13" font-family="monospace" opacity={bp}>6.80 m</text>
    {/if}

    <g opacity={f}>
      <rect x="150" y="240" width="320" height="200" fill="#ece7df" />
      <rect x="260" y="120" width="300" height="120" fill="#2b2b2b" />
      <rect x="240" y="106" width="340" height="14" fill="#1a1a1a" />
      <rect x="470" y="300" width="180" height="140" fill="url(#wood-{variant})" />
      {#each Array(12) as _, i}<rect x={476 + i * 15} y="300" width="3" height="140" fill="#6e4526" opacity=".5" />{/each}
      <rect x="290" y="140" width="240" height="80" fill="#1e3348" />
      <rect x="180" y="280" width="110" height="110" fill="#1e3348" />
      <rect x="320" y="320" width="60" height="120" fill="#3a2718" />
      <rect x="490" y="330" width="140" height="110" fill="#333" />
    </g>
    <g opacity={g}>
      <rect x="290" y="140" width="240" height="80" fill="url(#light-{variant})" opacity=".85" />
      <rect x="180" y="280" width="110" height="110" fill="url(#light-{variant})" opacity=".75" />
      <path d="M410 140v80M350 140v80M470 140v80M235 280v110" stroke="#2b2b2b" stroke-width="4" />
      <circle cx="372" cy="382" r="3" fill="#ffcf8a" />
      <ellipse cx="560" cy="446" rx="120" ry="6" fill="#ffb066" opacity=".25" />
      <circle cx="90" cy="360" r="55" fill="#2f5a34" /><circle cx="60" cy="385" r="40" fill="#3b6e40" /><rect x="86" y="380" width="8" height="60" fill="#3b2a1c" />
      <circle cx="720" cy="415" r="28" fill="#3b6e40" /><circle cx="748" cy="425" r="20" fill="#2f5a34" />
      <rect x="150" y="436" width="500" height="4" fill="#ff5a1f" opacity=".7" />
    </g>
  {/if}
</svg>

<style>
  svg { width: 100%; height: 100%; display: block; }
</style>
