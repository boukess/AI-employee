# Webdev outreach, batch 1: email copy

Status: **copy only. Nothing has been sent.** Sending happens later from the dedicated HighLevel sending domain (`mail.frbouke.com`) on the warm-up ramp in `README.md`, and only after Michael approves.

## Merge fields used (HighLevel)

| Merge field | What it holds |
|---|---|
| `{{contact.company_name}}` | Business name (from the public listing) |
| `{{contact.outreach_opener}}` | Line 1: one specific, verified observation about their current site, already written in the lead's language (custom field "Outreach Opener") |
| `{{email.unsubscribe_link}}` | HighLevel unsubscribe link. When this tag is in the email, HighLevel doesn't add its default footer link a second time. Send yourself a test first and click it to check it works. |

Tags: the language is set by tag `lang-en` / `lang-es` / `lang-pt` and by the "Outreach Language" custom field. Build one HighLevel email template per language and per country variant listed below. Filter recipients by tag, and always exclude the tag `do-not-contact`.

Honesty rules for this copy: no portfolio, client or results claims. Don't say "we've worked with businesses like yours". Each opener was generated from a live fetch of the lead's site on 2026-11-04 (see the `observation_key` column in the CSV). Don't edit an opener into a claim the check didn't make.

---

## 1. Master template: English (`lang-en`; US, Australia, New Zealand, Philippines)

**Subject:** Quick idea for {{contact.company_name}}'s website

**Body:**

Hi {{contact.company_name}} team,

{{contact.outreach_opener}}

I'm Michael with BOUKE LLC. We build custom websites and web or mobile apps for small businesses. We also take on frontend and backend work on sites you already have: fixes, speed, new features, online booking or ordering, and integrations.

If it would help, I'll do a free quick review of your current site: a short list of what I'd fix first and roughly what it would take. There's no cost and no obligation.

Would you like me to send it over?

Michael, BOUKE LLC

—
You're receiving this one-time business email because your address is listed publicly for {{contact.company_name}}. If you'd rather not hear from us, reply "STOP" or "no thanks" and you won't be contacted again, or unsubscribe here: {{email.unsubscribe_link}}
BOUKE LLC · 1238 Estes Drive, Santa Maria, CA 93454

**Example opener (EN):** "I was looking at example.com and noticed the site isn't set up for phones (there's no mobile viewport), so it shows up zoomed-out on a phone."

---

## 2. Spanish (`lang-es`; Mexico, Colombia, Chile; Peru and Argentina use the variants below)

**Asunto:** Una idea rápida para el sitio web de {{contact.company_name}}

**Cuerpo:**

Hola, equipo de {{contact.company_name}}:

{{contact.outreach_opener}}

Soy Michael, de BOUKE LLC. Creamos sitios web y aplicaciones web o móviles a la medida para pequeñas empresas. También hacemos trabajo de frontend y backend en sitios que ya tienen: correcciones, velocidad, nuevas funciones, reservas o pedidos en línea e integraciones.

Si les sirve, con gusto hago una revisión rápida y gratuita de su sitio actual: una lista corta de lo que yo arreglaría primero y lo que tomaría, aproximadamente. Sin costo y sin compromiso.

¿Les gustaría que se la envíe?

Michael, BOUKE LLC

—
Recibe este correo comercial único porque su dirección aparece publicada para {{contact.company_name}}. Si prefiere no recibir más mensajes, responda "STOP" o "no, gracias" y no volveremos a contactarle, o dése de baja aquí: {{email.unsubscribe_link}}
BOUKE LLC · 1238 Estes Drive, Santa Maria, CA 93454, EE. UU. · Correo de contacto: responda a este mensaje

**Ejemplo de primera línea (ES):** "Estuve revisando ejemplo.com.mx y noté que el sitio no está adaptado para celulares (no tiene configuración móvil), así que en un teléfono se ve muy pequeño."

### 2a. Peru variant (`country-PE`): Ley 28493

The subject must contain the word PUBLICIDAD. Ley 28493 art. 5 applies to mail "originado en el país", so it arguably doesn't bind a US sender, but we follow it anyway. The footer already gives the sender's name, full address, a reply address and an opt-out.

**Asunto:** PUBLICIDAD: Una idea rápida para el sitio web de {{contact.company_name}}

Body: same as the Spanish template.

### 2b. Argentina variant (`country-AR`): Ley 25.326, Disp. DNPDP 4/2009

The subject must contain the single word "Publicidad". The body must include the notice of the right to withdrawal or blocking, plus a transcription of the two legal articles.

**Asunto:** Publicidad: Una idea rápida para el sitio web de {{contact.company_name}}

Body: same as the Spanish template. Then add this block **before** the BOUKE LLC address line:

