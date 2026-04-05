<template>
  <RouterView />
  <!-- Global Toasts -->
  <div class="toast-wrap">
    <TransitionGroup name="fade">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
        <span>{{ t.type === 'success' ? '✓' : '✕' }}</span>
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { provide, reactive } from 'vue'
import { RouterView } from 'vue-router'

const toasts = reactive([])
const addToast = (message, type = 'success', duration = 3500) => {
  const id = Date.now()
  toasts.push({ id, message, type })
  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id)
    if (idx > -1) toasts.splice(idx, 1)
  }, duration)
}
provide('toast', addToast)
</script>
