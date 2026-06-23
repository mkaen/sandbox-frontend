<template>
  <TheHeader />
  <div class="container my-4">
    <RouterView />
  </div>
  <TheFooter />
</template>

<script setup>
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
</script>
