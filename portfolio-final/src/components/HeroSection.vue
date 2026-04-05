<template>
  <section id="hero" class="hero">
    <!-- Map background -->
    <div class="hero-map-bg">
      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&auto=format&fit=crop&q=60" alt="carte" />
    </div>
    <div class="hero-map-leaf" ref="mapEl"></div>
    <div class="hero-map-overlay"></div>
    <div class="hero-grid-anim"></div>
    <div class="hero-scanline"></div>

    <!-- Radar -->
    <div class="radar-wrap">
      <div class="radar-c"></div>
      <div class="radar-c"></div>
      <div class="radar-c"></div>
      <div class="radar-c"></div>
      <div class="radar-sweep"></div>
      <div class="radar-cross"></div>
      <div class="rdot rdot-1"><div class="rdot-ping"></div></div>
      <div class="rdot rdot-2"><div class="rdot-ping" style="animation-delay:.5s"></div></div>
      <div class="rdot rdot-3"><div class="rdot-ping" style="animation-delay:1s"></div></div>
    </div>

    <!-- Drone décoratif -->
    <div class="deco deco-drone">
      <img src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=220&auto=format&fit=crop&q=70" alt="drone" class="deco-img deco-img-drone" />
      <div class="deco-label">UAV · 35.76°N</div>
    </div>

    <!-- Satellite décoratif -->
    <div class="deco deco-sat">
      <img src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&auto=format&fit=crop&q=70" alt="satellite" class="deco-img deco-img-sat" />
      <div class="deco-label">SATELLITE · NDVI</div>
    </div>

    <!-- GPS Particles -->
    <div class="particles" ref="particlesEl"></div>

    <!-- Content -->
    <div class="container hero-content">
      <div class="hero-eyebrow" style="animation: fadeUp .6s .2s both">
        <div class="eyebrow-line"></div>
        <span class="eyebrow-text">Portfolio 2026</span>
        <div class="eyebrow-dot"></div>
      </div>

      <h1 class="hero-name" style="animation: fadeUp .8s .35s both">
        <span class="line1">Mathieu</span>
        <span class="line2">SOULI</span>
      </h1>

      <div class="hero-title-bar" style="animation: fadeUp .8s .5s both">
        <span class="bracket">[</span>
        <span class="hero-title-txt" ref="typewriterEl"></span>
        <span class="cursor"></span>
        <span class="bracket">]</span>
      </div>

      <p class="hero-tagline" style="animation: fadeUp .8s .65s both">
        Ingénieur en Géoinformation · Développeur Web Full Stack.<br>
        Je transforme les données spatiales en expériences digitales.
      </p>

      <div class="hero-coords" style="animation: fadeUp .8s .75s both">
        <div class="coord-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <span>35.7595° N</span>
          <span class="sep">,</span>
          <span class="coord-val">5.8340° W — Tanger</span>
        </div>
        <div class="coord-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="coord-val">Disponible</span>
          <span class="sep">—</span>
          <span>Stage / Alternance 2026</span>
        </div>
      </div>

      <div class="hero-stack" style="animation: fadeUp .8s .85s both">
        <span class="tag">Vue.js 3</span>
        <span class="stack-sep">//</span>
        <span class="tag">JavaScript</span>
        <span class="stack-sep">//</span>
        <span class="tag">PHP</span>
        <span class="stack-sep">//</span>
        <span class="tag">MySQL</span>
        <span class="stack-sep">//</span>
        <span class="tag">QGIS</span>
        <span class="stack-sep">//</span>
        <span class="tag">SIG</span>
      </div>

      <div class="hero-actions" style="animation: fadeUp .8s .95s both">
        <a href="#projects" class="btn btn-primary">
          Voir mes projets
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </a>
        <a href="#contact" class="btn btn-outline">Me contacter</a>
      </div>

      <!-- Stats -->
      <div class="hero-stats" style="animation: fadeUp .8s 1.1s both">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-value" :data-target="stat.rawValue || stat.value.replace(/\D/g,'')">
            {{ stat.value }}
          </span>
          <span class="stat-label">{{ stat.label }}</span>
          <div class="stat-bar"><div class="stat-bar-fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  profile: { type: Object, required: true },
  stats:   { type: Array, default: () => [] }
})

const mapEl        = ref(null)
const typewriterEl = ref(null)
const particlesEl  = ref(null)

