import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// default pinia store from the vue scaffolding — not actually used anywhere yet
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
