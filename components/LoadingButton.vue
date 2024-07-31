<template>
  <button
    type="submit"
    :class="`w-full py-3 font-semibold rounded-lg outline-none border-none flex justify-center ${
      loading ? 'bg-[#ccc]' : ''
    }`"
    :disabled="loading"
  >
    <div v-if="loading" class="flex items-center gap-3">
      <Spinner />
      <span class="text-white">Espere...</span>
    </div>
    <span v-else :class="``"><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import Spinner from './../components/Spinner.vue';
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
