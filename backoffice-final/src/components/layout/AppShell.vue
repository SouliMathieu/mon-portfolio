<template>
  <div class="shell" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="sidebar-brand">
          <span class="brand-initials">SM</span>
          <div v-if="!collapsed" class="brand-info">
            <span class="brand-name">Backoffice</span>
            <span class="brand-sub mono">Portfolio Admin</span>
          </div>
        </div>
        <button class="collapse-btn" @click="collapsed = !collapsed" :title="collapsed ? 'Expand' : 'Collapse'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="!collapsed" d="M15 18l-6-6 6-6"/>
            <path v-else d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label mono" v-if="!collapsed">Navigation</div>
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: isActive(item) }"
          :title="collapsed ? item.label : ''"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
          <span v-if="!collapsed && item.badge" class="nav-badge">{{ item.badge }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div v-if="!collapsed" class="sidebar-user">
          <span class="user-avatar">{{ userInitial }}</span>
          <div class="user-info">
            <span class="user-email">{{ authStore.user?.email }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="logout" :title="'Déconnexion'">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span v-if="!collapsed">Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="main-wrap">
      <!-- Header -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div class="topbar-breadcrumb">
            <span class="mono text-dim">Portfolio /</span>
            <span class="mono text-gold">{{ currentPageLabel }}</span>
          </div>
        </div>
        <div class="topbar-right">
          <a href="/" target="_blank" class="btn btn-ghost btn-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
            Voir le site
          </a>
        </div>
      </header>

      <!-- Page content -->
      <main class="main-content">
        <RouterView />
      </main>
    </div>

    <!-- Mobile overlay -->
    <div v-if="mobileOpen" class="mobile-overlay" @click="mobileOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router    = useRouter()
const route     = useRoute()
const collapsed  = ref(false)
const mobileOpen = ref(false)

const userInitial = computed(() => authStore.user?.email?.[0]?.toUpperCase() || 'A')

const navItems = [
  { to: '/',           label: 'Dashboard',    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { to: '/profile',    label: 'Profil',       icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { to: '/projects',   label: 'Projets',      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
  { to: '/skills',     label: 'Compétences',  icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { to: '/experience', label: 'Parcours',     icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>' },
  { to: '/messages',   label: 'Messages',     icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', badge: null },
]

const isActive = (item) => {
  if (item.to === '/') return route.path === '/'
  return route.path.startsWith(item.to)
}

const currentPageLabel = computed(() => {
  const found = navItems.find(i => isActive(i))
  return found?.label || 'Dashboard'
})

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
}

/* ── Sidebar ── */
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg-2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.25s var(--ease);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
.shell.sidebar-collapsed .sidebar { width: 64px; }

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border);
  min-height: var(--header-h);
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}
.brand-initials {
  width: 32px; height: 32px;
  border-radius: 6px;
  background: var(--gold-dim);
  border: 1px solid var(--border-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--display);
  font-size: 1rem;
  color: var(--gold);
  flex-shrink: 0;
}
.brand-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}
.brand-sub {
  display: block;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
}
.collapse-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-2);
  width: 24px; height: 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.collapse-btn:hover { border-color: var(--gold); color: var(--gold); }

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-section-label {
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-3);
  padding: 4px 8px 8px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 5px;
  color: var(--text-2);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.15s;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}
.nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text); }
.nav-item.active { background: var(--gold-dim); color: var(--gold); }
.nav-item.active .nav-icon { color: var(--gold); }
.nav-icon { display: flex; align-items: center; flex-shrink: 0; }
.nav-label { flex: 1; }
.nav-badge {
  background: var(--red);
  color: #fff;
  font-family: var(--mono);
  font-size: 0.6rem;
  padding: 1px 6px;
  border-radius: 100px;
  min-width: 18px;
  text-align: center;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  overflow: hidden;
}
.user-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--border-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--gold);
  flex-shrink: 0;
}
.user-email { font-size: 0.72rem; color: var(--text-2); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 5px;
  color: var(--text-2);
  font-family: var(--font);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}
.logout-btn:hover { border-color: var(--red); color: var(--red); background: rgba(224,82,82,0.07); }

/* ── Main ── */
.main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.topbar {
  height: var(--header-h);
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}
.topbar-left { display: flex; align-items: center; gap: 1rem; }
.topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; }
.mobile-menu-btn { display: none; background: none; border: none; color: var(--text-2); cursor: pointer; }
.topbar-right { display: flex; align-items: center; gap: 8px; }
.main-content { flex: 1; padding: 2rem; max-width: 1300px; width: 100%; }

/* Mobile */
.mobile-overlay { display: none; }
@media (max-width: 768px) {
  .sidebar { position: fixed; left: 0; top: 0; bottom: 0; z-index: 200; transform: translateX(-100%); transition: transform 0.3s var(--ease); width: var(--sidebar-w) !important; }
  .mobile-menu-btn { display: flex; }
  .mobile-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 199; }
  .main-content { padding: 1.25rem; }
}
</style>