// Typewriter
const phrases = ['Développeur Web', 'Géomaticien SIG', 'Vue.js Developer', 'Data Visualizer', 'Cartographe Digital']
let pi = 0, ci = 0, deleting = false
function typewrite() {
  if (!typewriterEl.value) return
  const phrase = phrases[pi]
  typewriterEl.value.textContent = deleting ? phrase.slice(0, --ci) : phrase.slice(0, ++ci)
  if (!deleting && ci === phrase.length) { setTimeout(() => { deleting = true; setTimeout(typewrite, 2200) }, 1800); return }
  if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length }
  setTimeout(typewrite, deleting ? 55 : 100)
}

// Particles
function initParticles() {
  if (!particlesEl.value) return
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div')
    p.className = 'particle'
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${4+Math.random()*6}s;--delay:${Math.random()*5}s;opacity:${.15+Math.random()*.45};width:${Math.random()>.7?3:2}px;height:${Math.random()>.7?3:2}px`
    particlesEl.value.appendChild(p)
  }
}

// Leaflet map
function initMap() {
  if (!mapEl.value || !window.L) return
  try {
    const map = window.L.map(mapEl.value, {
      center: [35.7595, 5.8340], zoom: 13,
      zoomControl: false, scrollWheelZoom: false,
      dragging: false, touchZoom: false,
      doubleClickZoom: false, boxZoom: false,
      keyboard: false, attributionControl: false, interactive: false
    })
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map)
    const icon = window.L.divIcon({
      html: '<div style="width:10px;height:10px;background:#00d4ff;border:2px solid #fff;border-radius:50%;box-shadow:0 0 12px #00d4ff"></div>',
      iconSize: [10, 10], className: ''
    })
    window.L.marker([35.7595, 5.8340], { icon }).addTo(map)
  } catch (e) { console.warn('Map init:', e) }
}

// Stats counter
function animateStats() {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = +el.dataset.target
    const suffix = el.textContent.replace(/\d/g, '').trim()
    const dur = 1800, start = performance.now()
    const update = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      el.textContent = Math.round(ease * target) + suffix
      if (p < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  })
  document.querySelectorAll('.stat-bar-fill').forEach((b, i) => {
    const fills = ['75%', '90%', '100%', '60%']
    setTimeout(() => { b.style.width = fills[i] || '70%' }, i * 200)
  })
}

onMounted(() => {
  setTimeout(typewrite, 900)
  initParticles()
  setTimeout(initMap, 600)
  // Animate stats after a short delay
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateStats(); observer.disconnect() }
  }, { threshold: 0.3 })
  const statsEl = document.querySelector('.hero-stats')
  if (statsEl) observer.observe(statsEl)
})
</script>

<style scoped>
.hero {
  min-height: 100vh; display: flex; align-items: center;
  padding-top: var(--nav-h); position: relative; background: var(--bg-0);
}

/* Map layers */
.hero-map-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.hero-map-bg img { width: 100%; height: 100%; object-fit: cover; opacity: .12; filter: saturate(.2) hue-rotate(180deg) brightness(.6); }
.hero-map-leaf { position: absolute; inset: 0; z-index: 1; opacity: .22; pointer-events: none; }
.hero-map-overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(135deg, rgba(2,11,20,.9) 0%, rgba(2,11,20,.6) 60%, rgba(2,11,20,.9) 100%); pointer-events: none; }
.hero-grid-anim {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background-image: linear-gradient(rgba(0,212,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,.04) 1px, transparent 1px);
  background-size: 48px 48px; animation: grid-move 4s linear infinite;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}
.hero-scanline {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan-dim), transparent);
  animation: scan 6s linear infinite; pointer-events: none; z-index: 3;
}

/* Radar */
.radar-wrap { position: absolute; right: 5%; top: 50%; transform: translateY(-50%); width: 400px; height: 400px; opacity: .3; pointer-events: none; z-index: 4; }
@media(max-width:1100px) { .radar-wrap { display: none; } }
.radar-c { position: absolute; inset: 0; border: 1px solid var(--border-2); border-radius: 50%; }
.radar-c:nth-child(2) { inset: 20%; opacity: .6; }
.radar-c:nth-child(3) { inset: 40%; opacity: .4; }
.radar-c:nth-child(4) { inset: 60%; opacity: .3; }
.radar-sweep { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, transparent 75%, rgba(0,212,255,.3) 100%); animation: radar-spin 4s linear infinite; }
.radar-cross { position: absolute; inset: 0; }
.radar-cross::before { content: ''; position: absolute; width: 100%; height: 1px; top: 50%; background: var(--border); transform: translateY(-50%); }
.radar-cross::after  { content: ''; position: absolute; width: 1px; height: 100%; left: 50%; background: var(--border); transform: translateX(-50%); }
.rdot { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }
.rdot-ping { position: absolute; inset: -3px; border-radius: 50%; background: var(--cyan); animation: ping 2s ease-out infinite; }
.rdot-1 { top: 28%; left: 60%; }
.rdot-2 { top: 55%; left: 32%; }
.rdot-3 { top: 68%; left: 64%; }

/* Decorative */
.deco { position: absolute; z-index: 4; opacity: 0; pointer-events: none; }
.deco-drone { left: 2%; bottom: 10%; opacity: .22; animation: float 7s ease-in-out infinite; }
.deco-sat   { right: 2%; bottom: 14%; opacity: .18; animation: float 9s ease-in-out infinite 2s; }
.deco-img { object-fit: cover; filter: saturate(.3) brightness(.65) hue-rotate(185deg); }
.deco-img-drone { width: 160px; height: 110px; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
.deco-img-sat   { width: 130px; height: 130px; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); border: 1px solid rgba(0,212,255,.3); }
.deco-label { font-family: var(--font-mono); font-size: .52rem; letter-spacing: .18em; text-transform: uppercase; color: var(--cyan); opacity: .7; margin-top: 5px; text-align: center; }

/* Particles */
.particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 4; }
:deep(.particle) { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: var(--cyan); animation: float var(--dur, 6s) ease-in-out infinite var(--delay, 0s); }

/* Content */
.hero-content { position: relative; z-index: 5; padding: 4rem 0 6rem; }

.hero-eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 2rem; }
.eyebrow-line { width: 40px; height: 1px; background: var(--cyan); }
.eyebrow-text { font-family: var(--font-mono); font-size: .65rem; letter-spacing: .2em; text-transform: uppercase; color: var(--cyan); }
.eyebrow-dot  { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); animation: glow-pulse 2s ease-in-out infinite; }

.hero-name { margin-bottom: .5rem; }
.hero-name .line1 { display: block; color: var(--text-2); font-weight: 300; font-style: italic; font-size: .6em; }
.hero-name .line2 { display: block; color: var(--text); background: linear-gradient(135deg, var(--text) 40%, var(--cyan-l)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

.hero-title-bar { display: flex; align-items: center; gap: 14px; margin-bottom: 2rem; }
.bracket { font-family: var(--font-mono); font-size: 1rem; color: var(--cyan); opacity: .5; }
.hero-title-txt { font-family: var(--font-tech); font-size: 1.1rem; font-weight: 500; letter-spacing: .15em; text-transform: uppercase; color: var(--text-2); }
.cursor { display: inline-block; width: 2px; height: 1.1em; background: var(--cyan); vertical-align: middle; margin-left: 3px; animation: blink 1s step-end infinite; }

.hero-tagline { max-width: 520px; font-size: 1rem; color: var(--text-2); margin-bottom: 2.5rem; line-height: 1.85; }

.hero-coords { display: flex; gap: 2rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
.coord-item { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: .65rem; letter-spacing: .08em; color: var(--text-3); }
.sep       { color: var(--text-3); }
.coord-val { color: var(--cyan); opacity: .85; }

.hero-stack { display: flex; align-items: center; gap: .75rem; margin-bottom: 3rem; flex-wrap: wrap; }
.stack-sep  { font-family: var(--font-mono); font-size: .7rem; color: var(--text-3); }

.hero-actions { display: flex; gap: 1rem; margin-bottom: 5rem; flex-wrap: wrap; }

.hero-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; border-top: 1px solid var(--border); padding-top: 3rem; }
@media(max-width:640px) { .hero-stats { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }

.stat-item { padding: 0 1.5rem 0 0; }
.stat-item:not(:last-child) { border-right: 1px solid var(--border); }
@media(max-width:640px) { .stat-item { border-right: none !important; padding: 0; } }
.stat-value { font-family: var(--font-tech); font-size: 2.8rem; font-weight: 700; line-height: 1; color: var(--cyan); display: block; }
.stat-label { font-family: var(--font-mono); font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); display: block; margin-top: 4px; }
.stat-bar { width: 32px; height: 2px; background: var(--surface-3); margin-top: 8px; overflow: hidden; }
.stat-bar-fill { height: 100%; width: 0; background: linear-gradient(90deg, var(--blue), var(--cyan)); transition: width 1.4s var(--ease); }

@keyframes grid-move { from { background-position: 0 0; } to { background-position: 48px 48px; } }
@keyframes scan { 0% { transform: translateY(-100vh); opacity: .6; } 100% { transform: translateY(200vh); opacity: 0; } }
@keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
