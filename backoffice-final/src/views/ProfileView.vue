<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Profil</h1>
        <p class="page-subtitle">Informations personnelles affichées sur le portfolio</p>
      </div>
      <button class="btn btn-primary" @click="save" :disabled="saving">
        <span v-if="saving" class="spinner spinner-sm"></span>
        <span v-else>Enregistrer</span>
      </button>
    </div>

    <div v-if="loading" class="empty-state" style="height:300px"><span class="spinner"></span></div>

    <div v-else class="profile-layout">

      <!-- Photo de profil -->
      <div class="card">
        <div class="card-header"><span class="card-title">Photo de profil</span></div>
        <div class="photo-section">
          <div class="photo-preview" @click="$refs.photoFile.click()" title="Cliquer pour changer">
            <img v-if="form.photo_url" :src="form.photo_url" alt="Photo de profil"/>
            <div v-else class="photo-placeholder">
              <span class="photo-initials">{{ initials }}</span>
            </div>
            <div class="photo-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Changer</span>
            </div>
            <input ref="photoFile" type="file" accept="image/*" style="display:none" @change="uploadPhoto"/>
          </div>
          <div class="photo-info">
            <div v-if="uploading" class="mono" style="font-size:.7rem;color:var(--cyan)">
              <span class="spinner spinner-sm"></span> Upload en cours...
            </div>
            <div v-else-if="form.photo_url" class="mono" style="font-size:.65rem;color:var(--text-3);word-break:break-all">
              {{ form.photo_url }}
            </div>
            <div v-else class="mono" style="font-size:.7rem;color:var(--text-3)">
              Aucune photo — cliquer sur l'avatar pour en ajouter une
            </div>
            <p style="margin-top:.75rem;font-size:.82rem">
              L'image sera hébergée sur Cloudinary et affichée automatiquement sur le portfolio dans les sections <em style="color:var(--cyan)">À propos</em> et <em style="color:var(--cyan)">Contact</em>.
            </p>
            <div style="display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap">
              <button class="btn btn-ghost btn-sm" @click="$refs.photoFile.click()">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                Changer la photo
              </button>
              <button v-if="form.photo_url" class="btn btn-danger btn-sm" @click="form.photo_url=''">
                Supprimer
              </button>
            </div>
            <div v-if="uploadError" class="form-error-msg" style="margin-top:8px">{{ uploadError }}</div>
          </div>
        </div>
      </div>

      <!-- CV Upload -->
      <div class="card">
        <div class="card-header"><span class="card-title">Curriculum Vitae (CV)</span></div>
        <div class="photo-section">
          <div class="photo-info">
            <div v-if="uploadingCv" class="mono" style="font-size:.7rem;color:var(--cyan)">
              <span class="spinner spinner-sm"></span> Upload en cours...
            </div>
            <div v-else-if="form.cv_url" class="mono" style="font-size:.65rem;color:var(--text-3);word-break:break-all">
              {{ form.cv_url }}
            </div>
            <div v-else class="mono" style="font-size:.7rem;color:var(--text-3)">
              Aucun CV - Cliquez sur le bouton pour en ajouter un.
            </div>
            <p style="margin-top:.75rem;font-size:.82rem">
              Le fichier sera hébergé sur Cloudinary et pourra être téléchargé depuis le frontend.
            </p>
            <div style="display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap">
              <button class="btn btn-ghost btn-sm" @click="$refs.cvFile.click()">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Uploader le CV
              </button>
              <button v-if="form.cv_url" class="btn btn-danger btn-sm" @click="form.cv_url=''">
                Supprimer
              </button>
            </div>
            <input ref="cvFile" type="file" accept=".pdf,.doc,.docx" style="display:none" @change="uploadCv"/>
            <div v-if="uploadCvError" class="form-error-msg" style="margin-top:8px">{{ uploadCvError }}</div>
          </div>
        </div>
      </div>

      <!-- Informations de base -->
      <div class="card">
        <div class="card-header"><span class="card-title">Informations de base</span></div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Prénom</label>
            <input v-model="form.first_name" type="text" class="form-input" placeholder="Mathieu"/>
          </div>
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input v-model="form.last_name" type="text" class="form-input" placeholder="SOULI"/>
          </div>
          <div class="form-group">
            <label class="form-label">Titre</label>
            <input v-model="form.title" type="text" class="form-input" placeholder="Développeur Web"/>
          </div>
          <div class="form-group">
            <label class="form-label">Sous-titre</label>
            <input v-model="form.subtitle" type="text" class="form-input" placeholder="Full Stack — Vue.js · PHP"/>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label">Accroche (tagline)</label>
            <input v-model="form.tagline" type="text" class="form-input"/>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label">Biographie</label>
            <textarea v-model="form.bio" class="form-textarea" rows="4"></textarea>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="card">
        <div class="card-header"><span class="card-title">Contact & Localisation</span></div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input"/>
          </div>
          <div class="form-group">
            <label class="form-label">Téléphone</label>
            <input v-model="form.phone" type="text" class="form-input"/>
          </div>
          <div class="form-group">
            <label class="form-label">Localisation</label>
            <input v-model="form.location" type="text" class="form-input" placeholder="Tanger, Maroc"/>
          </div>
          <div class="form-group">
            <label class="form-label">Disponibilité</label>
            <input v-model="form.availability" type="text" class="form-input" placeholder="Disponible pour stage"/>
          </div>
        </div>
      </div>

      <!-- Réseaux sociaux -->
      <div class="card">
        <div class="card-header"><span class="card-title">Réseaux sociaux</span></div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">GitHub URL</label>
            <input v-model="form.github_url" type="url" class="form-input" placeholder="https://github.com/souli-mathieu"/>
          </div>
          <div class="form-group">
            <label class="form-label">LinkedIn URL</label>
            <input v-model="form.linkedin_url" type="url" class="form-input" placeholder="https://linkedin.com/in/souli-mathieu"/>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, inject } from 'vue'
