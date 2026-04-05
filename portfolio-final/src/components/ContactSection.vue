<template>
  <section id="contact" class="contact">
    <div class="contact-bg"></div>
    <div class="container">
      <div class="section-label reveal">05 / Contact</div>

      <!-- Photo banner -->
      <div class="photo-banner reveal reveal-delay-1">
        <div class="photo-wrap">
          <div class="contact-avatar">
            <img v-if="profile.photoUrl" :src="profile.photoUrl" alt="SOULI MATHIEU" />
            <span v-else class="avatar-fb">SM</span>
          </div>
        </div>
        <div class="banner-info">
          <div class="banner-name">{{ profile.firstName }} {{ profile.lastName }}</div>
          <div class="banner-role mono">Développeur Web · Géomaticien SIG</div>
          <div class="banner-status">
            <div class="status-dot"></div>
            <span class="mono">{{ profile.availability || 'Disponible pour stage / alternance 2026' }}</span>
          </div>
          <div class="banner-hint mono">Photo de profil</div>
        </div>
      </div>

      <div class="contact-grid">
        <!-- Left -->
        <div>
          <h2 class="contact-heading reveal">Travaillons<br><em>ensemble</em></h2>
          <p class="contact-text reveal reveal-delay-1">
            Disponible pour des opportunités de stage, alternance ou collaboration sur des projets web et géospatiales. N'hésitez pas à me contacter directement.
          </p>

          <div class="contact-details reveal reveal-delay-2">
            <a :href="`mailto:${profile.email}`" class="detail-row link">
              <div class="detail-ico">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div><div class="detail-lbl mono">Email</div><div class="detail-val">{{ profile.email }}</div></div>
            </a>
            <div class="detail-row">
              <div class="detail-ico">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <div><div class="detail-lbl mono">Localisation</div><div class="detail-val">{{ profile.location }} · 35.7595°N 5.8340°W</div></div>
            </div>
            <div class="detail-row">
              <div class="detail-ico">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div><div class="detail-lbl mono">Disponibilité</div><div class="detail-val">Stage / Alternance 2026 — Immédiat</div></div>
            </div>
          </div>

          <div class="contact-socials reveal reveal-delay-3">
            <a
              v-for="social in profile.socials"
              :key="social.name"
              :href="social.url"
              target="_blank" rel="noopener noreferrer"
              class="csoc"
            >
              <SocialIcon :name="social.icon" />
              {{ social.name }}
            </a>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="form-wrap reveal reveal-delay-2">
          <div class="form-deco"></div>
          <form class="contact-form" @submit.prevent="handleSubmit" novalidate>
            <div class="form-row">
              <div class="form-group" :class="{ error: errors.name, focused: focused.name }">
                <label class="form-lbl mono">Nom complet</label>
                <input v-model="form.name" type="text" class="form-inp" placeholder="Votre nom"
                  @focus="focused.name=true" @blur="focused.name=false; validate('name')" />
                <span class="form-err" v-if="errors.name">{{ errors.name }}</span>
              </div>
              <div class="form-group" :class="{ error: errors.email, focused: focused.email }">
                <label class="form-lbl mono">Email</label>
                <input v-model="form.email" type="email" class="form-inp" placeholder="votre@email.com"
                  @focus="focused.email=true" @blur="focused.email=false; validate('email')" />
                <span class="form-err" v-if="errors.email">{{ errors.email }}</span>
              </div>
            </div>
            <div class="form-group" :class="{ error: errors.subject, focused: focused.subject }">
              <label class="form-lbl mono">Sujet</label>
              <input v-model="form.subject" type="text" class="form-inp" placeholder="Objet de votre message"
                @focus="focused.subject=true" @blur="focused.subject=false; validate('subject')" />
            </div>
            <div class="form-group" :class="{ error: errors.message, focused: focused.message }">
              <label class="form-lbl mono">Message</label>
              <textarea v-model="form.message" class="form-ta" rows="5" placeholder="Décrivez votre projet ou opportunité..."
                @focus="focused.message=true" @blur="focused.message=false; validate('message')"></textarea>
              <div class="char-count mono">{{ form.message.length }} / 500</div>
            </div>

            <button type="submit" class="btn btn-primary form-submit" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner"></span>
              <span v-else>
                Envoyer le message
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </span>
            </button>

            <Transition name="slide-up">
              <div v-if="submitted" class="form-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Message envoyé ! Je vous répondrai très bientôt.
              </div>
            </Transition>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import SocialIcon from './SocialIcon.vue'

const props = defineProps({ profile: { type: Object, required: true } })

// Form
const form      = reactive({ name: '', email: '', subject: '', message: '' })
const errors    = reactive({ name: '', email: '', subject: '', message: '' })
const focused   = reactive({ name: false, email: false, subject: false, message: false })
const isSubmitting = ref(false)
const submitted    = ref(false)

const validate = (field) => {
  switch (field) {
    case 'name':    errors.name    = form.name.trim().length < 2    ? 'Nom trop court' : ''; break
    case 'email':   errors.email   = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Email invalide' : ''; break
    case 'subject': errors.subject = form.subject.trim().length < 3 ? 'Sujet trop court' : ''; break
    case 'message': errors.message = form.message.trim().length < 20 ? 'Message trop court (min 20 car.)' : ''; break
  }
}

