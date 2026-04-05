<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-title">Bonjour, <em>{{ firstName }}</em> 👋</h1>
        <p class="page-subtitle">Vue d'ensemble · {{ today }}</p>
      </div>
      <a href="/" target="_blank" class="btn btn-ghost btn-sm">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
        </svg>
        Voir le site
      </a>
    </div>

    <!-- Stats cards -->
    <div v-if="!loadingStats" class="grid-4" style="margin-bottom:1.25rem">
      <div v-for="s in stats" :key="s.label" class="stat-card card">
        <div class="stat-icon" :style="`color:${s.color}`" v-html="s.icon"></div>
        <div class="stat-value">{{ s.value }}</div>
        <div class="stat-label mono">{{ s.label }}</div>
        <div v-if="s.sub" class="stat-sub mono">{{ s.sub }}</div>
      </div>
    </div>
    <div v-else class="grid-4" style="margin-bottom:1.25rem">
      <div v-for="i in 4" :key="i" class="card skeleton"></div>
    </div>

    <!-- Grid: messages + actions -->
    <div class="dash-grid">
      <!-- Recent messages -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Messages récents</span>
          <RouterLink to="/messages" class="btn btn-ghost btn-sm">Voir tout</RouterLink>
        </div>
        <div v-if="loadingMsgs" class="empty-state" style="height:160px"><span class="spinner"></span></div>
        <div v-else-if="recentMsgs.length === 0" class="empty-state" style="height:120px">
          <span class="empty-state-icon">✉️</span>
          <span class="empty-state-text">Aucun message</span>
        </div>
        <div v-else class="msg-list">
          <div v-for="msg in recentMsgs" :key="msg.id" class="msg-row" :class="{ unread: !msg.read }">
            <div class="msg-avatar">{{ msg.name[0].toUpperCase() }}</div>
            <div class="msg-info">
              <div class="msg-name">
                {{ msg.name }}
                <span v-if="!msg.read" class="badge badge-cyan" style="margin-left:6px;font-size:.55rem">Nouveau</span>
              </div>
              <div class="msg-subject mono">{{ msg.subject || '(sans sujet)' }}</div>
            </div>
            <div class="msg-date mono">{{ fmtDate(msg.created_at) }}</div>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div style="display:flex;flex-direction:column;gap:1.25rem">
        <!-- Quick actions -->
        <div class="card">
          <div class="card-header"><span class="card-title">Actions rapides</span></div>
          <div class="quick-actions">
            <RouterLink v-for="a in quickActions" :key="a.to" :to="a.to" class="qa-item">
              <span class="qa-icon" v-html="a.icon"></span>
              <span>{{ a.label }}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:auto;opacity:.4"><path d="M9 18l6-6-6-6"/></svg>
            </RouterLink>
          </div>
        </div>

        <!-- Status -->
        <div class="card">
          <div class="card-header"><span class="card-title">État du système</span></div>
          <div class="status-list">
            <div v-for="s in statusItems" :key="s.label" class="status-row">
              <span class="status-dot" :style="`background:${s.color}`"></span>
              <span class="status-label">{{ s.label }}</span>
              <span class="mono" style="font-size:.68rem;color:var(--text-3)">{{ s.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills preview -->
    <div class="card" style="margin-top:1.25rem">
      <div class="card-header">
        <span class="card-title">Compétences — aperçu</span>
        <RouterLink to="/skills" class="btn btn-ghost btn-sm">Modifier</RouterLink>
      </div>
      <div v-if="!loadingSkills" class="skills-preview">
        <div v-for="sk in topSkills" :key="sk.id" class="skill-row">
          <span class="skill-name">{{ sk.name }}</span>
          <div class="skill-track"><div class="skill-fill" :style="`width:${sk.level}%`"></div></div>
          <span class="skill-pct mono">{{ sk.level }}%</span>
        </div>
      </div>
      <div v-else class="empty-state" style="height:100px"><span class="spinner"></span></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const firstName = computed(() => auth.user?.email?.split('@')[0] || 'Admin')
const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

const loadingStats  = ref(true)
const loadingMsgs   = ref(true)
const loadingSkills = ref(true)
const stats         = ref([])
const recentMsgs    = ref([])
const topSkills     = ref([])

const iconSvg = (d) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${d}</svg>`

onMounted(async () => {
  const [pR, sR, eR, mR, uR] = await Promise.all([
    supabase.from('projects').select('id',   { count:'exact', head:true }),
    supabase.from('skills').select('id',     { count:'exact', head:true }),
    supabase.from('experience').select('id', { count:'exact', head:true }),
    supabase.from('messages').select('id',   { count:'exact', head:true }),
    supabase.from('messages').select('id',   { count:'exact', head:true }).eq('read', false),
  ])
  stats.value = [
    { label:'Projets',     value: pR.count ?? 0, color:'var(--cyan)',  sub: null,
      icon: iconSvg('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>') },
    { label:'Compétences', value: sR.count ?? 0, color:'var(--blue-l)',sub: null,
      icon: iconSvg('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>') },
    { label:'Expériences', value: eR.count ?? 0, color:'#4adb7a',     sub: null,
      icon: iconSvg('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>') },
    { label:'Messages',    value: mR.count ?? 0, color:'var(--gold)', sub: uR.count > 0 ? `${uR.count} non lu(s)` : null,
      icon: iconSvg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>') },
  ]
  loadingStats.value = false

  const { data: msgs } = await supabase.from('messages').select('*').order('created_at', { ascending:false }).limit(5)
  recentMsgs.value = msgs || []
  loadingMsgs.value = false

  const { data: sk } = await supabase.from('skills').select('*').order('level', { ascending:false }).limit(6)
  topSkills.value = sk || []
  loadingSkills.value = false
})

const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })

const quickActions = [
  { to:'/projects',   label:'Ajouter un projet',
    icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
  { to:'/skills',     label:'Modifier les compétences',
    icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { to:'/experience', label:'Ajouter une expérience',
    icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
  { to:'/messages',   label:'Lire les messages',
    icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
]

const statusItems = [
  { label:'Portfolio en ligne', value:'Actif',    color:'var(--green)' },
  { label:'Base Supabase',      value:'Connectée',color:'var(--green)' },
  { label:'Images Cloudinary',  value:'Actif',    color:'var(--green)' },
  { label:'Authentification',   value:'Sécurisée',color:'var(--cyan)' },
]
</script>

<style scoped>
em { font-style:italic; color:var(--cyan); }

.stat-card { text-align:center; padding:1.5rem 1rem; }
.stat-icon { display:flex; justify-content:center; margin-bottom:.75rem; opacity:.85; }
.stat-value { font-family:var(--tech); font-size:2.2rem; font-weight:300; color:var(--text); line-height:1; margin-bottom:4px; }
.stat-label { font-size:.6rem; letter-spacing:.12em; text-transform:uppercase; color:var(--text-3); }
.stat-sub   { font-size:.62rem; color:var(--gold); margin-top:4px; letter-spacing:.08em; }
.skeleton   { height:120px; background:linear-gradient(90deg,var(--surface) 25%,var(--surface-2) 50%,var(--surface) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }
@keyframes shimmer { to { background-position:-200% 0; } }

.dash-grid { display:grid; grid-template-columns:1fr 360px; gap:1.25rem; }
@media(max-width:1024px) { .dash-grid { grid-template-columns:1fr; } }

.msg-list { display:flex; flex-direction:column; }
.msg-row  { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border); }
.msg-row:last-child { border-bottom:none; }
.msg-row.unread .msg-name { font-weight:700; color:var(--text); }
.msg-avatar { width:32px; height:32px; border-radius:50%; background:var(--surface-2); border:1px solid var(--border-2); display:flex; align-items:center; justify-content:center; font-size:.8rem; color:var(--cyan); flex-shrink:0; }
.msg-info   { flex:1; min-width:0; }
.msg-name   { font-size:.85rem; color:var(--text-2); display:flex; align-items:center; }
.msg-subject{ font-size:.68rem; letter-spacing:.05em; color:var(--text-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.msg-date   { font-size:.62rem; color:var(--text-3); flex-shrink:0; }

.quick-actions { display:flex; flex-direction:column; gap:2px; }
.qa-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:5px; color:var(--text-2); font-size:.85rem; transition:all .15s; border:1px solid transparent; }
.qa-item:hover { background:var(--cyan-dim); border-color:var(--border-2); color:var(--cyan); }
.qa-icon { display:flex; color:var(--cyan); flex-shrink:0; }

.status-list { display:flex; flex-direction:column; gap:10px; }
.status-row  { display:flex; align-items:center; gap:10px; font-size:.85rem; }
.status-dot  { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.status-label{ flex:1; color:var(--text-2); }

.skills-preview { display:flex; flex-direction:column; gap:12px; }
.skill-row  { display:flex; align-items:center; gap:12px; }
.skill-name { font-size:.82rem; color:var(--text-2); width:130px; flex-shrink:0; }
.skill-track{ flex:1; height:3px; background:var(--bg-3); border-radius:2px; overflow:hidden; }
.skill-fill { height:100%; background:linear-gradient(90deg,var(--blue),var(--cyan)); border-radius:2px; transition:width 1s var(--ease); }
.skill-pct  { font-size:.62rem; color:var(--text-3); width:36px; text-align:right; flex-shrink:0; }
</style>
