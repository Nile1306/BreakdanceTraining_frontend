import { describe, test, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'

import Statistics from '../Statistic.vue'

describe('Statistics.vue', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })
  test('shows no data message', async () => {
    fetch.mockResolvedValue({
      json: async () => []
    })
    const wrapper = mount(Statistics)

    await flushPromises()

    expect(wrapper.text()).toContain('No data available')
  })
  test('renders statistics from backend', async () => {
    fetch.mockResolvedValue({
      json: async () => [
        { date: '2025-06-01' },
        { date: '2025-06-01' },
        { date: '2025-06-02' }
      ]
    })
    const wrapper = mount(Statistics)
    await flushPromises()
    expect(wrapper.text()).toContain('2025-06-01')
    expect(wrapper.text()).toContain('2 sessions')
    expect(wrapper.text()).toContain('2025-06-02')
    expect(wrapper.text()).toContain('1 sessions')
  })

})
