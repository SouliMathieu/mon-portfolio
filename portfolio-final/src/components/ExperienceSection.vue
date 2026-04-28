<template>
  <section id="experience" class="experience">
    <div class="container">
      <div class="exp-intro">
        <div>
          <div class="section-label reveal">04 / Parcours</div>
          <h2 class="reveal reveal-delay-1">Formation<br><em>&amp; Parcours</em></h2>
        </div>
        <p class="reveal reveal-delay-2">
          Mon parcours académique, du Baccalauréat série D au cycle ingénieur en Géoinformation à l’Université Abdelmalek Essaâdi.
        </p>
      </div>

      <div class="timeline">
        <div
          v-for="(item, i) in experience"
          :key="i"
          class="tl-item reveal"
          :class="[`reveal-delay-${(i % 3) + 1}`, { highlight: item.highlight }]"
        >
          <div class="tl-connector">
            <div class="tl-dot"><div class="tl-dot-inner"></div></div>
            <div class="tl-line" v-if="i < experience.length - 1"></div>
          </div>

          <div class="tl-card">
            <div class="tl-top">
              <span class="tl-period mono">{{ item.period }}</span>
              <span class="tl-badge" :class="`badge-${item.type}`">{{ typeLabel(item.type) }}</span>
            </div>
            <h3 class="tl-title">{{ item.title }}</h3>
            <div class="tl-org">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>{{ item.org }}</span>
              <span class="tl-sep">·</span>
              <span class="tl-loc">{{ item.location }}</span>
            </div>
            <p class="tl-desc">{{ item.description }}</p>
            <div class="tl-tags">
              <span v-for="tag in (item.tags || [])" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="cv-cta reveal reveal-delay-3">
        <div class="cv-cta-inner">
          <div>
            <div class="cv-cta-label mono">CV complet</div>
            <div class="cv-cta-text">Toutes mes expériences en un document</div>
          </div>
          <a href="#" class="btn btn-primary" download>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Télécharger CV
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  experience: { type: Array, default: () => [] }
})

const typeLabel = (type) => ({
  education:    'Formation',
  achievement:  'Réalisation',
  certification:'Certification',
  work:         'Expérience',
})[type] || type
</script>

<style scoped>
.experience { background: linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%); }
.exp-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; margin-bottom: 4rem; }
@media(max-width:768px) { .exp-intro { grid-template-columns: 1fr; gap: 2rem; } }
.exp-intro h2 { color: var(--text); }
.exp-intro h2 em { font-style: normal; color: var(--cyan); }
.exp-intro p { border-top: 1px solid var(--border); padding-top: 1rem; }

.timeline { display: flex; flex-direction: column; }
.tl-item  { display: grid; grid-template-columns: 44px 1fr; gap: 0 1.5rem; }

.tl-connector { display: flex; flex-direction: column; align-items: center; padding-top: 1.25rem; }
.tl-dot { width: 20px; height: 20px; border: 1px solid var(--border-2); background: var(--surface); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .3s; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); }
.tl-item:hover .tl-dot, .tl-item.highlight .tl-dot { background: var(--cyan-dim); border-color: var(--cyan); }
.tl-item.highlight .tl-dot { box-shadow: 0 0 12px var(--cyan-dim); }
.tl-dot-inner { width: 6px; height: 6px; background: var(--text-3); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); transition: background .3s; }
.tl-item:hover .tl-dot-inner, .tl-item.highlight .tl-dot-inner { background: var(--cyan); }
.tl-line { flex: 1; width: 1px; background: var(--border); min-height: 1.5rem; margin: 4px 0; }

.tl-card { padding: 1.25rem 1.5rem; margin-bottom: .75rem; border: 1px solid var(--border); background: var(--surface); transition: border-color .3s, transform .3s; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
.tl-card:hover { border-color: var(--border-2); transform: translateX(4px); }
.tl-item.highlight .tl-card { border-left: 2px solid var(--cyan); }
.tl-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: .6rem; flex-wrap: wrap; gap: 8px; }
.tl-period { font-size: .6rem; letter-spacing: .1em; color: var(--text-3); }
.tl-badge { font-family: var(--font-mono); font-size: .58rem; letter-spacing: .1em; text-transform: uppercase; padding: 2px 8px; border: 1px solid; clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px)); }
.badge-education    { color: var(--blue-l); border-color: rgba(77,168,218,.3); background: rgba(77,168,218,.06); }
.badge-achievement  { color: var(--gold); border-color: rgba(240,165,0,.3); background: var(--gold-dim); }
.badge-certification{ color: #4adb7a; border-color: rgba(74,219,122,.3); background: rgba(74,219,122,.06); }
.badge-work         { color: #c87dd4; border-color: rgba(200,125,212,.3); background: rgba(200,125,212,.06); }
.tl-title { font-family: var(--font-tech); font-size: 1.15rem; font-weight: 600; color: var(--text); margin-bottom: .4rem; }
.tl-org   { display: flex; align-items: center; gap: 6px; font-size: .8rem; color: var(--text-2); margin-bottom: .6rem; flex-wrap: wrap; }
.tl-sep   { color: var(--text-3); }
.tl-loc   { color: var(--text-3); font-size: .75rem; }
.tl-desc  { font-size: .85rem; line-height: 1.7; margin-bottom: .75rem; }
.tl-tags  { display: flex; flex-wrap: wrap; gap: 5px; }

.cv-cta { border: 1px solid var(--border-2); background: var(--surface); clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); margin-top: 2rem; }
.cv-cta-inner { display: flex; align-items: center; justify-content: space-between; padding: 2rem; gap: 2rem; flex-wrap: wrap; }
.cv-cta-label { font-size: .6rem; letter-spacing: .15em; text-transform: uppercase; color: var(--cyan); margin-bottom: 4px; }
.cv-cta-text  { font-size: .95rem; color: var(--text-2); }
</style>
