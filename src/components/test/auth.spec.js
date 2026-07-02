import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'demo-token',
        email: 'test@test.de',
      }),
    })
  })

  test('logs in successfully', async () => {
    const auth = useAuthStore()

    await auth.login({
      email: 'test@test.de',
      password: '123456',
    })
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.email).toBe('test@test.de')
    expect(localStorage.getItem('token')).toBe('demo-token')
  })
  test('logs out successfully', async () => {
    const auth = useAuthStore()

    await auth.login({
      email: 'test@test.de',
      password: '123456',
    })

    auth.logout()

    expect(auth.isLoggedIn).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
  })
})
