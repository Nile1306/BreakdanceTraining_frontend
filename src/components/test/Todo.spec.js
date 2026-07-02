import { describe, test, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Todo from '../Todo.vue'

describe('Todo.vue', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders title', () => {
    const wrapper = mount(Todo)

    expect(wrapper.text()).toContain('Weekly Todo List')
  })

  test('adds a task', async () => {
    const wrapper = mount(Todo)

    await wrapper.find('.input-task').setValue('Practice Windmill')
    await wrapper.find('.btn-primary').trigger('click')

    expect(wrapper.text()).toContain('Practice Windmill')
  })

  test('does not add an empty task', async () => {
    const wrapper = mount(Todo)

    await wrapper.find('.input-task').setValue('   ')
    await wrapper.find('.btn-primary').trigger('click')

    expect(wrapper.findAll('.task-card')).toHaveLength(0)
  })

  test('deletes a task', async () => {
    const wrapper = mount(Todo)

    await wrapper.find('.input-task').setValue('Practice Freeze')
    await wrapper.find('.btn-primary').trigger('click')

    expect(wrapper.text()).toContain('Practice Freeze')

    await wrapper.find('.btn-danger').trigger('click')

    expect(wrapper.text()).not.toContain('Practice Freeze')
  })

  test('saves completed task to activity history', async () => {
    const wrapper = mount(Todo)

    await wrapper.find('.input-task').setValue('Practice Toprock')
    await wrapper.find('.btn-primary').trigger('click')
    await wrapper.find('input[type="checkbox"]').setValue(true)

    const history = JSON.parse(localStorage.getItem('activityHistory') || '[]')

    expect(history).toHaveLength(1)
    expect(history[0].type).toBe('TODO')
    expect(history[0].name).toBe('Practice Toprock')
  })
})
