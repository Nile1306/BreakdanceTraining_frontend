<template>
  <div>
    <h2>Footwork Sessions</h2>

    <div v-for="session in sessions" :key="session.id">
      <span>Work: {{ session.workTime }}s | Rest: {{ session.restTime }}s | Rounds: {{ session.round }}</span>
      <button @click="startEdit(session)">Edit</button>
      <button @click="deleteSession(session.id)">Delete</button>
    </div>

    <hr />

    <h3>{{ editingId ? 'Edit Session' : 'New Session' }}</h3>
    <input v-model.number="form.workTime" type="number" placeholder="Work (s)" />
    <input v-model.number="form.restTime" type="number" placeholder="Rest (s)" />
    <input v-model.number="form.round" type="number" placeholder="Rounds" />
    <button @click="saveSession">{{ editingId ? 'Update' : 'Create' }}</button>
    <button v-if="editingId" @click="cancelEdit">Cancel</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
const sessions = ref([])
const editingId = ref(null)
const form = ref({ workTime: 0, restTime: 0, round: 0 })

onMounted(loadSessions)

function loadSessions() {
  fetch(`${baseUrl}/sessions`)
    .then(r => r.json())
    .then(data => { sessions.value = data })
    .catch(error => console.log('error', error))
}

function saveSession() {
  if (editingId.value) {
    fetch(`${baseUrl}/sessions/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
      .then(r => r.json())
      .then(() => { cancelEdit(); loadSessions() })
      .catch(error => console.log('error', error))
  } else {
    fetch(`${baseUrl}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
      .then(r => r.json())
      .then(() => { form.value = { workTime: 0, restTime: 0, round: 0 }; loadSessions() })
      .catch(error => console.log('error', error))
  }
}

function deleteSession(id) {
  fetch(`${baseUrl}/sessions/${id}`, { method: 'DELETE' })
    .then(() => loadSessions())
    .catch(error => console.log('error', error))
}

function startEdit(session) {
  editingId.value = session.id
  form.value = { workTime: session.workTime, restTime: session.restTime, round: session.round }
}

function cancelEdit() {
  editingId.value = null
  form.value = { workTime: 0, restTime: 0, round: 0 }
}
</script>
