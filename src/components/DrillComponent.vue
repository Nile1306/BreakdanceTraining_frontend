<template>
  <div>
    <h2>Footwork Sessions</h2>
    <div v-for="session in sessions" :key="session.round">
      Work: {{ session.workTime }}s |
      Rest: {{ session.restTime }}s |
      Rounds: {{ session.round }}
    </div>
    <button @click="start">Start</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const sessions = ref([
  { workTime: 40, restTime: 20, round: 3 }
])
function start() {
  alert("Start training!")
}
</script>
