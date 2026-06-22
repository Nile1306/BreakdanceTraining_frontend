<script setup>
import { ref } from 'vue'

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const tasks = ref([])

const newTask = ref('')

const selectedDay = ref('Monday')

function addTask() {

  if (newTask.value.trim() === '') {
    return
  }

  tasks.value.push({
    id: Date.now(),
    name: newTask.value,
    day: selectedDay.value,
    done: false
  })

  newTask.value = ''
}

function toggleTask(task) {

  task.done = !task.done

  if (!task.done) {
    return
  }

  const history = JSON.parse(
    localStorage.getItem('activityHistory') || '[]'
  )

  history.push({
    date: new Date().toLocaleDateString('de-DE'),
    type: 'TODO',
    name: task.name
  })

  localStorage.setItem(
    'activityHistory',
    JSON.stringify(history)
  )
}

function deleteTask(id) {

  tasks.value =
    tasks.value.filter(
      task => task.id !== id
    )
}
</script>

<template>
  <div class="todo-page">

    <h2>Weekly Todo List</h2>

    <div class="todo-card">

      <div class="todo-form">

        <input
          v-model="newTask"
          class="input-task"
          placeholder="Enter task..."
          @keyup.enter="addTask"
        />

        <select
          v-model="selectedDay"
          class="day-select"
        >
          <option
            v-for="day in days"
            :key="day"
            :value="day"
          >
            {{ day }}
          </option>
        </select>

        <button
          class="btn-primary"
          @click="addTask"
        >
          Add
        </button>

      </div>

    </div>

    <div
      v-for="day in days"
      :key="day"
      class="day-section"
    >

      <h3>{{ day }}</h3>

      <div
        v-for="task in tasks.filter(
          t => t.day === day
        )"
        :key="task.id"
        class="task-card"
      >

        <div class="task-content">

          <label class="task-label">

            <input
              type="checkbox"
              :checked="task.done"
              @change="toggleTask(task)"
            />

            <span
              :class="{ done: task.done }"
            >
              {{ task.name }}
            </span>

          </label>

          <button
            class="btn-danger"
            @click="deleteTask(task.id)"
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.todo-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.todo-card,
.task-card {
  background: #181c24;
  border: 1px solid #2b313d;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.todo-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.input-task,
.day-select {
  background: #222834;
  border: 1px solid #384152;
  border-radius: 8px;
  color: white;
  padding: 12px;
}

.input-task {
  flex: 1;
}

.day-section {
  margin-top: 2rem;
}

.day-section h3 {
  color: #f97316;
  margin-bottom: 1rem;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.done {
  text-decoration: line-through;
  opacity: 0.5;
}

.btn-primary {
  background: #f97316;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}
</style>

