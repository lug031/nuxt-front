<template>
  <div class="h-screen w-screen fixed">
    <div class="absolute top-64 left-1/2 -translate-x-1/2">
      <Spinner :width="8" :height="8" />
    </div>
  </div>
</template>

<script setup>
import Spinner from './../components/Spinner.vue';
</script>
