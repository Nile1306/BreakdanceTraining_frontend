<template>
  <div class="sessions-page">
    <h2>Sessions</h2>

    <div v-if="activeSession" class="timer-card">
      <h3>{{ activeSession.name }}</h3>

      <div class="phase">
        Current Phase:
        {{ currentInterval?.type }}
      </div>

      <div class="timer">
        {{ remainingSeconds }}
      </div>

      <div class="button-group">
        <button
          v-if="isRunning"
          class="btn-secondary"
          @click="pauseSession"
        >
          Pause
        </button>

        <button
          v-else
          class="btn-primary"
          @click="continueSession"
        >
          Continue
        </button>

        <button
          class="btn-secondary"
          @click="restartSession"
        >
          Restart
        </button>

        <button
          class="btn-danger"
          @click="endSession"
        >
          End Session
        </button>
      </div>
    </div>

    <div
      class="session-card"
      v-for="session in sessions"
      :key="session.id"
    >
      <div class="session-header">
        <div>
          <div class="session-title">
            {{ session.name }}
          </div>

          <div class="session-info">
            {{ session.intervals.length }} intervals
          </div>
        </div>

        <div class="button-group">
          <button
            class="btn-primary"
            @click="startSession(session)"
          >
            Start
          </button>

          <button
            class="btn-danger"
            @click="deleteSession(session.id)"
          >
            Delete
          </button>
        </div>
      </div>

      <details>
        <summary>Show Intervals</summary>

        <ul class="interval-list">
          <li
            v-for="(interval, i) in session.intervals"
            :key="i"
          >
            {{ interval.type }}
            -
            {{ interval.durationMinutes }} sec
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

const sessions = ref([])

const activeSession = ref(null)

const currentIntervalIndex = ref(0)

const remainingSeconds = ref(0)

const isRunning = ref(false)

let timer = null

const currentInterval = computed(() => {
  if (!activeSession.value) return null

  return activeSession.value.intervals[
    currentIntervalIndex.value
  ]
})

onMounted(loadSessions)

function loadSessions() {
  fetch(`${baseUrl}/sessions`)
    .then(r => r.json())
    .then(data => {
      sessions.value = data
    })
    .catch(console.error)
}

function startSession(session) {

  clearInterval(timer)

  activeSession.value = session

  currentIntervalIndex.value = 0

  remainingSeconds.value =
    session.intervals[0].durationMinutes

  isRunning.value = true

  runTimer()
}

function runTimer() {

  timer = setInterval(() => {

    if (!isRunning.value) return

    remainingSeconds.value--

    if (remainingSeconds.value <= 0) {

      currentIntervalIndex.value++

      const nextInterval =
        activeSession.value.intervals[
          currentIntervalIndex.value
        ]

      if (!nextInterval) {

        finishSession()

        return
      }

      remainingSeconds.value =
        nextInterval.durationMinutes
    }

  }, 1000)
}

function pauseSession() {
  isRunning.value = false
}

function continueSession() {
  isRunning.value = true
}

function restartSession() {

  if (
    !confirm(
      'Are you sure you want to restart this session?'
    )
  ) {
    return
  }

  startSession(activeSession.value)
}

function endSession() {

  if (
    !confirm(
      'Are you sure you want to end this session?'
    )
  ) {
    return
  }

  clearInterval(timer)

  activeSession.value = null

  currentIntervalIndex.value = 0

  remainingSeconds.value = 0

  isRunning.value = false
}

function finishSession() {

  clearInterval(timer)

  alert(
    'Session completed successfully!'
  )

  activeSession.value = null

  currentIntervalIndex.value = 0

  remainingSeconds.value = 0

  isRunning.value = false
}

function deleteSession(id) {

  fetch(
    `${baseUrl}/sessions/${id}`,
    {
      method: 'DELETE'
    }
  )
  .then(() => loadSessions())
}
</script>

<style scoped>
.sessions-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.session-card,
.timer-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.session-info {
  color: #aaa;
}

.timer {
  font-size: 3rem;
  text-align: center;
  margin: 1rem 0;
}

.phase {
  text-align: center;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: #f97316;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #3f3f3f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.interval-list {
  padding-left: 1rem;
}
</style>

