<template>
  <div class="d-flex flex-column min-vh-100">
    <TheHeader />
    <main class="container my-4 flex-grow-1">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
</script>
