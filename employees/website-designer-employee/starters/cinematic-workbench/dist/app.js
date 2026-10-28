(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js', 'js-enabled');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 700px)');
  const story = document.querySelector('#experience');
  const workflow = document.querySelector('#workflow-window');
  const chapters = [...document.querySelectorAll('.chapter[data-chapter]')];
  const globalMotionButton = document.querySelector('#global-motion-toggle');
  const motionButtons = [...new Set([
    ...document.querySelectorAll('[data-motion-toggle]'),
    document.querySelector('#motion-toggle'),
    globalMotionButton
  ].filter(Boolean))];
  const runButton = document.querySelector('#run-demo');
  const demoNodes = [...document.querySelectorAll('.workflow-node[data-node]')];
  const chapterButtons = [...document.querySelectorAll('.chapter-nav [data-seek]')];
  const chapterNames = ['THE IDEA', 'THE STORY', 'THE DETAILS'];
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const mix = (a, b, amount) => a + (b - a) * amount;
  const ease = value => {const x = clamp(value); return x * x * (3 - 2 * x);};
  const text = (selector, value) => {const element = document.querySelector(selector); if (element) element.textContent = value;};
  let userPaused = false;
  let storyVisible = true;
  let panelVisible = true;
  let panelFaded = false;
  let progress = 0;
  let activeChapter = -1;
  let scrollFrame = 0;
  let previousSceneProgress = null;
  let previousScenePause = null;
  let selectedRole = 0;

  // This is an authored visual example. No backend, service, clock, or business data is running.
  const demoSteps = [
    {name:'01 / THE IDEA', message:'Fictional example: introduce one clear idea for the page.', duration:2800},
    {name:'02 / THE CONTEXT', message:'Example structure: connect the idea to a real audience and offer.', duration:3200},
    {name:'03 / THE NEXT STEP', message:'Example handoff: guide a visitor toward one verified action.', duration:4600}
  ];
  const demo = {step:0, cycle:0, timer:null, dueAt:0, remaining:demoSteps[0].duration};
  const pausedReason = () => userPaused ? 'user' : reduced.matches ? 'reduced' : document.hidden ? 'hidden' : panelFaded ? 'scene-reveal' : !storyVisible || !panelVisible ? 'offscreen' : '';
  const globalPaused = () => userPaused || reduced.matches || document.hidden || !storyVisible;

  function applyDemoStep(step, shouldPulse = false) {
    demo.step = step;
    demoNodes.forEach(node => {
      const index = Number(node.dataset.node);
      node.classList.toggle('active', index === step);
      node.classList.toggle('completed', index < step);
      node.dataset.state = index === step ? 'active' : index < step ? 'completed' : 'upcoming';
    });
    text('#workflow-message', demoSteps[step].message);
    text('#workflow-stage-name', demoSteps[step].name);
    text('#workflow-clock', `STEP ${String(step + 1).padStart(2, '0')} / 03`);
    if (workflow) {
      workflow.dataset.demoStep = String(step);
      workflow.dataset.demoCycle = String(demo.cycle);
      workflow.style.setProperty('--demo-step', String(step));
    }
    if (shouldPulse && !globalPaused()) window.WorkbenchScene?.pulse();
  }

  function stopDemo() {
    if (demo.timer !== null) {
      demo.remaining = Math.max(0, demo.dueAt - performance.now());
      clearTimeout(demo.timer);
      demo.timer = null;
    }
  }

  function scheduleDemo() {
    if (!workflow || demo.timer !== null || pausedReason()) return;
    demo.dueAt = performance.now() + demo.remaining;
    demo.timer = setTimeout(() => {
      demo.timer = null;
      if (pausedReason()) {demo.remaining = 0; return;}
      const next = (demo.step + 1) % demoSteps.length;
      if (next === 0) demo.cycle += 1;
      applyDemoStep(next, true);
      demo.remaining = demoSteps[next].duration;
      scheduleDemo();
    }, Math.max(0, demo.remaining));
  }

  function moveFocusBeforeInert(container, chapterIndex) {
    const focused = document.activeElement;
    if (!focused || !container.contains(focused)) return;
    const target = chapterButtons.find(button => Math.round(Number(button.dataset.seek) * 2) === chapterIndex) || chapterButtons[0];
    target?.focus({preventScroll:true});
  }

  function updateMotionButtons() {
    const label = reduced.matches ? 'Reduced motion' : userPaused ? 'Resume motion' : 'Pause motion';
    motionButtons.forEach(button => {
      const labelElement = button.querySelector('.motion-label, [data-motion-label]');
      if (labelElement) labelElement.textContent = label;
      else button.textContent = label;
      const icon = button.querySelector('.motion-symbol');
      if (icon) icon.textContent = reduced.matches ? '—' : userPaused ? '▶' : 'Ⅱ';
      button.disabled = reduced.matches;
      button.setAttribute('aria-pressed', String(userPaused || reduced.matches));
      button.setAttribute('aria-label', reduced.matches ? 'Reduced motion enabled' : userPaused ? 'Resume decorative animation' : 'Pause decorative animation');
    });
    if (globalMotionButton) {
      if (storyVisible && document.activeElement && globalMotionButton.contains(document.activeElement)) {
        motionButtons.find(button => button !== globalMotionButton)?.focus({preventScroll:true});
      }
      globalMotionButton.hidden = storyVisible;
    }
  }

  function syncMotion(forceScene = false) {
    const paused = globalPaused();
    const pagePaused = userPaused || reduced.matches || document.hidden;
    root.classList.toggle('motion-paused', pagePaused);
    root.dataset.motion = pagePaused ? 'paused' : 'running';
    if (previousScenePause !== paused || forceScene) {
      if (window.WorkbenchScene?.setPaused) window.WorkbenchScene.setPaused(paused);
      else document.dispatchEvent(new CustomEvent('workbench:motion', {detail:{paused}}));
      previousScenePause = paused;
    }
    const reason = pausedReason();
    if (reason) stopDemo();
    else scheduleDemo();
    if (workflow) workflow.dataset.demoState = reason ? `paused-${reason}` : 'playing';
    if (runButton) {
      const label = reduced.matches || userPaused ? 'Next example step' : 'Replay the example';
      const labelElement = runButton.querySelector('[data-demo-label]');
      if (labelElement) labelElement.textContent = label;
      else runButton.textContent = label;
      runButton.setAttribute('aria-label', label + '. This is an authored illustration, not a connected service.');
    }
    updateMotionButtons();
    if (userPaused || reduced.matches) document.querySelectorAll('.reveal.is-pending').forEach(element => {
      element.classList.remove('is-pending'); element.classList.add('is-visible');
    });
  }

  function poseWorkflow(value) {
    if (!workflow) return;
    const wasFaded = panelFaded;
    const exit = reduced.matches ? (value >= 0.67 ? 1 : 0) : ease((value - 0.6) / 0.3);
    const opacity = 1 - exit;
    const hidden = value >= 0.92 || (reduced.matches && value >= 0.67);
    panelFaded = opacity < 0.08;
    if (hidden || panelFaded) moveFocusBeforeInert(workflow, Math.max(0, activeChapter));
    workflow.style.opacity = opacity.toFixed(3);
    workflow.style.visibility = hidden ? 'hidden' : 'visible';
    workflow.style.pointerEvents = panelFaded ? 'none' : '';
    workflow.inert = hidden || panelFaded;
    workflow.setAttribute('aria-hidden', String(hidden || panelFaded));
    if (hidden || panelFaded) workflow.setAttribute('inert', '');
    else workflow.removeAttribute('inert');
    workflow.dataset.panelState = hidden ? 'hidden' : panelFaded ? 'faded' : 'visible';
    if (wasFaded !== panelFaded) syncMotion();
    if (reduced.matches) {workflow.style.transform = 'none'; return;}
    const towardContext = ease((value - 0.07) / 0.38);
    const towardTeam = exit;
    const mobile = phone.matches;
    const a = mobile ? [0, 0, 0, 6, -8, 2, 0.97] : [0, 0, 0, 12, -24, 5, 0.97];
    const b = mobile ? [0, -10, 35, 0, 0, 0, 1] : [0, -24, 70, 0, 0, 0, 1.06];
    const c = mobile ? [0, -40, -90, 5, 9, -3, 0.9] : [100, -85, -620, 12, 25, -8, 0.65];
    const pose = a.map((start, index) => mix(mix(start, b[index], towardContext), c[index], towardTeam));
    workflow.style.transform = `perspective(${mobile ? 900 : 1400}px) translate3d(${pose[0].toFixed(2)}%,${pose[1].toFixed(2)}px,${pose[2].toFixed(2)}px) rotateX(${pose[3].toFixed(2)}deg) rotateY(${pose[4].toFixed(2)}deg) rotateZ(${pose[5].toFixed(2)}deg) scale(${pose[6].toFixed(3)})`;
  }

  function updateStory() {
    scrollFrame = 0;
    if (!story) return;
    const bounds = story.getBoundingClientRect();
    const travel = Math.max(1, story.offsetHeight - window.innerHeight);
    progress = clamp(-bounds.top / travel);
    const wasVisible = storyVisible;
    storyVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    const chapterIndex = progress < 0.32 ? 0 : progress < 0.67 ? 1 : 2;
    root.style.setProperty('--progress', progress.toFixed(5));
    story.style.setProperty('--progress', progress.toFixed(5));
    story.dataset.progress = progress.toFixed(4);
    story.dataset.chapter = String(chapterIndex);
    const rangeStarts = [0, 0.32, 0.67];
    const rangeEnds = [0.32, 0.67, 1];
    const local = clamp((progress - rangeStarts[chapterIndex]) / (rangeEnds[chapterIndex] - rangeStarts[chapterIndex]));
    story.style.setProperty('--local', local.toFixed(5));
    chapters.forEach(chapter => {
      const index = Number(chapter.dataset.chapter);
      const active = index === chapterIndex;
      if (!active) moveFocusBeforeInert(chapter, chapterIndex);
      chapter.classList.toggle('active', active);
      chapter.setAttribute('aria-hidden', String(!active));
      chapter.inert = !active;
      if (active) chapter.removeAttribute('inert');
      else chapter.setAttribute('inert', '');
      chapter.style.setProperty('--local', clamp((progress - rangeStarts[index]) / (rangeEnds[index] - rangeStarts[index])).toFixed(5));
    });
    if (activeChapter !== chapterIndex) {
      activeChapter = chapterIndex;
      text('#chapter-number', `${String(chapterIndex + 1).padStart(2, '0')} / 03`);
      const active = chapters.find(chapter => Number(chapter.dataset.chapter) === chapterIndex);
      text('#chapter-name', active?.dataset.title || chapterNames[chapterIndex]);
      chapterButtons.forEach(button => {
        const current = Math.round(Number(button.dataset.seek) * 2) === chapterIndex;
        button.setAttribute('aria-pressed', String(current));
        if (current) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    }
    const progressBar = document.querySelector('#story-progress');
    if (progressBar) progressBar.style.width = `${(progress * 100).toFixed(2)}%`;
    poseWorkflow(progress);
    const sceneProgress = reduced.matches ? chapterIndex / 2 : progress;
    if (previousSceneProgress !== sceneProgress) {
      window.WorkbenchScene?.setProgress(sceneProgress);
      previousSceneProgress = sceneProgress;
    }
    if (wasVisible !== storyVisible) syncMotion();
  }

  function requestStoryUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStory);
  }

  document.querySelectorAll('[data-seek]').forEach(button => button.addEventListener('click', () => {
    if (!story) return;
    const target = clamp(Number(button.dataset.seek) || 0);
    const storyTop = story.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(0, story.offsetHeight - window.innerHeight);
    window.scrollTo({top:storyTop + target * travel, behavior:reduced.matches || userPaused ? 'auto' : 'smooth'});
    requestStoryUpdate();
  }));

  motionButtons.forEach(button => button.addEventListener('click', () => {userPaused = !userPaused; syncMotion(); requestStoryUpdate();}));
  runButton?.addEventListener('click', () => {
    stopDemo();
    if (userPaused || reduced.matches) {
      const next = (demo.step + 1) % demoSteps.length;
      if (next === 0) demo.cycle += 1;
      applyDemoStep(next, false);
    } else {demo.cycle += 1; applyDemoStep(0, true);}
    demo.remaining = demoSteps[demo.step].duration;
    syncMotion();
  });

  const roles = [
    {name:'Your offer', color:'#ffd600', job:'Say what you do, who it helps, and why they should care.', result:'Replace this example with a clear, specific description of your real offer.', boundary:'No service, price, availability, or result is claimed by this starter.'},
    {name:'Your approach', color:'#ffd600', job:'Show the important choices behind the way you work.', result:'Use a real process detail, useful distinction, or reason someone chooses your approach.', boundary:'Avoid vague promises. Add details you can stand behind.'},
    {name:'Your audience', color:'#ffd600', job:'Help the right people recognize that this is for them.', result:'Describe an actual audience need using language your customers understand.', boundary:'Do not invent customer research or imply a specialization you do not have.'},
    {name:'Your process', color:'#ffd600', job:'Make the path from first conversation to next step easy to understand.', result:'Replace this with the real steps, expectations, and decision points in your business.', boundary:'Do not publish unconfirmed delivery dates or a made-up booking flow.'},
    {name:'Your proof', color:'#ffd600', job:'Show something real that supports your story.', result:'Add a genuine work sample, permissioned testimonial, or verified result when available.', boundary:'No proof has been supplied here. Omit this section if you have nothing suitable yet.'}
  ];
  const roleButtons = [...document.querySelectorAll('.role-button[data-role]')];
  function selectRole(index) {
    const role = roles[index];
    if (!role) return;
    selectedRole = index;
    roleButtons.forEach(button => {
      const selected = Number(button.dataset.role) === index;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    text('#role-name', role.name); text('#role-job', role.job); text('#role-result', role.result); text('#role-boundary', role.boundary);
    text('#role-id', `${String(index + 1).padStart(2, '0')} / 05`);
    const roleCard = document.querySelector('.role-card');
    if (roleCard) {roleCard.style.setProperty('--role-color', role.color); roleCard.dataset.role = String(index);}
    window.WorkbenchScene?.setAccent(index);
    if (!globalPaused()) window.WorkbenchScene?.pulse();
  }
  roleButtons.forEach(button => button.addEventListener('click', () => selectRole(Number(button.dataset.role))));

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  function closeMenu(returnFocus = false) {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open');
    if (returnFocus) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => {
    if (!nav) return;
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (nav && menuButton && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  phone.addEventListener('change', () => {closeMenu(); requestStoryUpdate();});

  if ('IntersectionObserver' in window) {
    if (workflow) {
      const observer = new IntersectionObserver(entries => {panelVisible = entries[0].isIntersecting; syncMotion();}, {threshold:0.01});
      observer.observe(workflow);
    }
    const reveals = [...document.querySelectorAll('.reveal')];
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending'); entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target);
      }
    }), {threshold:0.08, rootMargin:'0px 0px 35px 0px'});
    reveals.forEach(element => {
      if (!reduced.matches && element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
      else element.classList.add('is-visible');
      revealObserver.observe(element);
    });
  }

  reduced.addEventListener('change', () => {syncMotion(); previousSceneProgress = null; requestStoryUpdate();});
  document.addEventListener('visibilitychange', () => {syncMotion(); if (!document.hidden) requestStoryUpdate();});
  window.addEventListener('scroll', requestStoryUpdate, {passive:true});
  window.addEventListener('resize', requestStoryUpdate, {passive:true});
  document.addEventListener('workbench:scene-ready', () => {
    previousSceneProgress = null; window.WorkbenchScene?.setAccent(selectedRole); syncMotion(true); requestStoryUpdate();
  });
  window.addEventListener('load', () => {syncMotion(true); requestStoryUpdate();}, {once:true});
  window.addEventListener('pagehide', () => {stopDemo(); if (scrollFrame) cancelAnimationFrame(scrollFrame); scrollFrame = 0;});
  window.addEventListener('pageshow', () => {syncMotion(true); requestStoryUpdate();});

  applyDemoStep(0);
  selectRole(0);
  updateStory();
  syncMotion(true);
})();
