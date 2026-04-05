<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Projets</h1>
        <p class="page-subtitle">{{ projects.length }} projet(s) · Images hébergées sur Cloudinary</p>
      </div>
      <button class="btn btn-primary" @click="openModal()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nouveau projet
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="empty-state" style="height:280px"><span class="spinner"></span></div>

    <!-- Empty -->
    <div v-else-if="projects.length === 0" class="empty-state card">
      <span class="empty-state-icon">🚀</span>
      <span class="empty-state-text">Aucun projet</span>
      <button class="btn btn-primary" @click="openModal()">Ajouter un projet</button>
    </div>

    <!-- Table -->
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Projet</th>
            <th>Image</th>
            <th>Technologies</th>
            <th>Liens</th>
            <th>Année</th>
            <th>Vedette</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in projects" :key="p.id">
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:1.2rem">{{ p.emoji || '◆' }}</span>
                <div>
                  <div style="font-weight:600;color:var(--text)">{{ p.title }}</div>
                  <div class="mono" style="font-size:.65rem;color:var(--text-3)">{{ p.subtitle }}</div>
                </div>
              </div>
            </td>
            <td>
              <img
                v-if="p.image_url"
                :src="p.image_url"
                alt="preview"
                style="width:60px;height:40px;object-fit:cover;border-radius:4px;border:1px solid var(--border)"
              />
              <span v-else class="badge badge-gray">Aucune</span>
            </td>
            <td>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                <span v-for="t in (p.technologies||[]).slice(0,2)" :key="t" class="tag">{{ t }}</span>
                <span v-if="(p.technologies||[]).length>2" class="tag">+{{ p.technologies.length-2 }}</span>
              </div>
            </td>
            <td>
              <div style="display:flex;gap:6px">
                <a v-if="p.github_url" :href="p.github_url" target="_blank" class="btn btn-ghost btn-sm" title="GitHub">GH</a>
                <a v-if="p.demo_url"   :href="p.demo_url"   target="_blank" class="btn btn-ghost btn-sm" title="Demo">Demo</a>
                <span v-if="!p.github_url && !p.demo_url" class="mono" style="font-size:.65rem;color:var(--text-3)">—</span>
              </div>
            </td>
            <td class="mono" style="font-size:.75rem;color:var(--text-2)">{{ p.year }}</td>
            <td>
              <span :class="p.featured ? 'badge badge-cyan' : 'badge badge-gray'">
                {{ p.featured ? '★ Oui' : 'Non' }}
              </span>
            </td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-ghost btn-sm" @click="openModal(p)">Modifier</button>
                <button class="btn btn-danger btn-sm" @click="confirmDelete(p)">Suppr.</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal create/edit -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal" style="max-width:740px">
            <div class="modal-header">
              <h2>{{ editing ? 'Modifier' : 'Nouveau' }} projet</h2>
              <button class="modal-close" @click="closeModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="grid-2" style="gap:1.5rem">

                <!-- Image Cloudinary -->
                <div class="form-group" style="grid-column:1/-1">
                  <label class="form-label">Image du projet (Cloudinary)</label>
                  <div class="img-upload-wrap">
                    <!-- Preview image actuelle -->
                    <div v-if="form.image_url" class="img-current">
                      <img :src="form.image_url" class="img-upload-preview" :alt="form.title"/>
                      <div style="display:flex;gap:8px;margin-top:8px">
                        <span class="mono" style="font-size:.65rem;color:var(--text-3);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ form.image_url }}</span>
                        <button class="btn btn-danger btn-sm" @click="form.image_url=''; form.image_public_id=''">✕ Supprimer</button>
                      </div>
                    </div>

                    <!-- Upload zone -->
                    <div v-if="!form.image_url">
                      <div
                        class="img-upload-area"
                        @click="$refs.imgFile.click()"
                        @dragover.prevent
                        @drop.prevent="onImageDrop"
                      >
                        <div v-if="!uploading">
                          <div style="font-size:2rem;margin-bottom:.5rem">🖼️</div>
                          <div class="mono" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2)">
                            Cliquer ou glisser une image
                          </div>
                          <div class="mono" style="font-size:.62rem;color:var(--text-3);margin-top:4px">
                            PNG, JPG, WEBP · Max 10MB · Hébergé sur Cloudinary
                          </div>
                        </div>
                        <div v-else style="display:flex;flex-direction:column;align-items:center;gap:8px">
                          <span class="spinner"></span>
                          <span class="mono" style="font-size:.7rem;color:var(--text-2)">Upload en cours...</span>
                        </div>
                        <input ref="imgFile" type="file" accept="image/*" style="display:none" @change="onImageSelect"/>
                      </div>
                      <div style="margin-top:.75rem">
                        <div class="form-label" style="margin-bottom:6px">Ou coller une URL Cloudinary directement</div>
                        <input v-model="form.image_url" type="url" class="form-input" placeholder="https://res.cloudinary.com/..."/>
                      </div>
                      <div v-if="uploadError" class="form-error-msg" style="margin-top:6px">{{ uploadError }}</div>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Titre *</label>
                  <input v-model="form.title" type="text" class="form-input" placeholder="Water Credit AI"/>
                </div>
                <div class="form-group">
                  <label class="form-label">Sous-titre</label>
                  <input v-model="form.subtitle" type="text" class="form-input" placeholder="Hackathon UNESCO 2026"/>
                </div>
                <div class="form-group" style="grid-column:1/-1">
                  <label class="form-label">Description</label>
                  <textarea v-model="form.description" class="form-textarea" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Technologies (virgule)</label>
                  <input v-model="techInput" type="text" class="form-input" placeholder="Vue.js, PHP, MySQL"/>
                </div>
                <div class="form-group">
                  <label class="form-label">Emoji / Icône</label>
                  <input v-model="form.emoji" type="text" class="form-input" placeholder="💧" maxlength="4"/>
                </div>

                <!-- Liens -->
                <div class="form-group">
                  <label class="form-label">🔗 URL GitHub</label>
                  <input v-model="form.github_url" type="url" class="form-input" placeholder="https://github.com/..."/>
                </div>
                <div class="form-group">
                  <label class="form-label">🚀 URL Démo / Live</label>
                  <input v-model="form.demo_url" type="url" class="form-input" placeholder="https://mon-projet.vercel.app"/>
                </div>

                <div class="form-group">
                  <label class="form-label">Année</label>
                  <input v-model="form.year" type="text" class="form-input" placeholder="2026"/>
                </div>
                <div class="form-group">
                  <label class="form-label">Récompense / Award</label>
                  <input v-model="form.award" type="text" class="form-input" placeholder="🏆 UNESCO 2026"/>
                </div>
                <div class="form-group">
                  <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer">
                    <input v-model="form.featured" type="checkbox" style="width:auto;accent-color:var(--cyan)"/>
                    En vedette (featured)
                  </label>
                </div>
                <div class="form-group">
                  <label class="form-label">Ordre d'affichage</label>
                  <input v-model.number="form.sort_order" type="number" class="form-input" min="0"/>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="closeModal">Annuler</button>
              <button class="btn btn-primary" @click="saveProject" :disabled="saving || uploading">
                <span v-if="saving" class="spinner spinner-sm"></span>
                <span v-else>{{ editing ? 'Mettre à jour' : 'Créer' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Confirm delete -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget=null">
          <div class="modal modal-sm">
            <div class="modal-header"><h2>Confirmer la suppression</h2></div>
            <div class="modal-body">
              <p>Supprimer <strong style="color:var(--text)">{{ deleteTarget.title }}</strong> ? Cette action est irréversible.</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="deleteTarget=null">Annuler</button>
              <button class="btn btn-danger" @click="deleteProject" :disabled="saving">
                <span v-if="saving" class="spinner spinner-sm"></span>
                <span v-else>Supprimer</span>
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
import { useCloudinaryUpload } from '@/lib/cloudinary'

const toast   = inject('toast')
const loading = ref(true)
const saving  = ref(false)
const projects    = ref([])
const modalOpen   = ref(false)
const editing     = ref(null)
const deleteTarget = ref(null)
const techInput   = ref('')

const { uploading, uploadError, upload } = useCloudinaryUpload()

const form = reactive({
  title:'', subtitle:'', description:'', year:'',
  github_url:'', demo_url:'', emoji:'◆', award:'',
  image_url:'', image_public_id:'',
  color:'#0a1628', accent_color:'#00d4ff',
  featured:false, sort_order:0
})

const resetForm = () => {
  Object.assign(form, {
    title:'', subtitle:'', description:'', year:'',
    github_url:'', demo_url:'', emoji:'◆', award:'',
    image_url:'', image_public_id:'',
    color:'#0a1628', accent_color:'#00d4ff',
    featured:false, sort_order:0
  })
  techInput.value = ''
}

const openModal = (p = null) => {
  resetForm()
  if (p) {
    editing.value = p.id
    Object.keys(form).forEach(k => { if (k in p) form[k] = p[k] ?? form[k] })
    techInput.value = (p.technologies || []).join(', ')
  } else {
    editing.value = null
  }
  modalOpen.value = true
}
const closeModal = () => { modalOpen.value = false }

onMounted(load)
async function load() {
  loading.value = true
  const { data } = await supabase.from('projects').select('*').order('sort_order')
  projects.value = data || []
  loading.value = false
}

// Image upload handlers
const onImageSelect = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  await handleUpload(file)
}
const onImageDrop = async (e) => {
  const file = e.dataTransfer.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  await handleUpload(file)
}
const handleUpload = async (file) => {
  try {
    const result = await upload(file, 'portfolio/projects')
    form.image_url = result.url
    form.image_public_id = result.publicId
    toast('Image uploadée sur Cloudinary ✓')
  } catch (e) {
    toast('Erreur upload image: ' + e.message, 'error')
  }
}

const saveProject = async () => {
  if (!form.title.trim()) { toast('Le titre est requis', 'error'); return }
  saving.value = true
  const technologies = techInput.value.split(',').map(t => t.trim()).filter(Boolean)
  const payload = { ...form, technologies, updated_at: new Date().toISOString() }
  let error
  if (editing.value) {
    ;({ error } = await supabase.from('projects').update(payload).eq('id', editing.value))
  } else {
    ;({ error } = await supabase.from('projects').insert(payload))
  }
  saving.value = false
  if (error) { toast('Erreur: ' + error.message, 'error'); return }
  toast(editing.value ? 'Projet mis à jour ✓' : 'Projet créé ✓')
  closeModal()
  await load()
}

const confirmDelete = (p) => { deleteTarget.value = p }
const deleteProject = async () => {
  saving.value = true
  const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.value.id)
  saving.value = false
  if (error) { toast('Erreur suppression', 'error'); return }
  toast('Projet supprimé')
  deleteTarget.value = null
  await load()
}
</script>

<style scoped>
.img-upload-wrap { display: flex; flex-direction: column; gap: .75rem; }
.img-current { display: flex; flex-direction: column; gap: 0; }
</style>
