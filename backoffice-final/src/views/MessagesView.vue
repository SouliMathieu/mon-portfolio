<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Messages</h1>
        <p class="page-subtitle">
          {{ unreadCount }} non lu(s) · {{ messages.length }} total
        </p>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" @click="filter = 'all'" :class="{ active: filter==='all' }">Tous</button>
        <button class="btn btn-ghost btn-sm" @click="filter = 'unread'" :class="{ active: filter==='unread' }">Non lus</button>
        <button class="btn btn-ghost btn-sm" @click="filter = 'archived'" :class="{ active: filter==='archived' }">Archivés</button>
      </div>
    </div>

    <div class="inbox-layout">
      <!-- Message list -->
      <div class="msg-list-panel">
        <div v-if="loading" class="empty-state" style="height:200px"><span class="spinner"></span></div>
        <div v-else-if="filteredMessages.length === 0" class="empty-state">
          <span class="empty-state-icon">✉️</span>
          <span class="empty-state-text">Aucun message ici</span>
        </div>
        <div v-else class="msg-items">
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            class="msg-item"
            :class="{ unread: !msg.read, selected: selected?.id === msg.id }"
            @click="selectMessage(msg)"
          >
            <div class="msg-item-avatar">{{ msg.name[0].toUpperCase() }}</div>
            <div class="msg-item-body">
              <div class="msg-item-top">
                <span class="msg-item-name">{{ msg.name }}</span>
                <span class="msg-item-date mono">{{ formatDate(msg.created_at) }}</span>
              </div>
              <div class="msg-item-subject">{{ msg.subject || '(sans sujet)' }}</div>
              <div class="msg-item-preview">{{ msg.message.slice(0, 80) }}...</div>
            </div>
            <div v-if="!msg.read" class="unread-dot"></div>
          </div>
        </div>
      </div>

      <!-- Message detail -->
      <div class="msg-detail-panel">
        <div v-if="!selected" class="empty-state" style="height:100%">
          <span class="empty-state-icon">←</span>
          <span class="empty-state-text">Sélectionnez un message</span>
        </div>
        <div v-else class="msg-detail">
          <div class="detail-header">
            <div>
              <h2 class="detail-subject">{{ selected.subject || '(sans sujet)' }}</h2>
              <div class="detail-meta mono">
                De : <strong>{{ selected.name }}</strong>
                &lt;{{ selected.email }}&gt; ·
                {{ formatDateFull(selected.created_at) }}
              </div>
            </div>
            <div class="detail-actions">
              <a :href="`mailto:${selected.email}?subject=Re: ${selected.subject}`" class="btn btn-primary btn-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
                Répondre
              </a>
              <button
                class="btn btn-ghost btn-sm"
                @click="toggleArchive(selected)"
              >{{ selected.archived ? 'Désarchiver' : 'Archiver' }}</button>
              <button class="btn btn-danger btn-sm" @click="deleteMsg(selected.id)">Suppr.</button>
            </div>
          </div>
          <div class="divider"></div>
          <div class="detail-body">{{ selected.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { supabase } from '@/lib/supabase'

const toast   = inject('toast')
const loading = ref(true)
const messages = ref([])
const selected = ref(null)
const filter   = ref('all')

const unreadCount = computed(() => messages.value.filter(m => !m.read && !m.archived).length)
const filteredMessages = computed(() => {
  if (filter.value === 'unread')   return messages.value.filter(m => !m.read && !m.archived)
  if (filter.value === 'archived') return messages.value.filter(m => m.archived)
  return messages.value.filter(m => !m.archived)
})

onMounted(load)
async function load() {
  loading.value = true
  const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  messages.value = data || []
  loading.value = false
}

const selectMessage = async (msg) => {
  selected.value = msg
  if (!msg.read) {
    await supabase.from('messages').update({ read: true }).eq('id', msg.id)
    const idx = messages.value.findIndex(m => m.id === msg.id)
    if (idx > -1) messages.value[idx].read = true
  }
}

const toggleArchive = async (msg) => {
  const val = !msg.archived
  await supabase.from('messages').update({ archived: val }).eq('id', msg.id)
  const idx = messages.value.findIndex(m => m.id === msg.id)
  if (idx > -1) messages.value[idx].archived = val
  toast(val ? 'Message archivé' : 'Message désarchivé')
}

const deleteMsg = async (id) => {
  if (!confirm('Supprimer ce message définitivement ?')) return
  await supabase.from('messages').delete().eq('id', id)
  messages.value = messages.value.filter(m => m.id !== id)
  if (selected.value?.id === id) selected.value = null
  toast('Message supprimé')
}

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })
const formatDateFull = (d) => new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })
</script>

<style scoped>
.inbox-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.25rem;
  height: calc(100vh - 200px);
  min-height: 400px;
}
.msg-list-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.msg-items { display: flex; flex-direction: column; }
.msg-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.msg-item:hover { background: rgba(255,255,255,0.03); }
.msg-item.selected { background: var(--gold-dim); border-left: 2px solid var(--gold); }
.msg-item.unread .msg-item-name { color: var(--text); font-weight: 700; }
.msg-item-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--border-gold);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; color: var(--gold);
  flex-shrink: 0;
}
.msg-item-body { flex: 1; min-width: 0; }
.msg-item-top { display: flex; justify-content: space-between; margin-bottom: 2px; }
.msg-item-name { font-size: 0.85rem; color: var(--text-2); }
.msg-item-date { font-size: 0.62rem; color: var(--text-3); }
.msg-item-subject { font-size: 0.8rem; color: var(--text-2); margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.msg-item-preview { font-size: 0.75rem; color: var(--text-3); line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.unread-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--gold);
  position: absolute;
  top: 50%; right: 14px;
  transform: translateY(-50%);
}

.msg-detail-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow-y: auto;
}
.msg-detail { padding: 1.75rem; height: 100%; }
.detail-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.detail-subject { font-family: var(--display); font-size: 1.3rem; font-weight: 300; color: var(--text); margin-bottom: 6px; }
.detail-meta { font-size: 0.7rem; letter-spacing: 0.05em; color: var(--text-2); }
.detail-meta strong { color: var(--text); }
.detail-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.detail-body { font-size: 0.92rem; line-height: 1.8; color: var(--text-2); white-space: pre-wrap; }

.btn.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }

@media (max-width: 900px) {
  .inbox-layout { grid-template-columns: 1fr; height: auto; }
  .msg-list-panel { max-height: 400px; }
}
</style>
