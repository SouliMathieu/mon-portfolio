<template>
  <div class="settings-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Paramètres admin</h1>
        <p class="page-subtitle">Modifier vos informations de connexion au backoffice</p>
      </div>
      <button class="btn btn-primary" @click="save" :disabled="saving">
        <span v-if="saving" class="spinner spinner-sm"></span>
        <span v-else>Mettre à jour</span>
      </button>
    </div>

    <div class="card" style="max-width: 600px">
      <div class="card-header"><span class="card-title">Identifiants de connexion</span></div>
      
      <div v-if="successMsg" class="form-success-msg" style="margin-bottom: 1rem; color: var(--green); padding: 10px; border: 1px solid var(--green); border-radius: 5px; background: rgba(74,219,122,0.1)">
        {{ successMsg }}
      </div>
      <div v-if="errorMsg" class="form-error-msg" style="margin-bottom: 1rem">
        {{ errorMsg }}
      </div>

      <div class="grid-1" style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="form-group">
          <label class="form-label">Nouvel email (laisser vide pour ne pas changer)</label>
          <input v-model="form.email" type="email" class="form-input" placeholder="nouvel@email.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
          <input v-model="form.password" type="password" class="form-input" placeholder="••••••••" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { supabase } from '@/lib/supabase'

const toast = inject('toast', (msg) => console.log(msg))
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = reactive({
  email: '',
  password: ''
})

const save = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  
  const updates = {}
  if (form.email) updates.email = form.email
  if (form.password) updates.password = form.password

  if (Object.keys(updates).length === 0) {
    errorMsg.value = 'Veuillez remplir au moins un champ pour mettre à jour.'
    return
  }

  saving.value = true
  const { data, error } = await supabase.auth.updateUser(updates)
  saving.value = false

  if (error) {
    errorMsg.value = error.message
  } else {
    successMsg.value = 'Informations mises à jour avec succès. Si vous avez changé d\'email, vous devrez confirmer le changement via le lien envoyé à votre ancienne et nouvelle adresse (selon la configuration Supabase).'
    toast('Informations mises à jour ✓')
    form.email = ''
    form.password = ''
  }
}
</script>

<style scoped>
.settings-view { display: flex; flex-direction: column; gap: 1.25rem; }
</style>
