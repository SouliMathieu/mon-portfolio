<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="login-grid"></div>
      <div class="login-orb"></div>
    </div>

    <div class="login-box">
      <div class="login-header">
        <div class="login-logo">SM</div>
        <h1 class="login-title">Backoffice</h1>
        <p class="login-sub mono">Portfolio Administration</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ error: !!error }"
            placeholder="admin@email.com"
            autocomplete="email"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <div class="input-wrap">
            <input
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              class="form-input"
              :class="{ error: !!error }"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
              <svg v-if="!showPwd" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <Transition name="slide">
          <div v-if="error" class="login-error">{{ error }}</div>
        </Transition>

        <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
          <span v-if="loading" class="spinner spinner-sm"></span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <div class="login-footer mono">
        Accès réservé à l'administrateur
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth    = useAuthStore()
const router  = useRouter()
const loading = ref(false)
const error   = ref('')
const showPwd = ref(false)
const form    = reactive({ email: '', password: '' })

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.email, form.password)
    router.push('/')
  } catch (e) {
    error.value = 'Email ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}
.login-bg { position: absolute; inset: 0; pointer-events: none; }
.login-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent);
}
.login-orb {
  position: absolute;
  width: 600px; height: 600px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(196,155,83,0.06) 0%, transparent 70%);
  border-radius: 50%;
}

.login-box {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
  margin: 1rem;
}
.login-box::before {
  content: '';
  display: block;
  height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--gold-l), transparent);
}

.login-header {
  padding: 2.5rem 2.5rem 2rem;
  text-align: center;
}
.login-logo {
  width: 52px; height: 52px;
  border-radius: 10px;
  background: var(--gold-dim);
  border: 1px solid var(--border-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--display);
  font-size: 1.3rem;
  color: var(--gold);
  margin: 0 auto 1rem;
}
.login-title {
  font-family: var(--display);
  font-size: 1.6rem;
  font-weight: 300;
  color: var(--text);
  margin-bottom: 4px;
}
.login-sub {
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-3);
}

.login-form {
  padding: 0 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.input-wrap { position: relative; }
.input-wrap .form-input { padding-right: 42px; }
.pwd-toggle {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-3);
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
}
.pwd-toggle:hover { color: var(--gold); }

.login-error {
  padding: 10px 14px;
  background: rgba(224,82,82,0.08);
  border: 1px solid rgba(224,82,82,0.25);
  border-radius: var(--radius);
  font-size: 0.8rem;
  color: var(--red);
}
.login-btn { width: 100%; justify-content: center; padding: 12px !important; }

.login-footer {
  padding: 1.25rem 2.5rem;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
}
</style>
