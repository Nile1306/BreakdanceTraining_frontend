<template>
  <div class="sessions-page">
    <h2>Footwork Sessions</h2>

    <!-- create new or edit existing session -->
    <div class="form-card">
      <h3>{{ editTarget ? 'Edit Session' : 'New Session' }}</h3>
      <input v-model="draftSesh.name" type="text" placeholder="Session name" class="input-name" />

      <div class="intervals-list">
        <div v-for="(round, index) in draftSesh.intervals" :key="index" class="interval-row">
          <select v-model="round.type">
            <option value="WORK">Work</option>
            <option value="REST">Rest</option>
          </select>
          <input v-model.number="round.durationMinutes" type="number" min="1" placeholder="min" />
          <span>min</span>
          <button class="btn-remove" @click="removeAt(index)">✕</button>
        </div>
      </div>

      <button class="btn-add" @click="appendRound">+ Add interval</button>

      <!-- inline validation error -->
      <p v-if="formErr" class="form-err">{{ formErr }}</p>

      <div class="form-actions">
        <button class="btn-primary" @click="submitSesh">{{ editTarget ? 'Update' : 'Create' }}</button>
        <button v-if="editTarget" class="btn-secondary" @click="clearDraft">Cancel</button>
      </div>
    </div>

    <!-- Zuletzt erstellte Session — just a quick preview at the bottom -->
    <div v-if="drills.length > 0" class="session-card">
      <div class="session-header">
        <strong>Zuletzt erstellt: {{ drills[drills.length-1].name }}</strong>
      </div>
      <details>
        <summary>{{ drills[drills.length-1].intervals.length }} intervals</summary>
        <ul class="interval-detail">
          <li v-for="(round, i) in drills[drills.length-1].intervals" :key="i"
              :class="round.type === 'WORK' ? 'work' : 'rest'">
            {{ round.type === 'WORK' ? '💪 Work' : '😴 Rest' }}: {{ round.durationMinutes }} min
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

const drills = ref([])
const editTarget = ref(null)   // null = new session, id = editing existing
const draftSesh = ref({ name: '', intervals: [] })
const formErr = ref('')        // inline validation msg, auto-clears

onMounted(pullDrills)

function pullDrills() {
  fetch(`${baseUrl}/sessions`)
    .then(r => r.json())
    .then(data => { drills.value = data })
    .catch(err => console.error('pullDrills failed:', err))
}

// auto-alternates WORK/REST based on whatever the last block was
// most footwork sessions go work->rest->work->rest anyway
function appendRound() {
  const lastType = draftSesh.value.intervals.at(-1)?.type
  const nextType = lastType === 'WORK' ? 'REST' : 'WORK'
  draftSesh.value.intervals.push({ type: nextType, durationMinutes: 1 })
}

function removeAt(i) {
  draftSesh.value.intervals.splice(i, 1)
}

function submitSesh() {
  if (!draftSesh.value.name.trim()) {
    showErr('give the session a name first')
    return
  }
  if (draftSesh.value.intervals.length === 0) {
    showErr('add at least one interval')
    return
  }
  // a session with only rest blocks makes no sense
  const hasWork = draftSesh.value.intervals.some(r => r.type === 'WORK')
  if (!hasWork) {
    showErr("can't have a session with only rest blocks lol")
    return
  }

  const method = editTarget.value ? 'PUT' : 'POST'
  const url = editTarget.value
    ? `${baseUrl}/sessions/${editTarget.value}`
    : `${baseUrl}/sessions`

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draftSesh.value)
  })
    .then(r => r.json())
    .then(() => {
      clearDraft()
      pullDrills()
    })
    .catch(err => console.error('submitSesh error:', err))
}

function showErr(msg) {
  formErr.value = msg
  setTimeout(() => formErr.value = '', 3000)
}

// not in the template yet - keeping for when the full drill list gets edit/delete buttons
// function nukeDrill(id) {
//   fetch(`${baseUrl}/sessions/${id}`, { method: 'DELETE' })
//     .then(() => pullDrills())
// }

// function loadIntoForm(sesh) {
//   editTarget.value = sesh.id
//   draftSesh.value = { name: sesh.name, intervals: sesh.intervals.map(r => ({ ...r })) }
// }

function clearDraft() {
  editTarget.value = null
  draftSesh.value = { name: '', intervals: [] }
  formErr.value = ''
}
</script>

<style scoped>
.sessions-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.form-card, .session-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.input-name {
  width: 100%;
  padding: 0.4rem;
  margin-bottom: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  box-sizing: border-box;
}

.intervals-list { margin-bottom: 0.5rem; }

.interval-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.interval-row select, .interval-row input {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  padding: 0.3rem;
}

.interval-row input { width: 60px; }

.form-actions {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.form-err {
  color: #f87171;
  font-size: 0.85rem;
  margin: 0.4rem 0 0;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

details summary { cursor: pointer; color: #aaa; font-size: 0.9rem; }

.interval-detail { list-style: none; padding: 0.5rem 0 0; margin: 0; }
.interval-detail li { padding: 0.2rem 0; font-size: 0.9rem; }
.interval-detail li.work { color: #f97316; }
.interval-detail li.rest { color: #60a5fa; }

.btn-primary { background: #f97316; color: white; border: none; padding: 0.4rem 0.9rem; border-radius: 4px; cursor: pointer; }
.btn-secondary { background: #3f3f3f; color: white; border: none; padding: 0.4rem 0.9rem; border-radius: 4px; cursor: pointer; }
.btn-danger { background: #dc2626; color: white; border: none; padding: 0.4rem 0.9rem; border-radius: 4px; cursor: pointer; margin-left: 0.4rem; }
.btn-add { background: none; border: 1px dashed #555; color: #aaa; padding: 0.3rem 0.7rem; border-radius: 4px; cursor: pointer; width: 100%; }
.btn-remove { background: none; border: none; color: #888; cursor: pointer; font-size: 0.9rem; }
</style>
