import { describe, test, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Statistic from '../Statistic.vue'

describe('Statistic.vue', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('shows empty message when no activity exists', async () => {
    const wrapper = mount(Statistic)
    await nextTick()

    expect(wrapper.text()).toContain('Training Statistics')
    expect(wrapper.text()).toContain('Total Activities')
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('No activity recorded yet')
  })

  test('renders activities from localStorage', async () => {
    window.localStorage.setItem(
      'activityHistory',
      JSON.stringify([
        { date: '02.07.2026', type: 'TODO', name: 'Practice Windmill' },
        { date: '02.07.2026', type: 'SESSION', name: 'Power Move Training', intervals: 3 },
      ]),
    )

    const wrapper = mount(Statistic)
    await nextTick()

    expect(wrapper.text()).toContain('Total Activities')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('02.07.2026')
    expect(wrapper.text()).toContain('Practice Windmill')
    expect(wrapper.text()).toContain('Power Move Training')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('intervals')
  })
})
