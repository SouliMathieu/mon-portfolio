// src/composables/usePortfolioData.js
import { ref, reactive } from 'vue'
import { supabase } from '@/lib/supabase'
import {
  profile as staticProfile, skills as staticSkills,
  projects as staticProjects, experience as staticExperience, stats as staticStats
} from '@/data/portfolio.js'

export function usePortfolioData() {
  const loading = ref(true)
  const error   = ref(null)
  const profile    = reactive({ ...staticProfile })
  const skills     = ref([...staticSkills])
  const projects   = ref([...staticProjects])
  const experience = ref([...staticExperience])
  const stats      = ref([...staticStats])

  const fetchAll = async () => {
    loading.value = true
    try {
      const [profileRes, skillsRes, projectsRes, expRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('skills').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('experience').select('*').order('sort_order'),
      ])

      if (profileRes.data) {
        console.log('Données profil reçues:', profileRes.data)
        const d = profileRes.data
        Object.assign(profile, {
          firstName: d.first_name || profile.firstName,
          lastName:  d.last_name  || profile.lastName,
          name:      `${d.first_name} ${d.last_name}`,
          title:     d.title || profile.title,
          subtitle:  d.subtitle || profile.subtitle,
          tagline:   d.tagline  || profile.tagline,
          bio:       d.bio      || profile.bio,
          location:  d.location || profile.location,
          email:     d.email    || profile.email,
          phone:     d.phone    || profile.phone,
          availability: d.availability || profile.availability,
          photoUrl:  d.photo_url || null,
          photo_url: d.photo_url || null,
          cv_url:    d.cv_url || null,
          socials: [
            ...(d.github_url   ? [{ name:'GitHub',   url:d.github_url,   icon:'github' }]   : []),
            ...(d.linkedin_url ? [{ name:'LinkedIn', url:d.linkedin_url, icon:'linkedin' }] : []),
          ]
        })
        console.log('Profil final:', profile)
      }

      if (skillsRes.data?.length > 0) {
        const grouped = [], seen = {}
        skillsRes.data.forEach((s, index) => {
          if (!seen[s.category]) { 
            seen[s.category] = { category:s.category, icon:s.icon||'◆', items:[] }; 
            grouped.push(seen[s.category]) 
          }
          seen[s.category].items.push({ 
            name:s.name, 
            level:s.level,
            uniqueKey: `${s.category}-${s.name}-${index}` // Clé unique
          })
        })
        skills.value = grouped
      }

      if (projectsRes.data?.length > 0) {
        projects.value = projectsRes.data.map(p => ({
          id: p.id, title: p.title, subtitle: p.subtitle||'',
          description: p.description||'', technologies: p.technologies||[],
          github: p.github_url||null, demo: p.demo_url||null,
          image_url: p.image_url||null,
          color: p.color||'#0a1628', accentColor: p.accent_color||'#00d4ff',
          emoji: p.emoji||'◆', award: p.award||null, year: p.year||'', featured: p.featured||false,
        }))
      }

      if (expRes.data?.length > 0) {
        experience.value = expRes.data.map(e => ({
          type:e.type, period:e.period, title:e.title, org:e.org,
          location:e.location||'', description:e.description||'',
          tags:e.tags||[], highlight:e.highlight||false,
        }))
      }

      stats.value = [
        { value:`${projectsRes.data?.length||0}+`, label:'Projets réalisés' },
        { value:`${skillsRes.data?.length||0}`,    label:'Technologies maîtrisées' },
        { value:'1',  label:'Hackathon international' },
        { value:'2+', label:'Certifications' },
      ]
    } catch(e) {
      console.warn('Supabase indisponible, données statiques:', e.message)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { profile, skills, projects, experience, stats, loading, error, fetchAll }
}
