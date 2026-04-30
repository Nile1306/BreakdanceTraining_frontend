<script setup>
import { ref } from 'vue'

import DrillComponent from './components/DrillComponent.vue'
import TodoComponent from './components/Todo.vue'
import StatisticComponent from './components/Statistic.vue'

const page = ref("drill")
</script>

<template>
  <div class="app">
    <h1>Breakdance Training</h1>
    <div class="nav">
      <button @click="page='drill'">Drill</button>
      <button @click="page='todo'">Todo</button>
      <button @click="page='stats'">Stats</button>
    </div>
    <div class="content">
      <DrillComponent v-if="page==='drill'" />
      <TodoComponent v-if="page==='todo'" />
      <StatisticComponent v-if="page==='stats'" />
    </div>
  </div>
</template>

<style>

body {
   margin: 0;
   background: #f0f2f5;

}


.app {
  max-width:100%;
  width: 95%;
  min-height: 100vh;
  margin: 40px auto;
  padding: 40px;
  text-align: center;

}

h1 {
  color: #2c3e50;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #ecf0f1;
  color: #7f8c8d;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #bdc3c7;
  color: #2c3e50;
}

.content {
  padding: 20px;
  background: white;
  border-radius: 8px;
  min-height: 200px;
   display: flex;
   justify-content: center;
}
</style>


