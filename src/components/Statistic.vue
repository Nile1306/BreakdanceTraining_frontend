<script setup>
import { ref, onMounted, onActivated } from 'vue'

const stats = ref([])
async function loadData() {
  console.log("CALL API") // debug

  const res = await fetch("http://localhost:8080/sessions")
  const data = await res.json()

  const grouped = {}
  data.forEach(s => {
    const date = s.date
    if (!grouped[date]) {
      grouped[date] = 0
    }
    grouped[date]++
  })
 stats.value = Object.keys(grouped).map(date => ({
    date,
    count: grouped[date]
  }))
}
onMounted(loadData)
onActivated(loadData)
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
