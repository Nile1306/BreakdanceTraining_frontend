<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, watch } from 'vue'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying.vue'

const auth = useAuthStore()
const router = useRouter()

// backend alle 10 min anpingen damit render nicht einschläft
let pingInterval: ReturnType<typeof setInterval> | null = null

function startPing() {
  pingInterval = setInterval(() => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/sessions`).catch(() => {})
  }, 10 * 60 * 1000)
}

function stopPing() {
  if (pingInterval) clearInterval(pingInterval)
}

watch(() => auth.isLoggedIn, (loggedIn) => {
  if (loggedIn) startPing()
  else stopPing()
}, { immediate: true })

onUnmounted(stopPing)

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <!-- top bar: aktueller song -->
    <SpotifyNowPlaying v-if="auth.isLoggedIn" />

    <div class="app-inner">
      <h1>Breakdance Training</h1>

      <div v-if="auth.isLoggedIn" class="nav">
        <router-link to="/">Create Session</router-link>
        <router-link to="/sessions">Sessions</router-link>
        <router-link to="/todo">Todo</router-link>
        <router-link to="/stats">Statistics</router-link>
        <button @click="logout">Logout</button>
      </div>

      <div class="main-layout">
        <div class="content">
          <router-view />
        </div>

        <div v-if="auth.isLoggedIn" class="spotify-sidebar">
          <SpotifyPlayer />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-inner {
  padding: 20px;
  flex: 1;
}

h1 {
  font-size: 42px;
  margin-bottom: 20px;
  color: #ffffff;
  text-align: center;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.nav a {
  text-decoration: none;
  color: #d1d5db;
  background: #181c24;
  border: 1px solid #2b313d;
  padding: 10px 18px;
  border-radius: 8px;
  transition: 0.2s;
}

.nav a:hover {
  background: #222834;
}

.nav a.router-link-exact-active {
  background: #f97316;
  color: white;
  border-color: #f97316;
  font-weight: 600;
}

.nav button {
  background: #f97316;
  color: white;
  border: 1px solid #f97316;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.nav button:hover {
  background: #ea580c;
  border-color: #ea580c;
}

.main-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.content {
  flex: 1;
  min-width: 0;
}

.spotify-sidebar {
  width: 300px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
}
</style>
