import { defineStore } from 'pinia'
type LoginPayload = {
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
      if (payload.email === 'test@test.de' && payload.password === '123456') {
        this.token = 'demo-token'
        this.email = payload.email
        localStorage.setItem('token', this.token)
        localStorage.setItem('email', this.email)
        return
      }
     throw new Error("Invalid email or password")
    },
    logout() {
      this.token = ''
      this.email = ''
      localStorage.removeItem('token')
      localStorage.removeItem('email')
    },
  },
})
