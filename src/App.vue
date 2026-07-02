<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <h1>Breakdance Training</h1>
    <div v-if="auth.isLoggedIn" class="nav">
      <router-link to="/">Create Session</router-link>
      <router-link to="/sessions">Sessions</router-link>
      <router-link to="/todo">Todo</router-link>
      <router-link to="/stats">Statistics</router-link>

      <button @click="logout">
        Logout
      </button>
    </div>

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app {
  text-align: center;
}

h1 {
  font-size: 42px;
  margin-bottom: 20px;
  color: #ffffff;
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

.content {
  margin-top: 20px;
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
</style>