import { supabase } from '@/lib/supabase'
import { useCloudinaryUpload } from '@/lib/cloudinary'

const toast   = inject('toast')
const loading = ref(true)
const saving  = ref(false)
let profileId = null

const { uploading, uploadError, upload } = useCloudinaryUpload()
const uploadingCv = ref(false)
const uploadCvError = ref(null)

const form = reactive({
  first_name:'', last_name:'', title:'', subtitle:'', tagline:'',
  bio:'', location:'', email:'', phone:'', availability:'',
  github_url:'', linkedin_url:'', photo_url:'', cv_url:''
})

const initials = computed(() => {
  const f = form.first_name?.[0] || ''
  const l = form.last_name?.[0]  || ''
  return (f + l).toUpperCase() || 'SM'
})

onMounted(async () => {
  console.log('Chargement du profil...')
  try {
    // Récupérer tous les profils triés par date de mise à jour (plus récent d'abord)
    const { data, error } = await supabase
      .from('profile')
      .select('id, first_name, last_name, title, subtitle, tagline, bio, location, email, phone, availability, github_url, linkedin_url, photo_url, cv_url, updated_at')
      .order('updated_at', { ascending: false }) // Plus récent d'abord
    
    console.log('Nombre de profils trouvés:', data?.length || 0)
    console.log('Erreur:', error)
    
    if (data && data.length > 0) {
      // Prendre le profil le plus récent
      const profileData = data[0]
      profileId = profileData.id
      Object.keys(form).forEach(k => { 
        if (k in profileData) form[k] = profileData[k] || '' 
      })
      console.log('Profile ID utilisé:', profileId)
      console.log('Formulaire mis à jour avec le profil le plus récent:', profileData)
      
      // Afficher un warning si plusieurs profils existent
      if (data.length > 1) {
        console.warn(`⚠️ Attention : ${data.length} profils trouvés! Utilisation du plus récent (${new Date(profileData.updated_at).toLocaleString()}).`)
        console.log('Conseil : Supprimez les anciens profils dans Supabase pour éviter ce problème.')
      }
    } else if (error) {
      console.error('Erreur Supabase:', error)
    }
  } catch (err) {
    console.error('Erreur générale:', err)
  }
  loading.value = false
})

const uploadPhoto = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const result = await upload(file, 'portfolio/profile')
    form.photo_url = result.url
    toast('Photo uploadée sur Cloudinary ✓')
    // Sauvegarder automatiquement dans la base de données
    await save()
  } catch (err) {
    toast('Erreur upload: ' + err.message, 'error')
  }
}

const uploadCv = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  uploadingCv.value = true
  uploadCvError.value = null
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `cv_${Date.now()}.${fileExt}`
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('portfolio')
      .upload(fileName, file, { cacheControl: '3600', upsert: true })
      
    if (error) throw error
    
    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(fileName)
      
    form.cv_url = data.publicUrl
    toast('CV uploadé sur Supabase ✓')
    // Sauvegarder automatiquement dans la base de données
    await save()
  } catch (err) {
    uploadCvError.value = 'Erreur upload CV: ' + err.message
    toast('Erreur upload CV: ' + err.message, 'error')
  } finally {
    uploadingCv.value = false
  }
}

const save = async () => {
  saving.value = true
  const payload = { ...form, updated_at: new Date().toISOString() }
  console.log('Payload à sauvegarder:', payload)
  console.log('Profile ID utilisé pour la sauvegarde:', profileId)
  
  let error
  if (profileId) {
    console.log('Mise à jour du profil existant...')
    ;({ error } = await supabase.from('profile').update(payload).eq('id', profileId))
  } else {
    console.log('Création d\'un nouveau profil...')
    const res = await supabase.from('profile').insert(payload).select().single()
    profileId = res.data?.id
    error = res.error
  }
  
  saving.value = false
  if (error) {
    console.error('Erreur Supabase:', error)
    toast('Erreur: ' + error.message, 'error')
  }
  else {
    console.log('Sauvegarde réussie du profil ID:', profileId)
    toast('Profil mis à jour ✓')
  }
}
</script>

<style scoped>
.profile-layout { display: flex; flex-direction: column; gap: 1.25rem; }

.photo-section { display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap; }

.photo-preview {
  width: 120px; height: 120px; flex-shrink: 0;
  border: 2px solid var(--border-2); cursor: pointer;
  position: relative; overflow: hidden;
  clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
  background: var(--cyan-dim);
}
.photo-preview img { width: 100%; height: 100%; object-fit: cover; }
.photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.photo-initials { font-family: var(--tech); font-size: 2rem; font-weight: 700; color: var(--cyan); }
.photo-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,.6);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px; opacity: 0; transition: opacity .2s; color: var(--text);
  font-family: var(--mono); font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
}
.photo-preview:hover .photo-overlay { opacity: 1; }
.photo-info { flex: 1; min-width: 200px; }
</style>
