import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// SIGNAL LOOM: original geometry, traveling light, unfolding folders, a connected
// five-node system. Bundled locally; no external models, textures, or runtime URLs.
(() => {
  const canvas = document.getElementById('workbench-scene');
  const stage = canvas?.closest('.scene-world');
  const poster = document.getElementById('scene-poster');
  if (!canvas || !stage) return;
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionQuery.matches, manualChoice = false, visible = true, failed = false;
  let targetProgress = 0, progress = 0, time = 0, frameNumber = 0, frame = 0, previous = 0, lastMark = -1000;
  let pulseEnergy = 0, ready = false, drawOnce = () => {};
  let accent = new THREE.Color('#FFD600');
  const palette = ['#FFD600', '#FFE680', '#FFF0B3', '#FFF8D9', '#FFFFFF'];
  const cleanups = [];
  function listen(target, type, fn) { target.addEventListener(type, fn); cleanups.push(() => target.removeEventListener(type, fn)); }
  function state(render) { stage.dataset.render = render; canvas.dataset.render = render; }
  state('loading'); stage.dataset.phase = 'hero'; stage.dataset.time = '0.00'; stage.dataset.frame = '0';
  function fallback(reason = 'fallback') {
    failed = true; ready = false; cancelAnimationFrame(frame); frame = 0;
    state(reason); stage.classList.remove('scene-ready'); canvas.style.opacity = '0';
    if (poster) { poster.hidden = false; poster.style.visibility = 'visible'; poster.style.opacity = '1'; }
  }
  function setPaused(value) { manualChoice = true; paused = Boolean(value); previous = 0; if (ready) state(paused ? 'paused' : 'ready'); drawOnce(); }
  const API = window.WorkbenchScene = {
    setProgress(value) {
      const p = Math.max(0, Math.min(1, Number(value) || 0));
      targetProgress = motionQuery.matches ? (p < 0.30 ? 0 : p < 0.72 ? 0.5 : 1) : p;
      if (paused || motionQuery.matches) progress = targetProgress;
      drawOnce();
    },
    setPaused,
    setAccent(value) {
      // Keep the system predominantly yellow; selections tint its secondary edges.
      if (Number.isInteger(value)) accent.set(palette[((value % palette.length) + palette.length) % palette.length]);
      else if (typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)) accent.set(value);
      drawOnce();
    },
    pulse() { pulseEnergy = 1; drawOnce(); },
    get ready() { return ready; },
    get paused() { return paused; }
  };
  listen(document, 'workbench:motion', event => { if (typeof event.detail?.paused === 'boolean') setPaused(event.detail.paused); });
  listen(motionQuery, 'change', event => {
    if (!manualChoice) paused = event.matches;
    if (event.matches) progress = targetProgress = targetProgress < 0.30 ? 0 : targetProgress < 0.72 ? 0.5 : 1;
    previous = 0; drawOnce();
  });
  if (new URLSearchParams(location.search).get('render') === 'static') { fallback('static'); return; }

  let renderer, composer, environmentMap, environment;
  const ownedGeometries = [], ownedMaterials = [];
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setClearColor('#080808', 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080808');
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 70);
    camera.position.set(0, 0.30, 12.8);
    const pmrem = new THREE.PMREMGenerator(renderer);
    environment = new RoomEnvironment();
    environmentMap = pmrem.fromScene(environment, 0.06);
    scene.environment = environmentMap.texture;
    pmrem.dispose(); environment.dispose();
    scene.add(new THREE.AmbientLight('#cfcfcf', 0.42));
    const key = new THREE.DirectionalLight('#ffffff', 3.2); key.position.set(-2, 6, 8); scene.add(key);
    const fill = new THREE.DirectionalLight('#d6d6d6', 2.5); fill.position.set(5, -1, 2); scene.add(fill);
    const bloom = new UnrealBloomPass(new THREE.Vector2(800, 600), 0.54, 0.54, 0.42);
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera)); composer.addPass(bloom); composer.addPass(new OutputPass());

    const world = new THREE.Group(); scene.add(world);
    const loom = new THREE.Group(); world.add(loom);
    const folderWorld = new THREE.Group(); world.add(folderWorld);
    const connectionWorld = new THREE.Group(); world.add(connectionWorld);
    const uniforms = {
      uTime: { value: 0 }, uPulse: { value: 0 }, uAccent: { value: new THREE.Color('#FFD600') },
      uTransform: { value: 0 }
    };
    class SignalCurve extends THREE.Curve {
      constructor(lane) { super(); this.lane = lane; }
      getPoint(t, out = new THREE.Vector3()) {
        const lane = this.lane, a = -2.20 + t * Math.PI * 2.14;
        const r = 2.52 + lane * 0.25;
        return out.set(
          Math.cos(a) * r * 1.10 + Math.sin(a * 2) * 0.31 + lane * 0.08,
          Math.sin(a) * r * 1.07 + lane * 0.08,
          Math.sin(a * 2) * 0.49 + Math.cos(a) * 0.47 + lane * 0.17
        );
      }
    }
    // The final chapter resolves the same light into an illustrative signature vessel.
    // Both endpoints meet beneath the vessel so the existing end fade keeps the
    // seam quiet, while its narrow neck and small mouth remain clearly defined.
    class FlaskCurve extends THREE.CatmullRomCurve3 {
      constructor(lane) {
        const outline = [
          [0,-2.25],[-1.48,-2.22],[-2.46,-1.58],[-2.83,-0.30],
          [-2.73,0.87],[-2.44,1.58],[-1.48,2.10],[-0.67,2.33],
          [-0.66,3.04],[-0.86,3.08],[-0.83,3.25],[0.83,3.25],
          [0.86,3.08],[0.66,3.04],[0.67,2.33],[1.48,2.10],
          [2.44,1.58],[2.73,0.87],[2.83,-0.30],[2.46,-1.58],
          [1.48,-2.22],[0,-2.25]
        ];
        super(outline.map(([x,y]) => new THREE.Vector3(x * (1 + lane * 0.042), y * (1 + lane * 0.022), lane * 0.20)), false, 'centripetal');
      }
    }
    const curves = [], flaskCurves = [], arcTables = [], trailMaterials = [];
    for (let i = 0; i < 44; i++) {
      const lane = (i - 21.5) / 21.5;
      const curve = new SignalCurve(lane); curves.push(curve);
      const flask = new FlaskCurve(lane); flaskCurves.push(flask);
      arcTables.push(curve.getLengths());
      const radius = i % 7 === 0 ? 0.010 : 0.0053;
      const geometry = new THREE.TubeGeometry(curve, 172, radius, 4, false);
      const targetGeometry = new THREE.TubeGeometry(flask, 172, radius, 4, false);
      geometry.setAttribute('aFlask', new THREE.Float32BufferAttribute(targetGeometry.attributes.position.array, 3));
      geometry.computeBoundingSphere(); targetGeometry.computeBoundingSphere();
      geometry.boundingSphere.union(targetGeometry.boundingSphere);
      targetGeometry.dispose();
      ownedGeometries.push(geometry);
      const material = new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uLane: { value: i / 44 }, uFine: { value: i % 7 === 0 ? 1 : 0 } },
        vertexShader: `attribute vec3 aFlask;uniform float uTransform;varying vec2 vUv;void main(){vUv=uv;vec3 p=mix(position,aFlask,smoothstep(0.61,0.92,uTransform));gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime,uPulse,uLane,uFine,uTransform;
          uniform vec3 uAccent;
          void main(){
            float cycle=fract(vUv.x*2.0-uTime*0.29+uLane*0.12);
            float head=exp(-pow((cycle-0.10)*18.0,2.0));
            float tail=exp(-pow((cycle-0.24)*5.5,2.0));
            float wave=0.5+0.5*sin(vUv.x*10.0+uLane*8.0-uTime*0.65);
            float fade=smoothstep(0.0,0.075,vUv.x)*(1.0-smoothstep(0.92,1.0,vUv.x));
            vec3 primary=mix(vec3(1.0,0.672,0.0),uAccent,0.30);
            vec3 tint=mix(primary,vec3(1.0,1.0,1.0),smoothstep(0.77,1.0,uLane)*0.65);
            vec3 light=tint*(0.34+tail*0.52+wave*0.20+uFine*0.14);
            light+=mix(tint,vec3(1.0,1.0,1.0),0.77)*head*(1.65+uPulse*1.85);
            gl_FragColor=vec4(light*fade,1.0);
          }`,
        transparent: false, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false
      });
      ownedMaterials.push(material); trailMaterials.push(material);
      const mesh = new THREE.Mesh(geometry, material); loom.add(mesh);
    }

    // A thinner inner counterflow gives the sculpture a woven, spatial center.
    const innerGeometry = new THREE.TorusGeometry(1.57, 0.008, 4, 180, Math.PI * 1.72);
    const innerMaterial = new THREE.MeshBasicMaterial({ color: '#FFE680', transparent: true, opacity: 0.54 });
    ownedGeometries.push(innerGeometry); ownedMaterials.push(innerMaterial);
    const inner = new THREE.Mesh(innerGeometry, innerMaterial); inner.rotation.set(0.56, 0.42, -0.40); loom.add(inner);

    const dotGeometry = new THREE.SphereGeometry(0.026, 7, 5);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: '#FFF8D9', toneMapped: false });
    ownedGeometries.push(dotGeometry); ownedMaterials.push(dotMaterial);
    const dots = new THREE.InstancedMesh(dotGeometry, dotMaterial, 96); dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage); loom.add(dots);
    const dotDummy = new THREE.Object3D(), point = new THREE.Vector3(), flaskPoint = new THREE.Vector3();

    function folderShape(w, h) {
      const s = new THREE.Shape(), x = -w / 2, y = -h / 2, r = 0.095;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + w * 0.48, y + h); s.lineTo(x + w * 0.36, y + h + 0.19);
      s.lineTo(x + r, y + h + 0.19); s.quadraticCurveTo(x, y + h + 0.19, x, y + h + 0.19 - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
    }
    const folderGeometry = new THREE.ExtrudeGeometry(folderShape(2.18, 1.40), { depth: 0.07, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.025, bevelSegments: 3, steps: 1, curveSegments: 10 });
    ownedGeometries.push(folderGeometry);
    const edgeGeometry = new THREE.EdgesGeometry(folderGeometry, 25); ownedGeometries.push(edgeGeometry);
    const lineGeometry = new THREE.BoxGeometry(0.68, 0.018, 0.018); ownedGeometries.push(lineGeometry);
    const chipGeometry = new THREE.BoxGeometry(0.15, 0.11, 0.02); ownedGeometries.push(chipGeometry);
    const folders = [];
    const accents = ['#FFD600', '#FFF0B3', '#eeeeee', '#FFF8D9', '#FFE680'];
    for (let i = 0; i < 5; i++) {
      const group = new THREE.Group(); folderWorld.add(group);
      const material = new THREE.MeshPhysicalMaterial({
        color: i === 0 ? '#202020' : '#1b1b1b', metalness: 0.88, roughness: 0.23,
        clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 1.1,
        transparent: true, opacity: 0.82
      });
      ownedMaterials.push(material);
      const body = new THREE.Mesh(folderGeometry, material); group.add(body);
      const edgeMaterial = new THREE.LineBasicMaterial({ color: accents[i], transparent: true, opacity: i === 0 ? 0.65 : 0.30 });
      ownedMaterials.push(edgeMaterial); group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
      const detailMaterial = new THREE.MeshBasicMaterial({ color: accents[i], transparent: true, opacity: 0.72 }); ownedMaterials.push(detailMaterial);
      for (let j = 0; j < 3; j++) {
        const line = new THREE.Mesh(lineGeometry, detailMaterial); line.position.set(-0.39, -0.04 - j * 0.15, 0.13); line.scale.x = j === 2 ? 0.62 : 1; group.add(line);
      }
      const chip = new THREE.Mesh(chipGeometry, detailMaterial); chip.position.set(-0.66, 0.35, 0.14); group.add(chip);
      folders.push({ group, edgeMaterial, detailMaterial, material });
    }

    const networkPoints = [
      new THREE.Vector3(-1.43, 1.35, 0.1), new THREE.Vector3(1.31, 1.23, -0.30),
      new THREE.Vector3(1.68, -1.00, 0.14), new THREE.Vector3(-0.66, -1.52, 0.6),
      new THREE.Vector3(-0.20, 0.05, 0.9)
    ];
    const connections = [];
    for (let i = 0; i < 5; i++) {
      const from = networkPoints[i], to = networkPoints[(i + 1) % 5];
      const mid = from.clone().lerp(to, 0.5).add(new THREE.Vector3(0.1, i % 2 ? 0.28 : -0.30, -0.6));
      const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
      const geometry = new THREE.TubeGeometry(curve, 36, 0.008, 4, false); ownedGeometries.push(geometry);
      const material = new THREE.MeshBasicMaterial({ color: '#FFD600', transparent: true, opacity: 0 }); ownedMaterials.push(material);
      const line = new THREE.Mesh(geometry, material); connectionWorld.add(line); connections.push({ line, material });
    }
    const glowPlaneGeometry = new THREE.PlaneGeometry(13, 12); ownedGeometries.push(glowPlaneGeometry);
    const glowPlaneMaterial = new THREE.ShaderMaterial({
      uniforms: { ...uniforms }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `varying vec2 vUv;uniform float uPulse;void main(){vec2 p=(vUv-.5)*vec2(1.,1.3);float d=length(p);float glow=exp(-d*d*25.)*.028;gl_FragColor=vec4(vec3(.84,.565,0.0)*glow*(1.+uPulse),1.);}`
    }); ownedMaterials.push(glowPlaneMaterial);
    const glowPlane = new THREE.Mesh(glowPlaneGeometry, glowPlaneMaterial); glowPlane.position.set(2.8, -0.1, -2.7); scene.add(glowPlane);

    const smooth = (a, b, x) => { const n = Math.max(0, Math.min(1, (x - a) / (b - a))); return n * n * (3 - 2 * n); };
    const lerp = THREE.MathUtils.lerp;
    let width = 1, height = 1, sizeDirty = true;
    function resize() {
      const rect = stage.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return false;
      const w = Math.round(rect.width), h = Math.round(rect.height);
      if (w !== width || h !== height || sizeDirty) {
        width = w; height = h; sizeDirty = false;
        const cap = w <= 700 ? 1 : 1.4;
        const dpr = Math.min(devicePixelRatio || 1, cap, Math.sqrt(1700000 / (w * h)));
        renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
        composer.setPixelRatio(dpr); composer.setSize(w, h);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      return true;
    }
    function composition(dt) {
      const unfold = smooth(0.16, 0.59, progress), network = smooth(0.61, 0.92, progress);
      const mobile = width <= 700;
      const idle = paused || motionQuery.matches ? 0 : Math.sin(time * 0.31) * 0.07;
      world.position.set(mobile ? 0.15 : 2.43 + unfold * 0.60, mobile ? -3.30 - network * 0.42 : 0.0, 0);
      world.scale.setScalar(mobile ? lerp(0.85, height < 650 ? 0.60 : 0.68, network) : 1);
      loom.rotation.set(0.12 + unfold * 0.34, -0.36 + unfold * 1.08 + idle, -0.32 + network * 0.44);
      loom.scale.set(lerp(1, 0.91, network), lerp(1, 1.15, network), lerp(1, 1.42, unfold));
      inner.rotation.z = -0.40 - time * 0.10;
      const cameraAngle = unfold * 0.59 - network * 0.17;
      const distance = mobile ? 13.2 : 12.4;
      camera.position.set(Math.sin(cameraAngle) * distance, 0.25 + unfold * 0.92, Math.cos(cameraAngle) * distance);
      camera.lookAt(mobile ? 0.12 : 0, mobile ? -0.40 : 0, 0);
      if (mobile) {
        // Recompose the object below mobile copy while keeping its edges intentional.
        if (camera.fov !== 50) { camera.fov = 50; camera.updateProjectionMatrix(); }
      } else if (camera.fov !== 42) { camera.fov = 42; camera.updateProjectionMatrix(); }
      const fanPositions = [[-1.48,0.34,0.18], [0,0.78,-0.28], [1.47,-0.12,0.2], [-0.7,-1.35,-0.6], [1.1,-1.22,-0.7]];
      for (let i = 0; i < 5; i++) {
        const { group, edgeMaterial, detailMaterial, material } = folders[i];
        const hp = new THREE.Vector3(0.12 + i * 0.11, -0.18 + i * 0.12, -0.68 - i * 0.14);
        const fp = fanPositions[i];
        group.position.set(lerp(hp.x, fp[0], unfold), lerp(hp.y, fp[1], unfold), lerp(hp.z, fp[2], unfold));
        group.position.lerp(networkPoints[i], network);
        group.rotation.set(lerp(0.10, -0.12 + i * 0.075, unfold), lerp(-0.25, (i - 2) * 0.24, unfold) - network * 0.30, lerp(-0.06, (i - 2) * -0.16, unfold) * (1 - network));
        group.scale.setScalar(lerp(1.0, 0.60, network) * (i > 2 ? 0.90 : 1));
        const gate = i > 2 ? smooth(0.34, 0.65, progress) : 1;
        group.visible = gate > 0.01;
        material.opacity = (0.74 + network * 0.16) * gate;
        edgeMaterial.opacity = (0.26 + network * 0.23 + pulseEnergy * 0.25) * gate;
        detailMaterial.opacity = (0.42 + network * 0.27 + pulseEnergy * 0.15) * gate;
      }
      connectionWorld.visible = network > 0.01;
      connections.forEach(({ material }) => material.opacity = network * (0.5 + pulseEnergy * 0.30));
      for (let i = 0; i < 96; i++) {
        const curveIndex = (i * 13) % curves.length, curve = curves[curveIndex];
        const u = (i * 0.61803398875 + time * (0.071 + (i % 5) * 0.011)) % 1;
        curve.getPoint(u, point);
        if (network > 0) {
          // TubeGeometry samples arc length. Map the original particle parameter
          // to that fraction so particles track the interpolated strands exactly,
          // without altering their approved hero positions or travel speeds.
          const lengths = arcTables[curveIndex], sample = u * (lengths.length - 1);
          const low = Math.floor(sample), high = Math.min(low + 1, lengths.length - 1);
          const fraction = lerp(lengths[low], lengths[high], sample - low) / lengths[lengths.length - 1];
          flaskCurves[curveIndex].getPointAt(fraction, flaskPoint);
          point.lerp(flaskPoint, network);
        }
        dotDummy.position.copy(point);
        const scale = (i % 11 === 0 ? 1.75 : 0.70) * (1 + pulseEnergy * 0.45);
        dotDummy.scale.setScalar(scale); dotDummy.updateMatrix(); dots.setMatrixAt(i, dotDummy.matrix);
      }
      dots.instanceMatrix.needsUpdate = true;
      uniforms.uTime.value = time; uniforms.uPulse.value = pulseEnergy; uniforms.uAccent.value.copy(accent); uniforms.uTransform.value = progress;
      bloom.strength = 0.54 + pulseEnergy * 0.18;
      glowPlane.position.x = mobile ? 0 : 2.8;
    }
    function draw(now) {
      frame = 0;
      if (failed || !visible || document.hidden) { previous = 0; return; }
      const dt = previous ? Math.min(0.045, (now - previous) / 1000) : 0;
      previous = now;
      if (!paused && !motionQuery.matches) {
        time += dt; pulseEnergy = Math.max(0, pulseEnergy - dt * 0.78);
        progress += (targetProgress - progress) * (1 - Math.exp(-dt * 9));
      } else progress = targetProgress;
      if (!resize()) { previous = 0; return; }
      composition(dt);
      composer.render(); frameNumber++;
      if (!ready) {
        ready = true; stage.classList.add('scene-ready'); state(paused || motionQuery.matches ? 'paused' : 'ready');
        canvas.style.opacity = '1';
        if (poster) { poster.hidden = true; poster.style.opacity = '0'; poster.style.visibility = 'hidden'; }
        stage.dispatchEvent(new CustomEvent('workbench:scene-ready', { bubbles: true }));
      }
      if (now - lastMark >= 250 || paused || motionQuery.matches) {
        lastMark = now; stage.dataset.phase = progress < 0.27 ? 'hero' : progress < 0.76 ? 'unfold' : 'network';
        stage.dataset.time = time.toFixed(2); stage.dataset.frame = String(frameNumber);
        stage.dataset.progress = progress.toFixed(3);
      }
      // The ready event may synchronously request a frame through the public API.
      // Reuse that scheduled frame instead of creating a second animation loop.
      if (!paused && !motionQuery.matches) { if (!frame) frame = requestAnimationFrame(draw); } else previous = 0;
    }
    drawOnce = () => { if (!frame && !failed && visible && !document.hidden) frame = requestAnimationFrame(draw); };
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) drawOnce(); else { cancelAnimationFrame(frame); frame = 0; previous = 0; }
    }, { threshold: 0.005 }); intersection.observe(stage); cleanups.push(() => intersection.disconnect());
    const resizer = new ResizeObserver(() => { sizeDirty = true; drawOnce(); }); resizer.observe(stage); cleanups.push(() => resizer.disconnect());
    listen(document, 'visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previous = 0; } else drawOnce(); });
    listen(canvas, 'webglcontextlost', event => { event.preventDefault(); fallback(); });
    listen(window, 'pagehide', () => { cancelAnimationFrame(frame); frame = 0; previous = 0; });
    listen(window, 'pageshow', drawOnce);
    API.destroy = () => {
      fallback(); cleanups.forEach(fn => fn()); ownedGeometries.forEach(g => g.dispose()); ownedMaterials.forEach(m => m.dispose());
      environmentMap.dispose(); composer.dispose(); renderer.dispose();
    };
    canvas.style.opacity = '0'; drawOnce();
  } catch (error) { fallback(); }
})();
