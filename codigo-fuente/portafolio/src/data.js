// Contenido del portafolio. Edita este archivo para actualizar textos sin tocar el diseño.

export const perfil = {
  nombre: 'Edwin Ramiro Cordero Navarrete',
  corto: 'Edwin Cordero',
  roles: ['Ingeniero en Tecnologías de la Información · UTN', 'Desarrollador Full-Stack', 'IA aplicada y Visión por Computador', 'Fundador de Phanzly'],
  ubicacion: 'Quito · Guayaquil, Ecuador',
  github: 'https://github.com/EdwinRamiroCordero',
  whatsapp: 'Hola Edwin, vi tu portafolio y me gustaría conversar sobre un proyecto.',
};

// Sitios web creados para la oferta laboral (grupo con 5 divisiones de negocio)
export const sitios = [
  {
    slug: 'altura-propiedades', nombre: 'Altura Propiedades', rubro: 'Bienes raíces',
    metodo: 'HTML + JavaScript vanilla + GSAP ScrollTrigger + Lenis',
    efectos: ['Skyline SVG que se dibuja', 'Galería horizontal fijada al scroll', 'Texto que se revela palabra por palabra', 'Buscador con filtros y calculadora hipotecaria'],
    colores: ['#0b0b0c', '#d6b46a'],
  },
  {
    slug: 'kapital-ya', nombre: 'Kapital Ya', rubro: 'Préstamos',
    metodo: 'React 18 + Framer Motion (Vite)',
    efectos: ['Mockup de app con scroll 3D', 'Simulador con amortización francesa', 'Tabla de amortización animada', 'Solicitud multi-paso a WhatsApp'],
    colores: ['#f6f7fb', '#5b3df5'],
  },
  {
    slug: 'egida-seguros', nombre: 'Égida Seguros', rubro: 'Seguros',
    metodo: 'Three.js (WebGL) + GSAP',
    efectos: ['8.000 partículas que se transforman: esfera → escudo → nudo → galaxia', 'El color 3D cambia según el seguro elegido', 'Cotizador multi-cobertura', 'Tipografía animada letra por letra'],
    colores: ['#030712', '#22d3ee'],
  },
  {
    slug: 'tributa', nombre: 'Tributa', rubro: 'Impuestos',
    metodo: 'Tailwind CSS + Alpine.js (build CSP) + CSS Scroll-Driven Animations',
    efectos: ['Animaciones nativas con animation-timeline (sin JS)', 'Calendario SRI por noveno dígito', 'Checklist interactivo de Renta', 'Planes mensual/anual'],
    colores: ['#ffffff', '#039855'],
  },
  {
    slug: 'forja-fix-flip', nombre: 'Forja Fix & Flip', rubro: 'Remodelación y construcción',
    metodo: 'Svelte + GSAP ScrollTrigger',
    efectos: ['Del plano a la casa terminada con scroll', 'Comparador antes/después arrastrable', 'Calculadora Fix & Flip con regla del 70%', 'Marquesina y tipografía gigante'],
    colores: ['#0a0a0a', '#ff5a1f'],
  },
];