> Esto es una publicidad. Usted puede solicitar en cualquier momento el retiro o bloqueo, total o parcial, de su nombre de nuestra base de datos, respondiendo "STOP" a este correo o mediante el enlace de baja: {{email.unsubscribe_link}}
> Art. 27, inc. 3, Ley 25.326: "El titular podrá en cualquier momento solicitar el retiro o bloqueo de su nombre de los bancos de datos a los que se refiere el presente artículo."
> Art. 27, párr. 3, Anexo I, Decreto 1558/01: "En toda comunicación con fines de publicidad que se realice por correo, teléfono, correo electrónico, Internet u otro medio a distancia a conocer, se deberá indicar, en forma expresa y destacada, la posibilidad del titular del dato de solicitar el retiro o bloqueo, total o parcial, de su nombre de la base de datos. A pedido del interesado, se deberá informar el nombre del responsable o usuario del banco de datos que proveyó la información."

### 2c. Chile (`country-CL`): Ley 19.496 art. 28 B

The subject states what the email is about, the sender is identified, and there's a valid opt-out address. The standard Spanish template already does all three.

---

## 3. Portuguese, Brazil (`lang-pt`)

**Assunto:** Uma ideia rápida para o site da {{contact.company_name}}

**Corpo:**

Olá, equipe da {{contact.company_name}},

{{contact.outreach_opener}}

Sou o Michael, da BOUKE LLC. Criamos sites e aplicativos web ou mobile sob medida para pequenas empresas. Também fazemos trabalhos de frontend e backend em sites que vocês já têm: correções, velocidade, novas funcionalidades, agendamento ou pedidos online e integrações.

Se for útil, faço uma revisão rápida e gratuita do site atual de vocês: uma lista curta do que eu corrigiria primeiro e do que seria necessário, mais ou menos. Sem custo e sem compromisso.

Posso enviar?

Michael, BOUKE LLC

—
Você está recebendo este e-mail comercial único porque o endereço está publicado para {{contact.company_name}}. Se preferir não receber mais mensagens, responda "STOP" ou "não, obrigado" e não entraremos mais em contato, ou cancele aqui: {{email.unsubscribe_link}}
BOUKE LLC · 1238 Estes Drive, Santa Maria, CA 93454, EUA

**Exemplo de primeira linha (PT):** "Estive olhando exemplo.com.br e notei que o site não está adaptado para celular (não tem configuração mobile), então aparece bem pequeno no telefone."

---

## Opener phrasebook (how `outreach_opener` was generated)

| key | English | Español | Português |
|---|---|---|---|
| frame | I was looking at {domain} and noticed {obs}. | Estuve revisando {domain} y noté que {obs}. | Estive olhando {domain} e notei que {obs}. |
| noviewport | the site isn't set up for phones (there's no mobile viewport), so it shows up zoomed-out on a phone | el sitio no está adaptado para celulares (no tiene configuración móvil), así que en un teléfono se ve muy pequeño | o site não está adaptado para celular (não tem configuração mobile), então aparece bem pequeno no telefone |
| nohttps | your site loads without HTTPS, so browsers label it "Not secure" | el sitio carga sin HTTPS, así que los navegadores lo marcan como "No seguro" | o site carrega sem HTTPS, então os navegadores o marcam como "Não seguro" |
| oldcopy | the footer still says © {year}, which makes the site look unmaintained | el pie de página todavía dice © {year}, lo que hace que el sitio parezca desactualizado | o rodapé ainda diz © {year}, o que faz o site parecer desatualizado |
| oldtool | the site was built with {tool}, a tool that's no longer supported | el sitio se hizo con {tool}, una herramienta que ya no tiene soporte | o site foi feito com {tool}, uma ferramenta que não tem mais suporte |
| freesub | the site lives on a free builder address ({host}) rather than your own domain | el sitio está en una dirección gratuita de un constructor web ({host}) en lugar de un dominio propio | o site está em um endereço gratuito de construtor ({host}) em vez de um domínio próprio |
| socialonly | your website link goes to your {platform} page, so there's no site of your own for people who find you on Google | el enlace de su sitio web lleva a su página de {platform}, así que no tienen un sitio propio para quienes los buscan en Google | o link do site de vocês leva para a página do {platform}, então não há um site próprio para quem procura vocês no Google |
| badtitle | the homepage title is just "{title}", which is what Google shows in search results | el título de la página principal es solo "{title}", y eso es lo que muestra Google en los resultados | o título da página inicial é apenas "{title}", e é isso que o Google mostra nos resultados |
| oldtech | parts of the site run on very old code (an old jQuery 1.x build or frames), which is slower and harder to keep secure | partes del sitio usan código muy antiguo (jQuery 1.x o frames), que es más lento y más difícil de mantener seguro | partes do site usam código bem antigo (jQuery 1.x ou frames), que é mais lento e mais difícil de manter seguro |

For socialonly the frame is "I went to look up {business}'s website and noticed {observation}." / "Busqué el sitio web de {business} y noté que {observation}." / "Procurei o site da {business} e notei que {observation}."
