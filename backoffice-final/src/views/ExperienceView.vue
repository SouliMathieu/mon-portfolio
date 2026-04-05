<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Parcours</h1>
        <p class="page-subtitle">{{ items.length }} entrée(s) dans la timeline</p>
      </div>
      <button class="btn btn-primary" @click="openModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Ajouter
      </button>
    </div>

    <div v-if="loading" class="empty-state" style="height:240px"><span class="spinner"></span></div>

    <div v-else-if="items.length === 0" class="empty-state card">
      <span class="empty-state-icon">🏢</span>
      <span class="empty-state-text">Aucune expérience enregistrée</span>
    </div>

    <div v-else class="timeline-list">
      <div v-for="item in items" :key="item.id" class="card exp-card">
        <div class="exp-top">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span :class="`badge badge-${typeBadge(item.type)}`">{{ typeLabel(item.type) }}</span>
            <span v-if="item.highlight" class="badge badge-gold">⭐ Mis en avant</span>
            <span class="mono" style="font-size:0.65rem;color:var(--text-3)">{{ item.period }}</span>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" @click="openModal(item)">Modifier</button>
            <button class="btn btn-danger btn-sm" @click="deleteItem(item.id)">Suppr.</button>
          </div>
        </div>
        <h3 class="exp-title">{{ item.title }}</h3>
        <div class="exp-org">{{ item.org }} · {{ item.location }}</div>
        <p class="exp-desc">{{ item.description }}</p>
        <div class="exp-tags">
          <span v-for="tag in (item.tags || [])" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal">
            <div class="modal-header">
              <h2>{{ editing ? 'Modifier' : 'Ajouter' }} une entrée</h2>
              <button class="modal-close" @click="closeModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div style="display:flex;flex-direction:column;gap:1.25rem">
                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Type</label>
                    <select v-model="form.type" class="form-select">
                      <option value="education">Formation</option>
                      <option value="work">Expérience</option>
                      <option value="achievement">Réalisation</option>
                      <option value="certification">Certification</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Période *</label>
                    <input v-model="form.period" type="text" class="form-input" placeholder="2023 — Présent" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Titre *</label>
                    <input v-model="form.title" type="text" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Organisation *</label>
                    <input v-model="form.org" type="text" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Lieu</label>
                    <input v-model="form.location" type="text" class="form-input" placeholder="Tanger, Maroc" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Ordre d'affichage</label>
                    <input v-model.number="form.sort_order" type="number" class="form-input" />
                  </div>
                  <div class="form-group" style="grid-column:1/-1">
                    <label class="form-label">Description</label>
                    <textarea v-model="form.description" class="form-textarea" rows="3"></textarea>
                  </div>
                  <div class="form-group" style="grid-column:1/-1">
                    <label class="form-label">Tags (séparés par virgule)</label>
                    <input v-model="tagsInput" type="text" class="form-input" placeholder="SIG, Cartographie, Web" />
                  </div>
                  <div class="form-group" style="grid-column:1/-1">
                    <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer">
                      <input v-model="form.highlight" type="checkbox" style="width:auto;accent-color:var(--gold)" />
                      Mettre en avant (highlight)
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="closeModal">Annuler</button>
              <button class="btn btn-primary" @click="save" :disabled="saving">
                <span v-if="saving" class="spinner spinner-sm"></span>
                <span v-else>{{ editing ? 'Mettre à jour' : 'Créer' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue'
import { supabase } from '@/lib/supabase'

const toast   = inject('toast')
const loading = ref(true)
const saving  = ref(false)
const items   = ref([])
const modalOpen = ref(false)
const editing   = ref(null)
const tagsInput = ref('')

const form = reactive({
  type:'education', period:'', title:'', org:'', location:'',
  description:'', highlight:false, sort_order:0
})

const typeLabel = (t) => ({ education:'Formation', work:'Expérience', achievement:'Réalisation', certification:'Certification' })[t] || t
const typeBadge = (t) => ({ education:'blue', work:'gray', achievement:'gold', certification:'green' })[t] || 'gray'

const openModal = (item = null) => {
  Object.assign(form, { type:'education', period:'', title:'', org:'', location:'', description:'', highlight:false, sort_order:0 })
  tagsInput.value = ''
  if (item) {
    editing.value = item.id
    Object.keys(form).forEach(k => { if (k in item) form[k] = item[k] })
    tagsInput.value = (item.tags || []).join(', ')
  } else editing.value = null
  modalOpen.value = true
}
const closeModal = () => { modalOpen.value = false }

onMounted(load)
async function load() {
  loading.value = true
  const { data } = await supabase.from('experience').select('*').order('sort_order')
  items.value = data || []
  loading.value = false
}

const save = async () => {
  if (!form.title || !form.period || !form.org) return
  saving.value = true
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  const payload = { ...form, tags, updated_at: new Date().toISOString() }
  let error
  if (editing.value) {
    ({ error } = await supabase.from('experience').update(payload).eq('id', editing.value))
  } else {
    ({ error } = await supabase.from('experience').insert(payload))
  }
  saving.value = false
  if (error) { toast('Erreur', 'error'); return }
  toast(editing.value ? 'Entrée mise à jour' : 'Entrée ajoutée')
  closeModal()
  await load()
}

const deleteItem = async (id) => {
  if (!confirm('Supprimer cette entrée du parcours ?')) return
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) { toast('Erreur', 'error'); return }
  toast('Entrée supprimée')
  await load()
}
</script>

<style scoped>
.timeline-list { display: flex; flex-direction: column; gap: 1rem; }
.exp-card {}
.exp-top { display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:8px; }
.exp-title { font-family:var(--display);font-size:1.15rem;font-weight:400;color:var(--text);margin-bottom:4px; }
.exp-org { font-size:0.8rem;color:var(--text-2);margin-bottom:0.75rem; }
.exp-desc { font-size:0.85rem;line-height:1.65;margin-bottom:0.75rem; }
.exp-tags { display:flex;flex-wrap:wrap;gap:6px; }
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:500;display:flex;align-items:center;justify-content:center;padding:1rem; }
.modal { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);width:100%;max-width:600px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden; }
.modal::before { content:'';display:block;height:2px;background:linear-gradient(90deg,var(--gold),transparent);flex-shrink:0; }
.modal-header { display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border); }
.modal-header h2 { font-size:1rem;font-weight:700; }
.modal-close { background:none;border:none;color:var(--text-2);cursor:pointer;display:flex; }
.modal-body { padding:1.5rem;overflow-y:auto;flex:1; }
.modal-footer { padding:1.25rem 1.5rem;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px; }
</style>
