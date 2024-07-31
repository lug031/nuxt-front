<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen pt-20">
    <div class="max-w-4xl mx-auto bg-white rounded-md h-[20rem] flex justify-center items-center">
      <div v-if="swaggerDocs" v-html="swaggerDocs"></div>
      <p v-else class="text-5xl font-semibold">Cargando documentación...</p>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Header from './../layouts/Header.vue';
import { useArticulos } from './../composables/useArticulo';

const { docsSwagger } = useArticulos();
const swaggerDocs = ref(null);

onMounted(async () => {
  swaggerDocs.value = await docsSwagger();
});
</script>
