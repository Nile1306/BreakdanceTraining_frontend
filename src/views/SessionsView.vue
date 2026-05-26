<script setup>
import { ref, onMounted } from 'vue'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
const sessions = ref([])
const selectedSession = ref(null)
const showCountdown = ref(false)
const countdown = ref(3)
const timer = ref(null)
const currentIntervalIdx = ref(0)
const intervalTime = ref(0)
const intervalType = ref('')
const running = ref(false)

async function fetchSessions() {
  const res = await fetch(`${baseUrl}/sessions`)
  sessions.value = await res.json()
}

async function deleteSession(id) {
  await fetch(`${baseUrl}/sessions/${id}`, { method: 'DELETE' })
  fetchSessions()
}

function startSession(session) {
  selectedSession.value = session
  showCountdown.value = true
  countdown.value = 3
  currentIntervalIdx.value = 0
  running.value = false
  nextCountdown()
}

function nextCountdown() {
  timer.value && clearInterval(timer.value)
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer.value)
      showCountdown.value = false
      running.value = true
      startIntervals()
    }
  }, 1000)
}

function startIntervals() {
  if (!selectedSession.value || currentIntervalIdx.value >= selectedSession.value.intervals.length) {
    running.value = false
    return
  }
  const interval = selectedSession.value.intervals[currentIntervalIdx.value]
  intervalType.value = interval.type
  intervalTime.value = interval.durationMinutes * 60
  timer.value = setInterval(() => {
    intervalTime.value--
    if (intervalTime.value <= 0) {
      clearInterval(timer.value)
      currentIntervalIdx.value++
      startIntervals()
    }
  }, 1000)
}

function stopSession() {
  timer.value && clearInterval(timer.value)
  running.value = false
  showCountdown.value = false
  selectedSession.value = null
}

onMounted(fetchSessions)
</script>

<template>
  <div>
    <h2>Sessions</h2>
    <div v-if="sessions.length === 0">No sessions available</div>
    <div v-for="session in sessions" :key="session.id" class="session-card">
      <div>
        <strong>{{ session.name || 'Session #' + session.id }}</strong>
        <ul>
          <li v-for="(interval, idx) in session.intervals || []" :key="idx">
            {{ interval.type === 'WORK' ? '💪 Work' : '😴 Rest' }}: {{ interval.durationMinutes }} min
          </li>
        </ul>
        <button @click="deleteSession(session.id)">Delete</button>
        <button @click="startSession(session)">Session auswählen & starten</button>
      </div>
    </div>

    <div v-if="selectedSession">
      <h3>Aktive Session: {{ selectedSession.name || 'Session #' + selectedSession.id }}</h3>
      <div v-if="showCountdown">
        <p>Starte in {{ countdown }}...</p>
      </div>
      <div v-else-if="running">
        <p>
          Intervall {{ currentIntervalIdx + 1 }} / {{ selectedSession.intervals.length }}<br>
          <span v-if="intervalType === 'WORK'">💪 Work</span>
          <span v-else>😴 Rest</span>
          <br>
          Noch {{ Math.floor(intervalTime / 60) }}:{{ (intervalTime % 60).toString().padStart(2, '0') }} min
        </p>
      </div>
      <div v-else>
        <p>Session beendet!</p>
      </div>
      <button @click="stopSession">Stop</button>
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
