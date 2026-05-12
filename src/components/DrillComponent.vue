<template>
  <div>
    <h2>Footwork Sessions</h2>
    <div v-if="session">
      Work: {{ session.workTime }}s |
      Rest: {{ session.restTime }}s |
      Rounds: {{ session.round }}
    </div>
    <button @click="start">Start</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const session = ref(null)

onMounted(() => {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  fetch(`${baseUrl}/session`)
    .then(response => response.json())
    .then(data => { session.value = data })
    .catch(error => console.log('error', error))
})

function start() {
  alert("Start training!")
}
</script>
