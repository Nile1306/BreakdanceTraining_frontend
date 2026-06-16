<script setup>
import { ref } from 'vue'

const tasks = ref([])
const newTask = ref("")

function addTask() {
  if (newTask.value.trim() !== "") {
    tasks.value.push({
      id: Date.now(),
      name: newTask.value,
      done: false
    })
    newTask.value = ""
  }
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(task => task.id !== id)
}
</script>

<template>
  <div class="todo-page">
    <h2>Todo List</h2>

    <div class="todo-card">
      <div class="todo-form">
        <input
          v-model="newTask"
          class="input-task"
          placeholder="Enter task..."
          @keyup.enter="addTask"
        />

        <button
          class="btn-primary"
          @click="addTask"
        >
          Add
        </button>
      </div>
    </div>

    <div
      v-for="task in tasks"
      :key="task.id"
      class="task-card"
    >
      <div class="task-content">
        <label class="task-label">
          <input
            type="checkbox"
            v-model="task.done"
          />

          <span :class="{ done: task.done }">
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
</template>

<style scoped>
.todo-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.todo-card,
.task-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.todo-form {
  display: flex;
  gap: 0.75rem;
}

.input-task {
  flex: 1;
  padding: 0.6rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.btn-primary {
  background: #f97316;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger:hover {
  opacity: 0.9;
}
</style>
