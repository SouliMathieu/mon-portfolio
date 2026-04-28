<template>
  <div class="app">
    <NavBar />
    <main>
      <HeroSection       :profile="profile" :stats="stats" />
      <div class="divider"></div>
      <AboutSection      :profile="profile" />
      <div class="divider"></div>
      <SkillsSection     :skills="skills" />
      <div class="divider"></div>
      <ProjectsSection   :projects="projects" />
      <div class="divider"></div>
      <ExperienceSection :experience="experience" />
      <div class="divider"></div>
      <ContactSection    :profile="profile" />
    </main>
    <FooterSection />
    <Transition name="fade">
      <button v-if="showTop" class="back-top" @click="scrollToTop" aria-label="Retour en haut">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar            from '@/components/NavBar.vue'
import HeroSection       from '@/components/HeroSection.vue'
import AboutSection      from '@/components/AboutSection.vue'
import SkillsSection     from '@/components/SkillsSection.vue'
import ProjectsSection   from '@/components/ProjectsSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import ContactSection    from '@/components/ContactSection.vue'
import FooterSection     from '@/components/FooterSection.vue'
import { useReveal }        from '@/composables/useReveal.js'
import { usePortfolioData } from '@/composables/usePortfolioData.js'

const { profile, skills, projects, experience, stats, fetchAll } = usePortfolioData()
const { initReveal } = useReveal()

onMounted(async () => {
  await fetchAll()
  // Attendre la mise à jour du DOM
  setTimeout(() => {
    initReveal()
  }, 200)
})

const showTop = ref(false)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const onScroll    = () => { showTop.value = window.scrollY > 600 }
onMounted(()   => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style>
.app { min-height: 100vh; }
.back-top {
  position: fixed; bottom: 2rem; right: 2rem;
  width: 42px; height: 42px;
  background: var(--surface); border: 1px solid var(--border-2);
  color: var(--cyan); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 500; transition: all .3s var(--ease);
  clip-path: polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
}
.back-top:hover { background: var(--cyan); color: var(--bg-0); transform: translateY(-4px); box-shadow: 0 8px 24px var(--cyan-glow); }
.fade-enter-active,.fade-leave-active{transition:opacity .3s,transform .3s}
.fade-enter-from,.fade-leave-to{opacity:0;transform:translateY(8px)}
</style>
