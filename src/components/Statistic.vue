<script setup>
import {
  ref,
  computed,
  onMounted,
  onActivated
} from 'vue'

const activities = ref([])

const totalActivities = computed(() =>
  activities.value.length
)

const groupedActivities = computed(() => {

  const grouped = {}

  activities.value.forEach(activity => {

    if (!grouped[activity.date]) {
      grouped[activity.date] = []
    }

    grouped[activity.date].push(activity)
  })

  return Object.entries(grouped)
    .sort(
      (a, b) =>
        new Date(
          b[0].split('.').reverse().join('-')
        ) -
        new Date(
          a[0].split('.').reverse().join('-')
        )
    )
})

function loadData() {

  activities.value =
    JSON.parse(
      localStorage.getItem(
        'activityHistory'
      ) || '[]'
    )
}

onMounted(loadData)

onActivated(loadData)
</script>

<template>

  <div class="statistics-page">

    <h2>
      Training Statistics
    </h2>

    <div class="stats-card">

      <div class="stats-row">

        <span>
          Total Activities
        </span>

        <span class="stats-count">
          {{ totalActivities }}
        </span>

      </div>

    </div>

    <div
      v-if="
        activities.length === 0
      "
      class="stats-card empty-card"
    >
      No activity recorded yet
    </div>

    <div
      v-for="
        [date, items]
        in groupedActivities
      "
      :key="date"
      class="stats-card"
    >

      <div class="date-header">

        {{ date }}

      </div>

      <div
        v-for="(item, index) in items"
        :key="index"
        class="activity-item"
      >

        <template
          v-if="
            item.type ===
            'SESSION'
          "
        >

          ✓
          {{ item.name }}

          <span
            class="activity-detail"
          >
            (
            {{ item.intervals }}
            intervals
            )
          </span>

        </template>

        <template
          v-else
        >

          ✓
          {{ item.name }}

        </template>

      </div>

    </div>

  </div>

</template>

<style scoped>
.statistics-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
}

.stats-card {
  background: #181c24;
  border: 1px solid #2b313d;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-count {
  color: #f97316;
  font-weight: bold;
}

.date-header {
  color: #f97316;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.activity-item {
  color: white;
  padding: 8px 0;
  border-bottom: 1px solid #2b313d;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-detail {
  color: #9ca3af;
}

.empty-card {
  text-align: center;
  color: #9ca3af;
}
</style>

