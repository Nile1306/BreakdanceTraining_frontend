<template>
  <div class="sessions-page">
    <h2>Footwork Sessions</h2>

    <!-- Create / Edit Form -->
    <div class="form-card">
      <h3>{{ editingId ? 'Edit Session' : 'New Session' }}</h3>
      <input v-model="form.name" type="text" placeholder="Session name" class="input-name" />

      <div class="intervals-list">
        <div v-for="(interval, index) in form.intervals" :key="index" class="interval-row">
          <select v-model="interval.type">
            <option value="WORK">Work</option>
            <option value="REST">Rest</option>
          </select>
          <input v-model.number="interval.durationMinutes" type="number" min="1" placeholder="min" />
          <span>min</span>
          <button class="btn-remove" @click="removeInterval(index)">✕</button>
        </div>
      </div>

      <button class="btn-add" @click="addInterval">+ Add interval</button>

      <div class="form-actions">
        <button class="btn-primary" @click="saveSession">{{ editingId ? 'Update' : 'Create' }}</button>
        <button v-if="editingId" class="btn-secondary" @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <!-- Zuletzt erstellte Session -->
    <div v-if="sessions.length > 0" class="session-card">
      <div class="session-header">
        <strong>Zuletzt erstellt: {{ sessions[sessions.length-1].name }}</strong>
      </div>
      <details>
        <summary>{{ sessions[sessions.length-1].intervals.length }} intervals</summary>
        <ul class="interval-detail">
          <li v-for="(interval, i) in sessions[sessions.length-1].intervals" :key="i"
              :class="interval.type === 'WORK' ? 'work' : 'rest'">
            {{ interval.type === 'WORK' ? '💪 Work' : '😴 Rest' }}: {{ interval.durationMinutes }} min
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
const sessions = ref([])
const editingId = ref(null)
const form = ref({ name: '', intervals: [] })

onMounted(loadSessions)

function loadSessions() {
  fetch(`${baseUrl}/sessions`)
    .then(r => r.json())
    .then(data => { sessions.value = data })
    .catch(error => console.log('error', error))
}

function addInterval() {
  form.value.intervals.push({ type: 'WORK', durationMinutes: 1 })
}

function removeInterval(index) {
  form.value.intervals.splice(index, 1)
}

function saveSession() {
  const method = editingId.value ? 'PUT' : 'POST'
  const url = editingId.value ? `${baseUrl}/sessions/${editingId.value}` : `${baseUrl}/sessions`

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
    .then(r => r.json())
    .then(() => { cancelEdit(); loadSessions() })
    .catch(error => console.log('error', error))
}

function deleteSession(id) {
  fetch(`${baseUrl}/sessions/${id}`, { method: 'DELETE' })
    .then(() => loadSessions())
    .catch(error => console.log('error', error))
}

function startEdit(session) {
  editingId.value = session.id
  form.value = {
    name: session.name,
    intervals: session.intervals.map(i => ({ ...i }))
  }
}

function cancelEdit() {
  editingId.value = null
  form.value = { name: '', intervals: [] }
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

.form-actions { margin-top: 0.75rem; display: flex; gap: 0.5rem; }

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
