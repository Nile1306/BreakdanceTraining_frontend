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
  <div>
  <h2>Todo List</h2>
    <input v-model="newTask" placeholder="Enter task..." />
    <button @click="addTask">Add</button>


    <div v-for="task in tasks" :key="task.id">
      <input type="checkbox" v-model="task.done" />
      {{ task.name }}
      <button @click="deleteTask(task.id)">Delete</button>

        </div>
 </div>
</template>
