(() => {
  'use strict';
  const catalog = window.SCENE_CATALOG;
  const grid = document.querySelector('#scene-grid');
  if (!catalog?.layers?.length) { grid.textContent = 'Library bundle is missing. Open the individual files in layers, or run the library build script.'; return; }
  const layers = catalog.layers;
  const byId = new Map(layers.map(layer => [layer.id, layer]));
  const dialog = document.querySelector('#scene-dialog');
  const frame = document.querySelector('#scene-preview');
  const stage = document.querySelector('.preview-stage');
  const search = document.querySelector('#search');
  const output = document.querySelector('#prompt-output');
  const fields = ['brand-name', 'brand-offer', 'brand-audience', 'brand-cta'].map(id => document.getElementById(id));
  let filter = 'All', selected = null, mobile = false, toastTimer;

  const kickoff = 'Read scene-website-director/SKILL.md and act as SCENE, my AI Website Director. Use our original library/catalog.json and the matching files in library/layers. Learn about my brand from this conversation, relevant available project context, and public sources I provide. Ask only for essential missing information. Choose a brand-appropriate visual direction, then build my original website in a new member-project folder. Adapt the content, composition, palette, typography, and motion. Keep facts grounded, use no invented testimonials or results, and preserve accessible static and reduced-motion states. Run the site, inspect desktop and mobile, fix visible problems, and hand over editable source and a truthful QA report. If the brand is not clear from the available context, begin by asking which business or personal brand this is for.';

  function toast(message) { const el = document.querySelector(dialog.open ? '#dialog-status' : '#toast'); clearTimeout(toastTimer); el.textContent = message; el.classList.add('visible'); toastTimer = setTimeout(() => el.classList.remove('visible'), 3600); }
  function safeText(tag, text, className) { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; }
  function scaleFrame(el, width, height) { const container = el.parentElement; const scale = Math.min(1, container.clientWidth / width); el.style.width = width + 'px'; el.style.height = height + 'px'; el.style.transform = `scale(${scale})`; }
  function resizePreviews() { document.querySelectorAll('.card-art iframe').forEach(el => scaleFrame(el, 1440, 960)); if (dialog.open) { scaleFrame(frame, mobile ? 390 : 1440, mobile ? 900 : 960); const scale=Math.min(1,stage.clientWidth/(mobile?390:1440)); frame.style.height=Math.ceil(stage.clientHeight/scale)+'px'; } }

  // Only the visible cards run previews; offscreen frames are unloaded.
  const previewObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      if (!el.dataset.loaded) { el.src = el.dataset.source; el.dataset.loaded = '1'; }
    } else if (el.dataset.loaded) { el.removeAttribute('src'); delete el.dataset.loaded; }
  }), {rootMargin: '100px'});
  function render() {
    document.querySelectorAll('.card-art iframe').forEach(el => previewObserver.unobserve(el));
    grid.replaceChildren();
    const query = search.value.toLowerCase().trim();
    const matches = layers.filter(layer => (filter === 'All' || layer.category === filter) && `${layer.name} ${layer.category} ${layer.technique} ${layer.description} ${layer.tags.join(' ')}`.toLowerCase().includes(query));
    for (const layer of matches) {
      const article = document.createElement('article'); article.className = 'scene-card';
      const button = document.createElement('button'); button.className = 'card-art'; button.dataset.open = layer.id; button.setAttribute('aria-label', `Preview ${layer.name}`);
      const iframe = document.createElement('iframe'); iframe.title = `${layer.name} decorative thumbnail`; iframe.setAttribute('aria-hidden', 'true'); iframe.setAttribute('tabindex', '-1'); iframe.setAttribute('sandbox', 'allow-scripts'); iframe.dataset.source = layer.file + '?view=scene&preview=1';
      button.append(iframe, safeText('span','↗','card-hover')); previewObserver.observe(iframe);
      const meta = document.createElement('div'); meta.className = 'card-meta'; meta.append(safeText('h3', layer.name), safeText('span', layer.category));
      article.append(button,meta,safeText('p',layer.description,'card-desc')); grid.append(article);
    }
    document.querySelector('#empty-state').hidden = !!matches.length;
    document.querySelector('#result-status').textContent = `${matches.length} scene${matches.length === 1 ? '' : 's'} available`;
    requestAnimationFrame(resizePreviews);
  }
  function prompt() {
    if (!selected) return '';
    const [name, offer, audience, action] = fields.map(field => field.value.trim());
    return `Act as SCENE, my AI Website Director. Read scene-website-director/SKILL.md first.\n\nUse our original SCENE library entry ${selected.id} (${selected.name}). Read library/${selected.file}, or retrieve that ID through the connected SCENE MCP server.\n\nBRAND BRIEF\nBrand: ${name || 'Ask me'}\nOffer: ${offer || 'Learn from my materials, then ask if needed'}\nAudience: ${audience || 'Infer from confirmed business context; ask if unclear'}\nPrimary visitor action: ${action || 'Recommend one based on my business'}\n\nCREATIVE DIRECTION\n${selected.prompt}\n\nBUILD REQUIREMENTS\nUse my available brand context and supplied public links. Ask only for essential missing information. Make the result distinctly mine, with original copy, layout, palette, typography, and appropriate imagery. Build a complete useful page in a new member-project folder or adapt my existing project if requested. Keep meaningful content in HTML; preserve mobile, keyboard, reduced-motion, and scene-failure behavior. Do not invent credentials, prices, testimonials, customer logos, or business outcomes. Use only confirmed CTA destinations. Run and inspect the actual page at desktop and phone sizes, repair visible defects, and deliver editable source plus an honest QA report. If a tool is unavailable, explain that specific limitation without pretending it worked.`;
  }
  function updatePrompt() { output.value = prompt(); }
  async function copy(text, fallback) {
    try { if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(text); toast('Copied. Paste it into your coding agent with the kit open.'); }
    catch { fallback(); toast('Select and copy the prompt below. Your browser blocked clipboard access.'); }
  }
  function open(id) {
    selected = byId.get(id); if (!selected) return;
    document.querySelector('#dialog-title').textContent = selected.name;
    document.querySelector('#dialog-category').textContent = selected.category.toUpperCase();
    document.querySelector('#scene-technique').textContent = selected.technique;
    document.querySelector('#scene-description').textContent = selected.description;
    document.querySelector('#open-full').href = selected.file;
    frame.src = selected.file; frame.title = `${selected.name} live preview`;
    mobile = false; stage.classList.remove('mobile'); setModeButtons(); updatePrompt(); dialog.showModal(); document.body.style.overflow = 'hidden'; resizePreviews();
  }
  function setModeButtons() { document.querySelector('#desktop-preview').setAttribute('aria-pressed', String(!mobile)); document.querySelector('#mobile-preview').setAttribute('aria-pressed', String(mobile)); }
  function changeMode(value) { mobile = value; stage.classList.toggle('mobile',mobile); setModeButtons(); resizePreviews(); }
  document.addEventListener('click', event => { const button = event.target.closest('[data-open]'); if (button) open(button.dataset.open); });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; document.querySelectorAll('[data-filter]').forEach(el => el.setAttribute('aria-pressed', String(el === button))); render(); }));
  search.addEventListener('input', render);
  document.querySelector('#brand-form').addEventListener('submit', event => event.preventDefault());
  fields.forEach(field => field.addEventListener('input',updatePrompt));
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { frame.removeAttribute('src'); document.body.style.overflow = ''; });
  document.querySelector('#desktop-preview').addEventListener('click',() => changeMode(false));
  document.querySelector('#mobile-preview').addEventListener('click',() => changeMode(true));
  document.querySelector('#copy-prompt').addEventListener('click',() => copy(prompt(),() => { document.querySelector('.prompt-details').open = true; output.focus(); output.select(); }));
  document.querySelector('#download-source').addEventListener('click',() => {
    const url = URL.createObjectURL(new Blob([selected.sourceHtml],{type:'text/html;charset=utf-8'}));
    const a = document.createElement('a'); a.href=url; a.download=`scene-${selected.id}.html`; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url),1000); toast('Original HTML downloaded. Give it and your prompt to your coding agent.');
  });
  document.querySelector('#copy-kickoff').addEventListener('click',() => copy(kickoff,() => { const el = document.querySelector('#copy-text'); el.value=kickoff; document.querySelector('#copy-dialog').showModal(); el.focus(); el.select(); }));
  document.querySelector('#close-copy').addEventListener('click',() => document.querySelector('#copy-dialog').close());
  const feature = document.createElement('iframe'); feature.title='Orbit sculpture'; feature.setAttribute('aria-hidden','true'); feature.setAttribute('tabindex','-1'); feature.setAttribute('sandbox','allow-scripts'); feature.dataset.source = 'layers/orbit-sculpture.html?view=scene&preview=1&embed=1';
  document.querySelector('#feature-art').append(feature); previewObserver.observe(feature);
  document.querySelector('#feature-motion').addEventListener('click',event => { const button=event.currentTarget; const playing=button.getAttribute('aria-pressed')!=='true'; button.setAttribute('aria-pressed',String(playing)); button.textContent=playing?'Ⅱ Pause preview':'▷ Play preview'; feature.dataset.source='layers/orbit-sculpture.html?view=scene&embed=1&preview='+(playing?'0':'1'); feature.src=feature.dataset.source; feature.dataset.loaded='1'; });
  window.addEventListener('resize',resizePreviews);
  document.addEventListener('visibilitychange',() => { if(document.hidden) { document.querySelectorAll('iframe[data-loaded]').forEach(el => { el.removeAttribute('src'); delete el.dataset.loaded; }); } else { document.querySelectorAll('iframe[data-source]').forEach(el => { previewObserver.unobserve(el); previewObserver.observe(el); }); }});
  render();
})();
