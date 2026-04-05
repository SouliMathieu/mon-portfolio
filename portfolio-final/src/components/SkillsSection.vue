<template>
  <section id="skills" class="skills">
    <div class="skills-bg"></div>
    <div class="container">
      <div class="skills-intro">
        <div>
          <div class="section-label reveal">02 / Compétences</div>
          <h2 class="reveal reveal-delay-1">Mes <em>outils</em><br>&amp; technologies</h2>
        </div>
        <p class="reveal reveal-delay-2">
          Un ensemble cohérent de technologies web et géospatiales, cultivé au fil de projets académiques, hackathons internationaux et certifications professionnelles Esri.
        </p>
      </div>

      <div class="skills-grid">
        <div
          v-for="(group, gi) in skills"
          :key="group.category"
          class="geo-card reveal"
          :class="`reveal-delay-${gi + 1}`"
        >
          <div class="skill-cat-head">
            <div class="skill-cat-icon">{{ group.icon }}</div>
            <span class="skill-cat-name">{{ group.category }}</span>
          </div>
          <div
            v-for="skill in group.items"
            :key="skill.uniqueKey || `${group.category}-${skill.name}`"
            class="skill-item"
          >
            <div class="skill-row">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-pct mono">{{ skill.level }}%</span>
            </div>
            <div class="skill-track">
              <div
                class="skill-fill"
                :style="`--w: ${skill.level}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="tools-strip reveal">
        <span class="tools-label mono">Outils</span>
        <div class="tools-list">
          <span v-for="tool in extraTools" :key="tool" class="tag">{{ tool }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  skills: { type: Array, default: () => [] }
})

const extraTools = [
  'Git / GitHub', 'VS Code', 'Figma', 'Phildigit',
  'Inkscape', 'SRTM', 'GADM', 'OSM Geofabrik',
  'HCP RGPH', 'Pinia', 'Vue Router', 'Agile / Scrum'
]

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('go')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.3 })
  document.querySelectorAll('.skill-fill').forEach(el => observer.observe(el))
})
</script>

<style scoped>
.skills { background: var(--bg-1); }
.skills-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,212,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,.02) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; }

.skills-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 4rem; align-items: end; }
@media(max-width:768px) { .skills-intro { grid-template-columns: 1fr; gap: 2rem; } }
.skills-intro h2 { color: var(--text); }
.skills-intro h2 em { font-style: normal; color: var(--cyan); }
.skills-intro p { border-top: 1px solid var(--border); padding-top: 1rem; }

.skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
@media(max-width:900px) { .skills-grid { grid-template-columns: 1fr 1fr; } }
@media(max-width:560px) { .skills-grid { grid-template-columns: 1fr; } }

.skill-cat-head { display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
.skill-cat-icon { font-size: 1rem; width: 34px; height: 34px; background: var(--cyan-dim); border: 1px solid var(--border-2); display: flex; align-items: center; justify-content: center; clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px)); }
.skill-cat-name { font-family: var(--font-tech); font-size: .78rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: var(--text); }

.skill-item { margin-bottom: 1.1rem; }
.skill-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.skill-name { font-size: .85rem; color: var(--text-2); }
.skill-pct  { font-size: .6rem; color: var(--cyan); letter-spacing: .08em; }
.skill-track { height: 3px; background: var(--surface-3); position: relative; overflow: hidden; }
.skill-fill  { height: 100%; width: 0; background: linear-gradient(90deg, var(--blue), var(--cyan)); transition: width 1.2s var(--ease); position: relative; }
.skill-fill.go { width: var(--w); }
.skill-fill::after { content: ''; position: absolute; right: -1px; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }

.tools-strip { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem 2rem; border: 1px solid var(--border); background: var(--surface); flex-wrap: wrap; }
.tools-label { font-size: .6rem; letter-spacing: .2em; text-transform: uppercase; color: var(--text-3); white-space: nowrap; }
.tools-list  { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
