import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Todo from '../Todo.vue'

describe('Todo.vue', () => {

  test('renders title', () => {
    const wrapper = mount(Todo)

    expect(wrapper.text()).toContain('Todo List')
  })

  test('adds a task', async () => {
    const wrapper = mount(Todo)

    const input = wrapper.find('input')

    await input.setValue('Practice Windmill')

    const addButton = wrapper.find('button')

    await addButton.trigger('click')

    expect(wrapper.text()).toContain('Practice Windmill')
  })

})
