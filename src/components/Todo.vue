<template>
  <div>
    <h2>Todo List</h2>
    <div v-for="task in tasks" :key="task.id" class="task">
      <input type="checkbox" />
      {{ task.name }}
    </div>
  </div>
</template>
<script setup>
</script>
