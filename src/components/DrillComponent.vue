<template>
  <div>
    <h2>Footwork Sessions</h2>
    <div v-for="session in sessions" :key="session.id">
      Work: {{ session.workTime }}s |
      Rest: {{ session.restTime }}s |
      Rounds: {{ session.round }}
    </div>
    <button @click="start">Start</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const sessions = ref([])

onMounted(() => {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  fetch(`${baseUrl}/sessions`)
    .then(response => response.json())
    .then(data => { sessions.value = data })
    .catch(error => console.log('error', error))
})

function start() {
  alert("Start training!")
}
</script>
