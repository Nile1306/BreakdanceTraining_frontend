<template>
  <div class="sessions-page">
    <h2>Create Session</h2>

    <p v-if="successMessage" class="success-message">
      {{ successMessage }}
    </p>

    <div class="form-card">
      <h3>{{ editingId ? 'Edit Session' : 'New Session' }}</h3>

      <input
        v-model="form.name"
        type="text"
        placeholder="Session Name"
        class="input-name"
      />

      <div class="intervals-list">
        <div
          v-for="(interval, index) in form.intervals"
          :key="index"
          class="interval-row"
        >
          <select v-model="interval.type">
            <option value="WORK">Work</option>
            <option value="REST">Rest</option>
          </select>

          <input
            v-model.number="interval.durationMinutes"
            type="number"
            min="1"
            placeholder="Seconds"
          />

          <span>sec</span>

          <button class="btn-remove" @click="removeInterval(index)">
            ✕
          </button>
        </div>
      </div>

      <button class="btn-add" @click="addInterval">
        + Add Interval
      </button>

      <div class="form-actions">
        <button class="btn-primary" @click="saveSession">
          {{ editingId ? 'Update Session' : 'Create Session' }}
        </button>

        <button v-if="editingId" class="btn-secondary" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

const editingId = ref(null)
const successMessage = ref('')

const form = ref({
  name: '',
  intervals: [],
})

function addInterval() {
  form.value.intervals.push({
    type: 'WORK',
    durationMinutes: 30,
  })
}

function removeInterval(index) {
  form.value.intervals.splice(index, 1)
}

async function saveSession() {
  try {
    const method = editingId.value ? 'PUT' : 'POST'

    const url = editingId.value
      ? `${baseUrl}/sessions/${editingId.value}`
      : `${baseUrl}/sessions`
    console.log('current user email:', auth.email)
    const sessionData = {
      ...form.value,
      ownerEmail: auth.email,
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    })

    if (!response.ok) {
      throw new Error('Failed to save session')
    }

    successMessage.value = editingId.value
      ? 'Session updated successfully!'
      : 'Session created successfully!'

    cancelEdit()

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error(error)
    alert('Could not save session.')
  }
}

function cancelEdit() {
  editingId.value = null

  form.value = {
    name: '',
    intervals: [],
  }
}
</script>

<style scoped>
.sessions-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
}

.success-message {
  background: #16a34a;
  color: white;
  padding: 12px 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.form-card {
  background: #181c24;
  border: 1px solid #2b313d;
  border-radius: 12px;
  padding: 1rem;
}

.input-name {
  width: 100%;
  background: #222834;
  border: 1px solid #384152;
  border-radius: 8px;
  color: white;
  padding: 12px;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.intervals-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.interval-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.interval-row select,
.interval-row input {
  background: #222834;
  border: 1px solid #384152;
  border-radius: 8px;
  color: white;
  padding: 10px;
}

.btn-add,
.btn-primary,
.btn-secondary,
.btn-remove {
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-add {
  margin-top: 14px;
  background: #374151;
  color: white;
  padding: 10px 14px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.btn-primary {
  background: #f97316;
  color: white;
  padding: 10px 18px;
}

.btn-secondary {
  background: #374151;
  color: white;
  padding: 10px 18px;
}

.btn-remove {
  background: #dc2626;
  color: white;
  padding: 8px 12px;
}
</style>
