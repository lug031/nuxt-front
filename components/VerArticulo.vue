<template>
  <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-custom p-6 max-w-md w-full relative">
      <button @click="handleClose" class="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800">
        &times;
      </button>
      <h2 class="text-2xl font-semibold mb-4">Detalles del Artículo</h2>
      <div v-if="currentArticulo" class="space-y-4">
        <div>
          <label class="block font-semibold">Título:</label>
          <p>{{ currentArticulo.titulo }}</p>
        </div>
        <div>
          <label class="block font-semibold">Contenido:</label>
          <p>{{ currentArticulo.contenido }}</p>
        </div>
        <div>
          <label class="block font-semibold">Fecha de Publicación:</label>
          <p>{{ formatDate(currentArticulo.fechaPublicacion) }}</p>
        </div>
        <div>
          <label class="block font-semibold">Autor:</label>
          <p>{{ currentArticulo.autor }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useArticulos } from './../composables/useArticulo';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  onClose: {
    type: Function,
    required: true
  }
});

const { currentArticulo, findArticuloById } = useArticulos();
const isModalOpen = ref(false);

watch(() => props.id, async (newId) => {
  if (newId) {
    await findArticuloById(newId);
    isModalOpen.value = true;
  }
}, { immediate: true });


const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const handleClose = () => {
  if (props.onClose) {
    props.onClose();
    isModalOpen.value = false;
  }
};
</script>
