<template>
  <div>
    <h2>Todo List</h2>
    <!-- TODO: tasks aren't loaded yet, need to wire up the backend -->
    <div v-for="task in tasks" :key="task.id" class="task">
      <input type="checkbox" />
      {{ task.name }}
    </div>
  </div>
</template>

<script setup>
// tasks will eventually come from an API call
// const tasks = ref([])
</script>
