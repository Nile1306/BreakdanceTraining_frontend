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


<style scoped>
.app {
text-align: center;
}

h1 {
  font-size: 40px;
  margin-bottom: 16px;
}

.nav {
width: 100%;
font-size: 14px;
margin-top: 20px;
}

.nav a {
display: inline-block;
padding: 0 16px;
border-left: 1px solid var(--color-border);
text-decoration: none;
color: inherit;
}

.nav a:first-of-type {
border-left: none;
}

.nav a.router-link-exact-active {
color: var(--color-text);
font-weight: bold;
}

.nav a.router-link-exact-active:hover {
background-color: transparent;
}

.content {
margin-top: 24px;
font-size: 24px
}


@media (min-width: 1024px) {
.nav {
font-size: 16px;
margin-top: 16px;
}
}
</style>
