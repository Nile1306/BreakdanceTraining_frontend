<script setup>
import { ref, onMounted } from 'vue'

const sessions = ref([])

async function fetchSessions() {
  const res = await fetch('http://localhost:8080/sessions')
  sessions.value = await res.json()
}

async function deleteSession(id) {
  await fetch(`http://localhost:8080/sessions/${id}`, { method: 'DELETE' })
  fetchSessions()
}

onMounted(fetchSessions)
</script>

<template>
  <div>
    <h2>Sessions</h2>
    <div v-if="sessions.length === 0">No sessions available</div>
    <div v-for="session in sessions" :key="session.id" class="session-card">
      <div>
        <strong>Session #{{ session.id }}</strong>
        <ul>
          <li v-for="(interval, idx) in session.intervals || []" :key="idx">
            {{ interval.type }}: {{ interval.duration }}s
          </li>
        </ul>
        <button @click="deleteSession(session.id)">Delete</button>
        <!-- Platzhalter für Start/Edit -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-card {
  border: 1px solid #ccc;
  margin: 8px 0;
  padding: 8px;
}
</style>
