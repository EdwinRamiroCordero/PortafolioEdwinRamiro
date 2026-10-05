# construyendosuenosremodel.com

Sitio de Construyendo Sueños Remodel (Constructores de Suenos LLC). Publicado en Cloudflare Pages.

## Estructura
- `index.html`: sitio completo (español / inglés).
- `kb.md`: base de conocimiento del asistente de IA. **Editar aquí para entrenar al asistente.**
- `privacidad.html`: política de privacidad.
- `functions/api/chat.js`: asistente de IA (Anthropic).
- `functions/api/lead.js`: formulario y reservas de llamada, envío por correo (Resend).
- `img/`: fotos del antes y después. Para cambiarlas, subir archivos con el mismo nombre.
- `assets/`: logo, favicon, imagen para redes y logo de firma de correo.

## Variables en Cloudflare Pages (Settings > Variables and Secrets)
| Nombre | Tipo | Valor |
|---|---|---|
| ANTHROPIC_API_KEY | Secreto | Llave de la cuenta de Anthropic de la empresa |
| RESEND_API_KEY | Secreto | Llave de la cuenta de Resend de la empresa |
| AI_MODEL | Texto (opcional) | Modelo de Claude. Ver docs.anthropic.com |
| LEAD_TO | Texto (opcional) | Correo que recibe solicitudes (por defecto info@) |

## Cambios frecuentes
- **Textos y precios:** `index.html`. Los precios del estimador están en el bloque `PRECIOS DEL ESTIMADOR`.
- **Asistente:** `kb.md`.
- **Fotos:** reemplazar en `img/` con el mismo nombre.
Cada cambio guardado en GitHub se publica solo en 1 o 2 minutos.
