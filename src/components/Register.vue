<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')

const error = ref('')
const success = ref('')

async function register() {
  error.value = ''
  success.value = ''

  try {
    await auth.register({
      username: username.value,
      email: email.value,
      password: password.value,
    })

    success.value = 'Registration successful!'

    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">

      <h2>Create Account</h2>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <button @click="register">
        Register
      </button>

      <p
        v-if="error"
        class="error"
      >
        {{ error }}
      </p>

      <p
        v-if="success"
        class="success"
      >
        {{ success }}
      </p>

      <p class="link">
        Already have an account?

        <router-link to="/login">
          Login
        </router-link>
      </p>

    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 350px;
  background: #181c24;
  border: 1px solid #2b313d;
  border-radius: 12px;
  padding: 2rem;
}

h2 {
  color: white;
  margin-bottom: 20px;
}

input {
  width: 100%;
  margin-bottom: 14px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #384152;
  background: #222834;
  color: white;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background: #f97316;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.error {
  color: #ef4444;
  margin-top: 14px;
}

.success {
  color: #22c55e;
  margin-top: 14px;
}

.link {
  margin-top: 20px;
  color: #d1d5db;
}

.link a {
  color: #f97316;
}
</style>
