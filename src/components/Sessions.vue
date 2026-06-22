<template>
  <div class="sessions-page">
    <h2>Sessions</h2>

    <div
      v-if="activeSession"
      class="timer-card"
    >
      <h3>
        {{ activeSession.name }}
      </h3>

      <div class="phase">
        Current Phase:
        <strong>
          {{ currentInterval?.type }}
        </strong>
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
      v-for="session in sessions"
      :key="session.id"
      class="session-card"
    >
      <div class="session-header">

        <div>
          <div class="session-title">
            {{ session.name }}
          </div>

          <div class="session-info">
            {{ session.intervals.length }}
            intervals
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
        <summary>
          Show Intervals
        </summary>

        <ul class="interval-list">

          <li
            v-for="(interval, index) in session.intervals"
            :key="index"
          >
            {{ interval.type }}
            -
            {{ interval.durationMinutes }}
            sec
          </li>

        </ul>
      </details>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

const baseUrl =
  import.meta.env.VITE_BACKEND_BASE_URL

const sessions = ref([])

const activeSession = ref(null)

const currentIntervalIndex = ref(0)

const remainingSeconds = ref(0)

const isRunning = ref(false)

let timer = null

onMounted(loadSessions)

const currentInterval = computed(() => {

  if (!activeSession.value) {
    return null
  }

  return activeSession.value.intervals[
    currentIntervalIndex.value
  ]
})

async function loadSessions() {

  try {

    const response = await fetch(
      `${baseUrl}/sessions`
    )

    sessions.value =
      await response.json()

  } catch (error) {

    console.error(error)

  }
}

function startSession(session) {

  if (
    !session.intervals ||
    session.intervals.length === 0
  ) {
    alert(
      'This session has no intervals.'
    )
    return
  }

  clearInterval(timer)

  activeSession.value = session

  currentIntervalIndex.value = 0

  remainingSeconds.value =
    session.intervals[0]
      .durationMinutes

  isRunning.value = true

  runTimer()
}

function runTimer() {

  clearInterval(timer)

  timer = setInterval(() => {

    if (!isRunning.value) {
      return
    }

    remainingSeconds.value--

    if (
      remainingSeconds.value <= 0
    ) {

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

  startSession(
    activeSession.value
  )
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

async function deleteSession(id) {

  if (
    !confirm(
      'Delete this session?'
    )
  ) {
    return
  }

  try {

    await fetch(
      `${baseUrl}/sessions/${id}`,
      {
        method: 'DELETE'
      }
    )

    loadSessions()

  } catch (error) {

    console.error(error)

  }
}
</script>

<style scoped>
.sessions-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
}

.timer-card,
.session-card {
  background: #181c24;
  border: 1px solid #2b313d;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow:
    0 4px 20px rgba(0,0,0,.25);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.session-info {
  color: #d1d5db;
  margin-top: 4px;
}

.phase {
  text-align: center;
  color: #f3f4f6;
}

.timer {
  font-size: 4rem;
  text-align: center;
  font-weight: bold;
  color: #f97316;
  margin: 1rem 0;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #f97316;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-secondary {
  background: #374151;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

details {
  margin-top: 12px;
}

summary {
  color: #e5e7eb;
  cursor: pointer;
}

.interval-list {
  color: #f5f5f5;
  padding-left: 18px;
}
</style>

