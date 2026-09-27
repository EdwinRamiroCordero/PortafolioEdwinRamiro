<div align="center">

# Edwin Ramiro Cordero Navarrete

**Ingeniero en Tecnologías de la Información · Desarrollador Full-Stack · IA aplicada**

[Ver portafolio en vivo](https://edwinramirocordero.github.io/PortafolioEdwinRamiro/) ·
[WhatsApp](https://wa.me/593960913089) ·
[GitHub](https://github.com/EdwinRamiroCordero)

</div>

---

## Sobre este repositorio

Este repositorio contiene **mi portafolio personal** y **cinco sitios web profesionales** desarrollados para un grupo empresarial con cinco divisiones de negocio. Cada sitio se construyó con **una técnica distinta** para demostrar versatilidad, manteniendo el mismo estándar: diseño moderno inspirado en Apple y SpaceX, animaciones fluidas, interactividad real, contacto por WhatsApp y seguridad desde el diseño.

## Los 5 sitios web

| # | Negocio | Marca | Técnica | Lo más destacado | Demo |
|---|---------|-------|---------|------------------|------|
| 1 | Bienes raíces | **Altura Propiedades** | HTML + JS vanilla + GSAP ScrollTrigger + Lenis | Skyline SVG que se dibuja, galería horizontal fijada al scroll, buscador con filtros, calculadora hipotecaria | [Abrir](https://edwinramirocordero.github.io/PortafolioEdwinRamiro/proyectos/altura-propiedades/) |
| 2 | Préstamos | **Kapital Ya** | React 18 + Framer Motion | Mockup de app con scroll 3D, simulador con amortización francesa, solicitud en 3 pasos | [Abrir](https://edwinramirocordero.github.io/PortafolioEdwinRamiro/proyectos/kapital-ya/) |
| 3 | Seguros | **Égida Seguros** | Three.js (WebGL) + GSAP | 8.000 partículas 3D que se transforman (esfera → escudo → nudo → galaxia) según la sección, cotizador multi-cobertura | [Abrir](https://edwinramirocordero.github.io/PortafolioEdwinRamiro/proyectos/egida-seguros/) |
| 4 | Impuestos | **Tributa** | Tailwind CSS + Alpine.js (CSP) + CSS Scroll-Driven Animations | Animaciones nativas sin JavaScript, calendario SRI por noveno dígito, checklist de Renta | [Abrir](https://edwinramirocordero.github.io/PortafolioEdwinRamiro/proyectos/tributa/) |
| 5 | Remodelación y construcción | **Forja Fix & Flip** | Svelte + GSAP ScrollTrigger | Del plano a la casa terminada con el scroll, comparador antes/después, calculadora Fix & Flip (regla del 70%) | [Abrir](https://edwinramirocordero.github.io/PortafolioEdwinRamiro/proyectos/forja-fix-flip/) |

> Las marcas y cifras de los sitios son ficticias y existen solo con fines demostrativos.

### Seguridad aplicada en todos los sitios

- **Content-Security-Policy** estricta: solo scripts propios (`script-src 'self'`), sin `eval`, sin CDNs de terceros, `object-src 'none'`.
- **Cero dependencias externas en tiempo de ejecución**: fuentes y librerías empaquetadas localmente (no hay rastreadores ni llamadas a terceros).
- **Entradas saneadas** antes de construir mensajes de WhatsApp (se eliminan caracteres de control y etiquetas, con límites de longitud).
- **Honeypot anti-bots** y **limitador de envíos** en los formularios.
- Enlaces externos con `rel="noopener noreferrer"` y política `Referrer-Policy`.
- Renderizado con `textContent` / DOM seguro en lugar de `innerHTML` con datos del usuario.
- Alpine.js en su **build CSP** (compatible con políticas sin `unsafe-eval`).
- Accesibilidad: navegación por teclado, `aria-*`, enlaces de salto y respeto a `prefers-reduced-motion`.

## Proyectos destacados

### Tesis · Extracción de texto con Vision-Language Models
Pipeline en cascada **EasyOCR → InternVL2-2B (QLoRA / NF4) → Gemini** con arquitectura DDD (Ports & Adapters) y un protocolo de liberación de VRAM para GPUs modestas. Evaluado con **CER, WER, F1 y ANLS**. Presentado en la conferencia AENIT.
`Python` `PyTorch` `InternVL2` `Qwen2-VL` `EasyOCR` `Gemini`

### Phanzly · SaaS de gestión de redes sociales (fundador)
Plataforma multi-tenant con publicación omnicanal (Facebook, Instagram, TikTok, WhatsApp, LinkedIn, Telegram), bandeja con respuesta automática por IA (Groq · Llama 3.3 70B), calendario, analítica y hardening de seguridad.
`Next.js 15` `TypeScript` `Supabase` `Tailwind` `Vercel`

### Progracademy · Fe y Alegría Ecuador
Bot para Microsoft Teams con módulos en Power Automate para docentes, pruebas de estrés con más de 30 dispositivos, mejoras a la plataforma Moodle CECAL y capacitaciones docentes.
`Microsoft Teams` `Power Automate` `Moodle`

### Proyecto A3 · Asistente estilo JARVIS
Asistente de IA con activación desde reloj inteligente (Mibro Watch A3), memoria semántica y backend propio.
`FastAPI` `Groq` `Supabase pgvector`

### CCOFIG.AI · Auditoría de pipeline agéntico
Auditoría técnica y análisis de brechas de un sistema de evaluación de tutorías con LLMs.
`Apps Script` `Gemini` `MySQL`

### Lexum · Sistema de gestión legal
Sistema dockerizado desplegado y mantenido para un cliente.
`Docker` `PostgreSQL` `Node.js` `React`

## Estructura

```
PortafolioEdwinRamiro/
├── index.html, assets/          ← portafolio compilado (lo que publica GitHub Pages)
├── proyectos/                   ← los 5 sitios compilados
│   ├── altura-propiedades/
│   ├── kapital-ya/
│   ├── egida-seguros/
│   ├── tributa/
│   └── forja-fix-flip/
├── codigo-fuente/               ← código fuente de cada proyecto (Vite)
│   ├── portafolio/  ├── altura-propiedades/  ├── kapital-ya/
│   ├── egida-seguros/  ├── tributa/  ├── forja-fix-flip/
│   └── _compartido/wa.js        ← utilidades seguras de WhatsApp
└── scripts/build.mjs            ← compila todo y copia el resultado a la raíz
```

## Desarrollo local

Requisitos: Node.js 18 o superior.

```bash
# Ver un proyecto en modo desarrollo
cd codigo-fuente/egida-seguros
npm install
npm run dev

# Compilar todo y actualizar la versión publicada
npm run build        # desde la raíz del repositorio
```

## Publicación en GitHub Pages

1. Sube el repositorio a GitHub.
2. En **Settings → Pages**, elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. En uno o dos minutos el portafolio estará en `https://edwinramirocordero.github.io/PortafolioEdwinRamiro/`.

## Contacto

- WhatsApp: [096 091 3089](https://wa.me/593960913089)
- GitHub: [@EdwinRamiroCordero](https://github.com/EdwinRamiroCordero)

---

<sub>© 2026 Edwin Ramiro Cordero Navarrete · Licencia MIT</sub>
