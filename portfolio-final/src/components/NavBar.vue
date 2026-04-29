<template>
  <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="nav-inner">
      <!-- Logo -->
      <a href="#hero" class="nav-logo" @click="closeMenu">
        <div class="nav-logo-mark">
          <svg viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="rgba(0,212,255,0.3)" stroke-width="1" stroke-dasharray="4 4"/>
          </svg>
        <div class="nav-logo-inner">
          <img v-if="profile?.photo_url" :src="profile.photo_url" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;" />
          <template v-else>SM</template>
        </div>
        </div>
        <div class="nav-logo-text">
          <span class="nav-logo-name">SOULI MATHIEU</span>
          <span class="nav-logo-sub">Dev Web &amp; Géomaticien</span>
        </div>
      </a>

      <!-- Desktop links -->
      <ul class="nav-links">
        <li v-for="item in navItems" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="nav-link"
            :class="{ active: activeSection === item.id }"
            @click="closeMenu"
          >
            <span class="num">{{ item.num }}</span>
            {{ item.label }}
          </a>
        </li>
      </ul>

      <a href="#contact" class="btn btn-primary nav-cta" @click="closeMenu">Contact</a>

      <button class="burger" @click="toggleMenu" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <a v-for="item in navItems" :key="item.id" :href="`#${item.id}`" @click="closeMenu">
        {{ item.label }}
      </a>
      <a href="#contact" class="mobile-cta" @click="closeMenu">Me contacter</a>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  profile: { type: Object, default: () => ({}) }
})

const navItems = [
  { id: 'about',      label: 'À propos',    num: '01' },
  { id: 'skills',     label: 'Compétences', num: '02' },
  { id: 'projects',   label: 'Projets',     num: '03' },
  { id: 'experience', label: 'Parcours',    num: '04' },
  { id: 'contact',    label: 'Contact',     num: '05' },
]

const isScrolled    = ref(false)
const menuOpen      = ref(false)
const activeSection = ref('hero')

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu  = () => { menuOpen.value = false }

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  const sections = ['hero', ...navItems.map(i => i.id)]
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i])
    if (el && window.scrollY >= el.offsetTop - 130) {
      activeSection.value = sections[i]
      break
    }
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: var(--nav-h);
  transition: background .4s, border-color .4s, backdrop-filter .4s;
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  background: rgba(2,11,20,.94);
  border-bottom-color: var(--border);
  backdrop-filter: blur(20px);
}

.nav-inner {
  max-width: var(--max-w); margin: 0 auto; padding: 0 2rem;
  height: 100%; display: flex; align-items: center; gap: 2rem;
}

/* Logo */
.nav-logo { display: flex; align-items: center; gap: 12px; margin-right: auto; }
.nav-logo-mark { position: relative; width: 36px; height: 36px; flex-shrink: 0; }
.nav-logo-mark svg { position: absolute; inset: 0; animation: rotate-slow 8s linear infinite; }
.nav-logo-inner {
  position: absolute; inset: 6px;
  background: var(--cyan-dim); border: 1px solid var(--border-2);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-tech); font-size: .75rem; font-weight: 700; color: var(--cyan);
}
.nav-logo-text { display: flex; flex-direction: column; }
.nav-logo-name { font-family: var(--font-tech); font-size: 1rem; font-weight: 700; color: var(--text); letter-spacing: .05em; }
.nav-logo-sub  { font-family: var(--font-mono); font-size: .55rem; letter-spacing: .18em; color: var(--text-3); text-transform: uppercase; }

/* Links */
.nav-links { display: flex; list-style: none; gap: 2px; }
.nav-link {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 14px; font-family: var(--font-mono); font-size: .62rem;
  letter-spacing: .1em; text-transform: uppercase; color: var(--text-2);
  transition: color .2s; position: relative;
}
.nav-link .num { font-size: .55rem; color: var(--cyan); opacity: .5; }
.nav-link::after {
  content: ''; position: absolute; bottom: 4px; left: 14px; right: 14px;
  height: 1px; background: var(--cyan);
  transform: scaleX(0); transform-origin: left; transition: transform .3s var(--ease);
}
.nav-link:hover, .nav-link.active { color: var(--text); }
.nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
.nav-cta { font-size: .65rem !important; padding: 9px 20px !important; }

/* Burger */
.burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.burger span { display: block; height: 1px; width: 22px; background: var(--text); transition: all .3s; }
.menu-open .burger span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.menu-open .burger span:nth-child(2) { opacity: 0; }
.menu-open .burger span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  display: none; position: absolute; top: var(--nav-h); left: 0; right: 0;
  background: rgba(2,11,20,.98); border-bottom: 1px solid var(--border);
  padding: 2rem; backdrop-filter: blur(20px);
}
.mobile-menu.open { display: block; }
.mobile-menu a {
  display: block; padding: .9rem 0; border-bottom: 1px solid var(--border);
  font-family: var(--font-tech); font-size: 1.3rem; font-weight: 500;
  color: var(--text); transition: color .2s, padding-left .2s;
}
.mobile-menu a:hover { color: var(--cyan); padding-left: 12px; }
.mobile-cta { color: var(--cyan) !important; }

@media (max-width: 900px) {
  .nav-links, .nav-cta { display: none !important; }
  .burger { display: flex; }
  .mobile-menu { display: block; }
}
</style>
