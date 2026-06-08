<script setup>
import { ref, onMounted, onActivated, computed } from 'vue'
const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
const stats = ref([])
const totalSessions = computed(() =>
  stats.value.reduce((sum, day) => sum + day.count, 0)
)
async function loadData() {
  try {
    const res = await fetch(`${baseUrl}/sessions`)
    const data = await res.json()
    const grouped = {}
    data.forEach(session => {
      const date = session.date
      if (!grouped[date]) {
        grouped[date] = 0
      } grouped[date]++
    })
    stats.value = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map(date => ({date,count: grouped[date]
      }))
  } catch (error) {
    console.error('Failed to load statistics:', error)
  }
}
onMounted(loadData)
onActivated(loadData)
</script>

<template>
  <div class="statistics-page">
    <h2>Training Statistics</h2>

    <div class="stats-card">
      <div class="stats-row">
        <span>Total Sessions</span>
        <span class="stats-count">
          {{ totalSessions }}
        </span>
      </div>
    </div>

    <div
      v-if="stats.length === 0"
      class="stats-card empty-card"
    >
      No data available
    </div>

    <div
      v-for="day in stats"
      :key="day.date"
      class="stats-card"
    >
      <div class="stats-row">
        <span class="stats-date">
          {{ day.date }}
        </span>

        <span class="stats-count">
          {{ day.count }} sessions
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.stats-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-date {
  font-weight: 600;
}

.stats-count {
  color: #f97316;
  font-weight: 600;
}

.empty-card {
  text-align: center;
  color: #888;
}
</style>