// Proyectos profesionales y académicos
export const proyectos = [
  {
    id: 'tesis', tag: 'Tesis de ingeniería · UTN', titulo: 'Extracción de texto en imágenes con Vision-Language Models',
    resumen: 'Pipeline híbrido que combina OCR clásico con modelos de visión y lenguaje para leer documentos, facturas, carteles y escritura difícil con mayor precisión.',
    puntos: [
      'Arquitectura en cascada: EasyOCR → InternVL2-2B cuantizado (QLoRA / NF4) → Gemini como respaldo',
      'Diseño DDD con Ports & Adapters y protocolo "Hard Clean" de liberación de VRAM para GPUs modestas',
      'Evaluación con métricas CER, WER, F1 y ANLS sobre 6 categorías de imágenes',
      'Presentado en la conferencia AENIT; en preparación para revista Q1',
    ],
    stack: ['Python', 'PyTorch', 'InternVL2', 'Qwen2-VL', 'EasyOCR', 'Gemini API', 'QLoRA'],
    color: '#7c5cff',
  },
  {
    id: 'phanzly', tag: 'Fundador y desarrollador principal', titulo: 'Phanzly · SaaS de gestión de redes sociales',
    resumen: 'Plataforma multi-tenant para que equipos y agencias publiquen, respondan y midan en todas sus redes desde un solo lugar.',
    puntos: [
      'Publicación omnicanal: Facebook, Instagram, TikTok, WhatsApp (Meta Cloud API), LinkedIn y Telegram',
      'Bandeja de Telegram con respuesta automática por IA (Groq · Llama 3.3 70B) y base de conocimiento',
      'Calendario drag-and-drop, analítica por plataforma y por miembro, invitaciones de equipo',
      'Seguridad: RLS en Supabase, rate limiting y cabeceras de seguridad; verificación de negocio de Meta aprobada',
    ],
    stack: ['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind', 'Vercel', 'Groq', 'Meta Graph API'],
    color: '#22d3ee',
  },
  {
    id: 'progracademy', tag: 'Progracademy · Fe y Alegría Ecuador', titulo: 'Tecnología educativa para comunidades',
    resumen: 'Trabajo técnico en una ONG educativa que enseña habilidades digitales a jóvenes de sectores vulnerables junto a Fe y Alegría.',
    puntos: [
      'MVP de bot para Microsoft Teams con 3 módulos por mención en Power Automate (@asisconv, @asisdud, @asistut)',
      'Pruebas de estrés en laboratorio con más de 30 dispositivos e informes técnicos',
      'Mejoras visuales de la plataforma Moodle CECAL (tema Fordson) y readaptación de 5 cursos',
      'Capacitaciones a docentes en centros de Fe y Alegría',
    ],
    stack: ['Microsoft Teams', 'Power Automate', 'Moodle', 'SCSS', 'Formación docente'],
    color: '#34d399',
  },
  {
    id: 'a3', tag: 'Proyecto A3', titulo: 'Asistente estilo JARVIS con disparador wearable',
    resumen: 'Asistente personal de IA que se activa desde un reloj inteligente (Mibro Watch A3) y responde con memoria semántica.',
    puntos: [
      'Backend en FastAPI con inferencia en la nube vía Groq',
      'Memoria a largo plazo con Supabase pgvector (búsqueda semántica)',
      'Integración del reloj como interfaz de activación',
    ],
    stack: ['Python', 'FastAPI', 'Groq', 'Supabase', 'pgvector'],
    color: '#f59e0b',
  },
  {
    id: 'ccofig', tag: 'IA agéntica · Auditoría técnica', titulo: 'CCOFIG.AI · Evaluación automática de tutorías',
    resumen: 'Pipeline agéntico que evalúa sesiones de tutoría con LLMs. Realicé la auditoría técnica senior y el análisis de brechas contra la hoja de ruta.',
    puntos: [
      'Detección de errores críticos de puntuación silenciosa y de enrutamiento de reportes',
      'Gap analysis frente a una hoja de ruta de 6 fases y comparación con el framework Sandpiper',
      'Propuesta de capa de concordancia inter-evaluador con Kappa de Cohen',
    ],
    stack: ['Google Apps Script', 'Gemini', 'MySQL (RDS)', 'Arquitectura multiagente'],
    color: '#f472b6',
  },
  {
    id: 'lexum', tag: 'Cliente · Despliegue y soporte', titulo: 'Lexum · Sistema de gestión legal',
    resumen: 'Sistema para un estudio jurídico, contenerizado, desplegado y mantenido en producción para el cliente.',
    puntos: [
      'Stack dockerizado: PostgreSQL + Node.js/Express + React/Vite',
      'Resolución de fallos en cascada: builds de TypeScript, puertos, esquemas y seeds',
      'Acceso remoto con dominio estático y arranque automático en Windows',
    ],
    stack: ['Docker', 'PostgreSQL', 'Node.js', 'Express', 'React', 'Vite'],
    color: '#60a5fa',
  },
  // {
  //   id: 'sentinel', tag: 'Por completar', titulo: 'Sentinel',
  //   resumen: 'Describe aquí el proyecto Sentinel.', puntos: [], stack: [], color: '#ef4444',
  // },
];

export const otros = [
  { t: 'Phantom Ledger', d: 'Sistema POS para hoteles.' },
  { t: 'Configuración DNS y correo', d: 'Dominio y correo corporativo para un estudio de abogados.' },
  { t: 'VMware Hands-on Labs', d: 'HOL-2634, HOL-2637 y HOL-2640.' },
  { t: 'Gobierno de TI', d: 'Matriz comparativa COBIT · ITIL · ISO.' },
  { t: 'Vinculación con la sociedad', d: 'Bibliotecas comunitarias y proyecto de audiolibros.' },
];

export const stack = [
  'Python', 'TypeScript', 'JavaScript', 'Next.js', 'React', 'Svelte', 'Node.js', 'FastAPI', 'Supabase', 'PostgreSQL', 'MySQL',
  'Docker', 'Vercel', 'Three.js', 'GSAP', 'Tailwind', 'PyTorch', 'Hugging Face', 'Groq', 'Gemini', 'Power Automate', 'Moodle', 'Git',
];
