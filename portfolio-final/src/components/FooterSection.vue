<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-logo">SOULI <span>MATHIEU</span></div>
        <div class="footer-links">
          <a v-for="item in navItems" :key="item.href" :href="item.href" class="footer-link mono">
            {{ item.label }}
          </a>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="mono footer-copy">© {{ year }} SOULI MATHIEU — Tous droits réservés</span>
        <span class="mono footer-built">Construit avec Vue.js 3 + Supabase + Leaflet ⬡</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
const navItems = [
  { href: '#about',      label: 'À propos' },
  { href: '#skills',     label: 'Compétences' },
  { href: '#projects',   label: 'Projets' },
  { href: '#experience', label: 'Parcours' },
  { href: '#contact',    label: 'Contact' },
]
</script>

<style scoped>
.footer { border-top: 1px solid var(--border); background: var(--bg-0); padding: 2.5rem 0 1.5rem; }
.footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 1.5rem; }
.footer-logo { font-family: var(--font-tech); font-size: 1.5rem; font-weight: 700; color: var(--text); }
.footer-logo span { color: var(--cyan); }
.footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.footer-link { font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); transition: color .2s; }
.footer-link:hover { color: var(--cyan); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--border); padding-top: 1.25rem; }
.footer-copy, .footer-built { font-size: .6rem; letter-spacing: .08em; color: var(--text-3); }
</style>
