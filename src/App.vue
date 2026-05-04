<script setup>

</script>

<template>
  <div class="app">
    <h1>Breakdance Training</h1>
    <div class="nav">
      <router-link to="/">Drill</router-link>
      <router-link to="/todo">Todo</router-link>
      <router-link to="/stats">Stats</router-link>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style>

body {
   margin: 0;
   background: #f0f2f5;

}


.app {
  max-width:1200px;
  width: 100%;
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

.content {
  padding: 20px;
  background: white;
  border-radius: 8px;
  min-height: 200px;
  max-width: 800px;
    margin: 0 auto;
   display: flex;
   justify-content: center;
}
</style>