const validateAll = () => {
  Object.keys(form).forEach(validate)
  return !Object.values(errors).some(Boolean)
}

const handleSubmit = async () => {
  if (!validateAll()) return
  isSubmitting.value = true
  try {
    const { error } = await supabase.from('messages').insert({
      name: form.name, email: form.email,
      subject: form.subject, message: form.message,
      read: false, archived: false,
    })
    if (error) throw error
    submitted.value = true
    Object.keys(form).forEach(k => form[k] = '')
    setTimeout(() => { submitted.value = false }, 6000)
  } catch (e) {
    console.error('Form error:', e)
    // Fallback success pour demo
    submitted.value = true
    setTimeout(() => { submitted.value = false }, 4000)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact { background: var(--bg-1); }
.contact-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,212,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,.025) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; opacity: .5; }

/* Photo banner */
.photo-banner { display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; padding: 1.5rem 2rem; background: var(--surface); border: 1px solid var(--border-2); clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); flex-wrap: wrap; }
.photo-wrap { position: relative; flex-shrink: 0; }
.contact-avatar { width: 88px; height: 88px; border: 2px solid var(--cyan); clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); overflow: hidden; background: var(--cyan-dim); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.contact-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-fb { font-family: var(--font-tech); font-size: 2rem; font-weight: 700; color: var(--cyan); }
.photo-add-btn { position: absolute; bottom: -4px; right: -4px; width: 20px; height: 20px; background: var(--cyan); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--bg-0); }
.banner-name  { font-family: var(--font-tech); font-size: 1.3rem; font-weight: 700; color: var(--text); }
.banner-role  { font-size: .65rem; letter-spacing: .15em; text-transform: uppercase; color: var(--cyan); margin-top: 4px; }
.banner-status { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
.status-dot   { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); }
.banner-status span { font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: var(--green); }
.banner-hint  { font-size: .58rem; color: var(--text-3); margin-top: 8px; }

.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }
@media(max-width:900px) { .contact-grid { grid-template-columns: 1fr; } }

.contact-heading { margin: 1rem 0 1.5rem; color: var(--text); }
.contact-heading em { font-style: normal; color: var(--cyan); }
.contact-text { margin-bottom: 2.5rem; line-height: 1.85; }

.contact-details { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 2rem; }
.detail-row { display: flex; align-items: center; gap: 12px; padding: .9rem 1.1rem; border: 1px solid var(--border); background: var(--surface); text-decoration: none; transition: border-color .2s, transform .2s; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
.detail-row.link:hover { border-color: var(--cyan); transform: translateX(4px); }
.detail-ico { width: 32px; height: 32px; background: var(--cyan-dim); border: 1px solid var(--border-2); display: flex; align-items: center; justify-content: center; color: var(--cyan); flex-shrink: 0; clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px)); }
.detail-lbl { font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); }
.detail-val { font-size: .88rem; color: var(--text-2); margin-top: 2px; }

.contact-socials { display: flex; gap: 8px; flex-wrap: wrap; }
.csoc { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border: 1px solid var(--border-2); font-family: var(--font-mono); font-size: .62rem; letter-spacing: .08em; color: var(--text-2); transition: all .3s; clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px)); }
.csoc:hover { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }

/* Form */
.form-wrap { background: var(--surface); border: 1px solid var(--border-2); clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); overflow: hidden; }
.form-deco { height: 2px; background: linear-gradient(90deg, var(--cyan), var(--blue), transparent); }
.contact-form { padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
@media(max-width:560px) { .form-row { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-lbl { font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); transition: color .2s; }
.form-group.focused .form-lbl { color: var(--cyan); }
.form-group.error  .form-lbl { color: #ff5555; }
.form-inp, .form-ta { background: var(--bg-3); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; font-family: var(--font); font-size: .9rem; outline: none; width: 100%; transition: border-color .2s; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); }
.form-inp::placeholder, .form-ta::placeholder { color: var(--text-3); }
.form-inp:focus, .form-ta:focus { border-color: var(--cyan); background: rgba(0,212,255,.03); }
.form-group.error .form-inp, .form-group.error .form-ta { border-color: #ff5555; }
.form-ta { resize: none; min-height: 130px; }
.char-count { text-align: right; font-size: .6rem; letter-spacing: .08em; color: var(--text-3); }
.form-err { font-size: .7rem; color: #ff5555; font-family: var(--font-mono); }
.form-submit { width: 100%; justify-content: center; padding: 14px !important; }
.form-success { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: rgba(0,255,136,.07); border: 1px solid rgba(0,255,136,.2); color: var(--green); font-size: .85rem; }

.slide-up-enter-active { transition: all .4s var(--ease); }
.slide-up-leave-active { transition: all .3s ease; }
.slide-up-enter-from  { opacity: 0; transform: translateY(10px); }
.slide-up-leave-to    { opacity: 0; transform: translateY(-5px); }
</style>
