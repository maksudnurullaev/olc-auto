<template>
  <div class="f-container fixed-hf">
    <header>
      <router-link to="/">Главная</router-link>
      <router-link to="/splitpanes">Контроль на КПП</router-link>
      <router-link to="/tut">Помощь</router-link>
    </header>
    <div class="main"><router-view /></div>
    <footer>
      <a href="http://www.olc.uz" target="_blank">&copy; {{new Date().getFullYear()}} - ТЛЦ «Orient Logistics Center»</a>
    </footer>
  </div>
</template>

<style scoped>
@import url("../src/css/main.css");
</style>