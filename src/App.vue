<template>
  <TheHeader />
    <div class="container my-4">
      <RouterView />
    </div>
  <TheFooter />
</template>


<script setup>
import TheHeader from './shared/components/TheHeader/TheHeader.vue';
import TheFooter from './shared/components/TheFooter/TheFooter.vue';
</script>


<!-- <style scoped>

</style> -->
