<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

function validateForm() {
  if (!email.value.trim()) {
    errorMessage.value = 'Email is required'
    return false
  }

  if (!email.value.includes('@')) {
    errorMessage.value = 'Please enter a valid email address'
    return false
  }

  if (!password.value.trim()) {
    errorMessage.value = 'Password is required'
    return false
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return false
  }

  errorMessage.value = ''
  return true
}

async function submitLogin() {
  if (!validateForm()) return

  loading.value = true

  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/')
  } catch {
    errorMessage.value = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <h2>Welcome back</h2>
      <p class="subtitle">Log in to continue your breakdance training.</p>

      <form @submit.prevent="submitLogin">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" placeholder="test@test.de" />

        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" placeholder="123456" />

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 36px;
  border-radius: 18px;
  background: #181c24;
  border: 1px solid #2b313d;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  text-align: left;
}

h2 {
  margin: 0;
  font-size: 32px;
  color: white;
  text-align: center;
}

.subtitle {
  margin: 10px 0 28px;
  color: #9ca3af;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  color: #d1d5db;
  font-weight: 600;
}

input {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #374151;
  background: #0f1218;
  color: white;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #f97316;
}

.error {
  color: #fb7185;
  text-align: center;
  margin: 6px 0;
}

button {
  margin-top: 10px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: #f97316;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #ea580c;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
