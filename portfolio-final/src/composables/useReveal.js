// composables/useReveal.js
// Intersection Observer pour les animations au scroll

import { onMounted, onUnmounted } from 'vue'

export function useReveal() {
  let observer = null

  const initReveal = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el)
    })
  }

  onMounted(() => {
    // Petit délai pour que le DOM soit prêt
    setTimeout(initReveal, 100)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { initReveal }
}
