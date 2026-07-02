import { defineStore } from 'pinia'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  username: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    email: localStorage.getItem('email') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(payload: LoginPayload) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Invalid email or password')
      }

      const data = await response.json()

      this.token = data.token
      this.email = data.email

      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.email)
    },

    async register(payload: RegisterPayload) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.status === 409) {
        throw new Error('Email already exists')
      }

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      return await response.json()
    },

    logout() {
      this.token = ''
      this.email = ''

      localStorage.removeItem('token')
      localStorage.removeItem('email')
    },
  },
})
