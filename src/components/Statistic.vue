<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([])

onMounted(() => {

})
</script>

<template>
  <div>
    <h2>Statistics</h2>

    <div v-if="stats.length === 0">
      No data available
     </div>


    <div v-for="day in stats" :key="day.date">
    {{ day.date }} : {{ day.count }} sessions
    </div>
    </div>
</template>
