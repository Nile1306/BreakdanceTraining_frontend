import { describe, test, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Login from '../Login.vue'

describe('Login.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  test('renders login form', () => {
    const wrapper = mount(Login)

    expect(wrapper.text()).toContain('Welcome back')
    expect(wrapper.text()).toContain('Login')

    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })
    test('shows validation error when email is empty', async () => {
      const wrapper = mount(Login)

      await wrapper.find('#password').setValue('123456')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('Email is required')
    })
  })
