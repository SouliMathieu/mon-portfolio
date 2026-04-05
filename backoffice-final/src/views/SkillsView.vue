<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Compétences</h1>
        <p class="page-subtitle">{{ skills.length }} compétence(s) · {{ categories.length }} catégorie(s)</p>
      </div>
      <button class="btn btn-primary" @click="openModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nouvelle compétence
      </button>
    </div>

    <div v-if="loading" class="empty-state" style="height:240px"><span class="spinner"></span></div>

    <div v-else class="skills-by-cat">
      <div v-for="cat in categories" :key="cat" class="card cat-block">
        <div class="card-header">
          <span class="card-title">{{ cat }}</span>
          <span class="badge badge-gray mono">{{ byCategory(cat).length }}</span>
        </div>
        <div class="skill-list">
          <div v-for="skill in byCategory(cat)" :key="skill.id" class="skill-item">
            <div class="skill-item-top">
              <span class="skill-item-name">{{ skill.name }}</span>
              <div style="display:flex;gap:6px;align-items:center">
                <span class="skill-item-level mono">{{ skill.level }}%</span>
                <button class="btn btn-ghost btn-sm" @click="openModal(skill)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteSkill(skill.id)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="skill-track">
              <div class="skill-fill" :style="`width:${skill.level}%`"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal">
            <div class="modal-header">
              <h2>{{ editing ? 'Modifier' : 'Nouvelle' }} compétence</h2>
              <button class="modal-close" @click="closeModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body" style="display:flex;flex-direction:column;gap:1.25rem">
              <div class="form-group">
                <label class="form-label">Nom *</label>
                <input v-model="form.name" type="text" class="form-input" placeholder="Vue.js" />
              </div>
              <div class="form-group">
                <label class="form-label">Catégorie</label>
                <input v-model="form.category" type="text" class="form-input" list="cat-list" placeholder="Frontend" />
                <datalist id="cat-list">
                  <option v-for="c in categories" :key="c" :value="c"/>
                </datalist>
              </div>
              <div class="form-group">
                <label class="form-label">Niveau — {{ form.level }}%</label>
                <input v-model.number="form.level" type="range" min="0" max="100" step="5" />
                <div style="display:flex;justify-content:space-between;margin-top:4px">
                  <span class="mono" style="font-size:0.62rem;color:var(--text-3)">Débutant</span>
                  <span class="mono" style="font-size:0.62rem;color:var(--text-3)">Expert</span>
                </div>
                <div class="skill-track" style="margin-top:8px">
                  <div class="skill-fill" :style="`width:${form.level}%`"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Icône / Symbole</label>
                <input v-model="form.icon" type="text" class="form-input" maxlength="4" placeholder="⬡" />
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
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { supabase } from '@/lib/supabase'

const toast = inject('toast')
const loading = ref(true)
const saving  = ref(false)
const skills  = ref([])
const modalOpen = ref(false)
const editing   = ref(null)

const form = reactive({ name:'', category:'Frontend', icon:'◆', level:70, sort_order:0 })

const categories = computed(() => [...new Set(skills.value.map(s => s.category))])
const byCategory = (cat) => skills.value.filter(s => s.category === cat).sort((a,b) => b.level - a.level)

const openModal = (s = null) => {
  Object.assign(form, { name:'', category:'Frontend', icon:'◆', level:70, sort_order:0 })
  if (s) { editing.value = s.id; Object.keys(form).forEach(k => { if (k in s) form[k] = s[k] }) }
  else editing.value = null
  modalOpen.value = true
}
const closeModal = () => { modalOpen.value = false }

onMounted(load)

async function load() {
  loading.value = true
  const { data } = await supabase.from('skills').select('*').order('sort_order')
  skills.value = data || []
  loading.value = false
}

const save = async () => {
  if (!form.name.trim()) return
  saving.value = true
  let error
  if (editing.value) {
    ({ error } = await supabase.from('skills').update({ ...form }).eq('id', editing.value))
  } else {
    ({ error } = await supabase.from('skills').insert({ ...form }))
  }
  saving.value = false
  if (error) { toast('Erreur', 'error'); return }
  toast(editing.value ? 'Compétence mise à jour' : 'Compétence créée')
  closeModal()
  await load()
}

const deleteSkill = async (id) => {
  if (!confirm('Supprimer cette compétence ?')) return
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) { toast('Erreur', 'error'); return }
  toast('Compétence supprimée')
  await load()
}
</script>

<style scoped>
.skills-by-cat { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
.skill-list { display: flex; flex-direction: column; gap: 14px; }
.skill-item {}
.skill-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.skill-item-name { font-size: 0.88rem; color: var(--text-2); }
.skill-item-level { font-size: 0.65rem; color: var(--gold); opacity: 0.8; }
.skill-track { height: 2px; background: var(--bg-3); border-radius: 2px; overflow: hidden; }
.skill-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-l)); border-radius: 2px; transition: width 0.5s var(--ease); }
/* Modal shared */
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:500;display:flex;align-items:center;justify-content:center;padding:1rem; }
.modal { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);width:100%;max-width:480px;display:flex;flex-direction:column;overflow:hidden; }
.modal::before { content:'';display:block;height:2px;background:linear-gradient(90deg,var(--gold),transparent);flex-shrink:0; }
.modal-header { display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border); }
.modal-header h2 { font-size:1rem;font-weight:700; }
.modal-close { background:none;border:none;color:var(--text-2);cursor:pointer;display:flex; }
.modal-body { padding:1.5rem;overflow-y:auto; }
.modal-footer { padding:1.25rem 1.5rem;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px; }
</style>
