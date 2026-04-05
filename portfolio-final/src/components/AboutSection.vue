<template>
  <section id="about" class="about">
    <div class="about-bg"></div>
    <div class="container">
      <div class="about-grid">
        <!-- Left: Text -->
        <div>
          <div class="section-label reveal">01 / À Propos</div>
          <h2 class="about-heading reveal reveal-delay-1">
            Ingénieur en devenir,<br>
            <em>développeur par passion</em>
          </h2>
          <p class="about-bio reveal reveal-delay-2">{{ profile.bio }}</p>

          <div class="about-meta reveal reveal-delay-3">
            <div class="meta-row" v-for="item in metaItems" :key="item.label">
              <span class="meta-icon" v-html="item.icon"></span>
              <span class="meta-label mono">{{ item.label }}</span>
              <span>{{ item.value }}</span>
            </div>
          </div>

          <div class="about-socials reveal reveal-delay-4">
            <a
              v-for="social in profile.socials"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              <SocialIcon :name="social.icon" />
              {{ social.name }}
            </a>
          </div>
        </div>

        <!-- Right: ID Card -->
        <div class="reveal reveal-delay-2">
          <div class="id-card">
            <div class="id-header">
              <div class="id-logo">
                <div class="id-avatar">
                  <img v-if="profile.photoUrl" :src="profile.photoUrl" alt="SOULI MATHIEU" />
                  <span v-else class="id-avatar-fb">SM</span>
                </div>
                <div class="id-name-wrap">
                  <div class="id-name">{{ profile.firstName }} {{ profile.lastName }}</div>
                  <div class="id-role mono">{{ profile.title }}</div>
                </div>
              </div>
            </div>
            <div class="id-body">
              <div class="id-field" v-for="f in idFields" :key="f.label">
                <span class="id-fl mono">{{ f.label }}</span>
                <span class="id-fv">{{ f.value }}</span>
              </div>
            </div>
            <div class="id-footer">
              <div class="id-dot"></div>
              <span class="id-status mono">{{ profile.availability }}</span>
            </div>
          </div>

          
          <!-- Geo coordinates -->
          <div class="geo-coord">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.5)" stroke-width="1">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <div>
              <div class="geo-coord-label mono">Coordonnées SIG</div>
              <div class="geo-coord-val mono">35.7595° N · 5.8340° W</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import SocialIcon from './SocialIcon.vue'

const props = defineProps({ profile: { type: Object, required: true } })

const metaItems = computed(() => [
  { label: 'Localisation', value: props.profile.location || 'Tanger, Maroc',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>' },
  { label: 'Email', value: props.profile.email || 'souli.mathieu@email.com',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
  { label: 'Téléphone', value: props.profile.phone || '+212 6XX XXX XXX',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81"/></svg>' },
  { label: 'Formation', value: 'FST Tanger — Ingénieur Géoinfo',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>' },
])

const idFields = [
  { label: 'École',     value: 'FST Tanger' },
  { label: 'Cycle',     value: 'Ingénieur Géoinfo' },
  { label: 'Hackathon', value: 'UNESCO 2026 🏆' },
  { label: 'Langues',   value: 'FR · AR · EN' },
  { label: 'Passion',   value: 'SIG & UX Design' },
]
</script>

<style scoped>
.about { background: linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%); }
.about-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,212,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,.025) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; opacity: .5; }
.about-grid { display: grid; grid-template-columns: 1fr 380px; gap: 5rem; align-items: start; }
@media(max-width:1024px) { .about-grid { grid-template-columns: 1fr; gap: 3rem; } }

.about-heading { margin: 1rem 0 1.75rem; color: var(--text); }
.about-heading em { font-style: normal; color: var(--cyan); }
.about-bio { font-size: 1rem; line-height: 1.9; margin-bottom: 2.5rem; }

.about-meta { display: flex; flex-direction: column; gap: 8px; margin-bottom: 2.5rem; }
.meta-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border); font-size: .85rem; color: var(--text-2); transition: border-color .2s; }
.meta-row:hover { border-color: var(--border-2); }
.meta-icon { color: var(--cyan); display: flex; align-items: center; flex-shrink: 0; }
.meta-label { font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); width: 90px; flex-shrink: 0; }

.about-socials { display: flex; gap: 10px; flex-wrap: wrap; }
.social-link { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; border: 1px solid var(--border-2); font-family: var(--font-mono); font-size: .65rem; letter-spacing: .1em; color: var(--text-2); transition: all .3s; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); }
.social-link:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }

/* ID Card */
.id-card { background: var(--surface); border: 1px solid var(--border-2); overflow: hidden; clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px)); }
.id-header { background: linear-gradient(135deg, var(--blue-mid), var(--surface-3)); padding: 1.5rem; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
.id-header::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(0,212,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,.05) 1px, transparent 1px); background-size: 20px 20px; }
.id-logo { position: relative; z-index: 1; display: flex; align-items: center; gap: 14px; }
.id-avatar { width: 64px; height: 64px; border: 2px solid var(--cyan); background: var(--cyan-dim); display: flex; align-items: center; justify-content: center; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); overflow: hidden; cursor: pointer; position: relative; }
.id-avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.id-avatar-fb  { font-family: var(--font-tech); font-size: 1.4rem; font-weight: 700; color: var(--cyan); }
.id-avatar-hover { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,212,255,.3); font-family: var(--font-mono); font-size: .5rem; text-align: center; padding: 2px; color: var(--bg-0); opacity: 0; transition: opacity .2s; }
.id-avatar:hover .id-avatar-hover { opacity: 1; }
.id-name-wrap .id-name { font-family: var(--font-tech); font-size: 1.2rem; font-weight: 700; color: var(--text); }
.id-name-wrap .id-role { font-size: .6rem; letter-spacing: .15em; text-transform: uppercase; color: var(--cyan); margin-top: 3px; }
.id-body { padding: 1.5rem; }
.id-field { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); }
.id-field:last-child { border: none; }
.id-fl { font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); }
.id-fv { font-size: .82rem; color: var(--text-2); }
.id-footer { padding: .75rem 1.5rem; background: rgba(0,212,255,.04); border-top: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
.id-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: glow-pulse 2s ease-in-out infinite; }
.id-status { font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: var(--green); }

/* Photo hint */
.photo-hint { margin-top: .75rem; padding: .85rem 1.1rem; background: var(--surface); border: 1px solid var(--border-2); display: flex; align-items: center; gap: 10px; cursor: pointer; transition: border-color .2s; }
.photo-hint:hover { border-color: var(--cyan); }
.photo-hint-icon { width: 30px; height: 30px; background: var(--cyan-dim); border: 1px solid var(--border-2); display: flex; align-items: center; justify-content: center; color: var(--cyan); clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px)); }
.photo-hint-label { font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); }
.photo-hint-cta { font-size: .68rem; color: var(--cyan); margin-top: 2px; }

/* Geo coord */
.geo-coord { margin-top: .75rem; padding: .85rem 1.1rem; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
.geo-coord-label { font-size: .55rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); }
.geo-coord-val { font-size: .72rem; color: var(--cyan); margin-top: 3px; }
</style>
