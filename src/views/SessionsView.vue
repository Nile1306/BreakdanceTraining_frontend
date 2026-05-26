<script setup>
import { ref, onMounted } from 'vue'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

const sessions = ref([])
const activeSession = ref(null)

// 3 second lead-in before the workout actually starts
const countingDown = ref(false)
const countdown = ref(3)

// one timer for everything — always clear before reusing
// had a bug once where two intervals ran at the same time and it went haywire
const timer = ref(null)

const curIdx = ref(0)      // which interval block we're currently on
const timeLeft = ref(0)    // seconds left in this block
const curType = ref('')    // 'WORK' or 'REST'
const isRunning = ref(false)

async function loadSessions() {
  try {
    const res = await fetch(`${baseUrl}/sessions`)
    sessions.value = await res.json()
  } catch(e) {
    // probably means the backend isn't running
    console.error('couldnt fetch sessions:', e)
  }
}

async function removeSession(id) {
  // TODO: add a confirm dialog before deleting, too easy to fat-finger
  await fetch(`${baseUrl}/sessions/${id}`, { method: 'DELETE' })
  loadSessions()
}

// kicks off the 3-second countdown then starts the actual workout
function kickoff(sesh) {
  activeSession.value = sesh
  countingDown.value = true
  countdown.value = 3
  curIdx.value = 0
  isRunning.value = false
  startCountdown()
}

function startCountdown() {
  if (timer.value) clearInterval(timer.value)

  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      countingDown.value = false
      isRunning.value = true
      nextBlock()
    }
  }, 1000)
}

// moves through each work/rest block until the session is done
// e.g. 2min footwork -> 1min rest -> 3min toprock -> 1min rest...
function nextBlock() {
  const sesh = activeSession.value
  if (!sesh || curIdx.value >= sesh.intervals.length) {
    isRunning.value = false
    // TODO: log the completed session somewhere, would be useful for tracking progress
    return
  }

  const block = sesh.intervals[curIdx.value]
  curType.value = block.type
  timeLeft.value = block.durationMinutes * 60  // need seconds, not minutes

  timer.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer.value)
      curIdx.value++
      nextBlock()
    }
  }, 1000)
}

function stopTraining() {
  if (timer.value) clearInterval(timer.value)
  isRunning.value = false
  countingDown.value = false
  activeSession.value = null
}

onMounted(loadSessions)
</script>

<template>
  <div>
    <h2>Sessions</h2>

    <div v-if="sessions.length === 0">No sessions yet</div>

    <div v-for="sesh in sessions" :key="sesh.id" class="session-card">
      <div>
        <strong>{{ sesh.name || 'Session #' + sesh.id }}</strong>
        <ul>
          <li v-for="(block, idx) in sesh.intervals || []" :key="idx">
            {{ block.type === 'WORK' ? '💪 Work' : '😴 Rest' }}: {{ block.durationMinutes }} min
          </li>
        </ul>
        <button @click="removeSession(sesh.id)">Delete</button>
        <button @click="kickoff(sesh)">Session auswählen & starten</button>
      </div>
    </div>

    <!-- active workout display -->
    <div v-if="activeSession">
      <h3>Aktive Session: {{ activeSession.name || 'Session #' + activeSession.id }}</h3>

      <div v-if="countingDown">
        <p>Starte in {{ countdown }}...</p>
      </div>

      <div v-else-if="isRunning">
        <p>
          Block {{ curIdx + 1 }} / {{ activeSession.intervals.length }}<br>
          <span v-if="curType === 'WORK'">💪 Work</span>
          <span v-else>😴 Rest</span>
          <br>
          <!-- mm:ss format, padStart so it doesn't jump around -->
          Noch {{ Math.floor(timeLeft / 60) }}:{{ (timeLeft % 60).toString().padStart(2, '0') }} min
        </p>
      </div>

      <div v-else>
        <p>Session beendet! 🔥</p>
      </div>

      <button @click="stopTraining">Stop</button>
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
