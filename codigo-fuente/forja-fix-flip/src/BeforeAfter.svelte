<script>
  import House from './House.svelte';
  let pos = 50;
</script>

<div class="ba" style="--pos:{pos}%">
  <div class="layer"><House variant="after" /></div>
  <div class="layer before"><House variant="before" /></div>
  <span class="lbl l">ANTES</span>
  <span class="lbl r">DESPUÉS</span>
  <div class="handle" aria-hidden="true"><span>‹ ›</span></div>
  <input type="range" min="0" max="100" step="0.5" bind:value={pos} aria-label="Comparar antes y después de la remodelación" />
</div>

<style>
  .ba { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border: 1px solid var(--line); background: #111; user-select: none; }
  .layer { position: absolute; inset: 0; }
  .before { clip-path: inset(0 calc(100% - var(--pos)) 0 0); }
  .handle { position: absolute; top: 0; bottom: 0; left: var(--pos); width: 2px; background: var(--orange); transform: translateX(-1px); pointer-events: none; }
  .handle span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 54px; height: 54px; border-radius: 50%; background: var(--orange); color: #000; display: grid; place-items: center; font-weight: 800; letter-spacing: 0.1em; box-shadow: 0 0 0 8px rgba(255, 90, 31, 0.25); }
  .lbl { position: absolute; top: 16px; padding: 0.35rem 0.8rem; background: rgba(0, 0, 0, 0.6); font-family: var(--display); letter-spacing: 0.2em; font-size: 0.8rem; pointer-events: none; }
  .l { left: 16px; } .r { right: 16px; }
  input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }
  input:focus-visible + .handle, .ba:focus-within .handle span { outline: 3px solid #fff; }
</style>
