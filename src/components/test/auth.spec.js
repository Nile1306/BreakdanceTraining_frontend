import { describe, test, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  test('logs in successfully', async () => {
    const auth = useAuthStore()

    await auth.login({
      email: 'test@test.de',
      password: '123456'
    })

    expect(auth.isLoggedIn).toBe(true)
    expect(auth.email).toBe('test@test.de')
  })
    test('logs out successfully', async () => {
      const auth = useAuthStore()

      await auth.login({
        email: 'test@test.de',
        password: '123456'
      })

      auth.logout()

      expect(auth.isLoggedIn).toBe(false)
      expect(localStorage.getItem('token')).toBeNull()
    })
  })
