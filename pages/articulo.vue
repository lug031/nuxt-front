<template>
  <div>
    <Header />
    <section class="bg-ct-blue-600 min-h-screen py-16">
      <LoadingProgress v-if="loading" />
      <div v-else>
        <div class="max-w-6xl mx-auto px-6">
          <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between w-full mb-4">
              <button @click="openAddModal"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-[#0b63f3] hover:text-white-500">
                Nuevo Artículo
              </button>
              <div class="flex">
                <input type="text"
                  class="py-2 px-4 border rounded w-80 focus:outline-none bg-gray-100 placeholder-gray-500"
                  v-model="searchTerm" placeholder="Busca por título..." />
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              <div class="group relative" v-for="articulo in filteredArticulos" :key="articulo.id">
                <div class="rounded-md shadow-custom bg-white">
                  <div class="p-4">
                    <h5 class="font-semibold text-xl text-[#4d4d4d] mb-4">
                      {{ articulo.titulo.length > 20 ? articulo.titulo.substring(0, 25) + '...' : articulo.titulo }}
                    </h5>
                    <h5 class="text-base text-[#4d4d4d] mb-4 text-justify">
                      {{ articulo.contenido.length > 50 ? articulo.contenido.substring(0, 50) + '...' :
                        articulo.contenido }}
                    </h5>
                    <div class="flex items-center">
                      <IconTooling />
                      <p class="text-sm font-semibold"> Autor: {{ articulo.autor }}</p>
                    </div>
                    <p class="text-[#ffa238]">
                      {{ formatDate(articulo.fechaPublicacion) }}
                    </p>
                  </div>
                  <div class="flex justify-between items-center px-4 pb-4">
                    <div class="relative">
                      <div class="text-3xl text-[#4d4d4d] cursor-pointer p-3" @click="toggleSettings(articulo)">
                        ...
                      </div>
                      <ul
                        class="absolute bottom-5 -right-1 z-50 py-2 rounded-sm bg-white shadow-lg transition ease-out duration-300"
                        v-if="articulo.showSettings">
                        <li
                          class="w-24 h-7 py-3 px-2 hover:bg-[#f5f5f5] flex items-center gap-2 cursor-pointer transition ease-in duration-300"
                          @click="handleOptionClick('view', articulo)">
                          <i class="bx bx-show"></i> <span>Ver</span>
                        </li>
                        <li
                          class="w-24 h-7 py-3 px-2 hover:bg-[#f5f5f5] flex items-center gap-2 cursor-pointer transition ease-in duration-300"
                          @click="handleOptionClick('edit', articulo)">
                          <i class="bx bx-edit"></i> <span>Editar</span>
                        </li>
                        <li
                          class="w-24 h-7 py-3 px-2 hover:bg-[#f5f5f5] flex items-center gap-2 cursor-pointer transition ease-in duration-300"
                          @click="handleOptionClick('delete', articulo)">
                          <i class="bx bx-trash"></i> <span>Eliminar</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Message v-if="results && results.length === 0" />
          </div>
        </div>
      </div>
    </section>
    <teleport to="body">
      <AddArticulo v-if="isModalOpen" :onClose="handleCloseAddModal" />
      <VerArticulo v-if="isDetailModalOpen" :id="selectedArticuloId" :onClose="handleCloseDetailModal" />
      <EditArticulo v-if="isEditModalOpen" :id="selectedArticuloId" :onClose="handleCloseEditModal" />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Header from './../layouts/Header.vue';
import LoadingProgress from './../layouts/LoadingProgress.vue';
import IconTooling from './../layouts/IconTooling.vue';
import AddArticulo from './../components/AddArticulo.vue';
import VerArticulo from './../components/VerArticulo.vue';
import { useArticulos } from "./../composables/useArticulo";
import Message from '~/components/Message.vue';

const { results, loading, findArticulo, deleteArticulo } = useArticulos();

const searchTerm = ref('');
const selectedArticuloId = ref('');
const isModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const isEditModalOpen = ref(false);

const openAddModal = () => {
  isModalOpen.value = true;
};

const handleCloseAddModal = async () => {
  isModalOpen.value = false;
  await findArticulo();
};

const openDetailModal = (articulo) => {
  isDetailModalOpen.value = true;
  selectedArticuloId.value = articulo.id;
  console.log("ID ?????????");
  console.log(selectedArticuloId.value);
};

const handleCloseDetailModal = async () => {
  isDetailModalOpen.value = false;
};

const openEditModal = (articulo) => {
  isEditModalOpen.value = true;
  selectedArticuloId.value = articulo.id;
};

const handleCloseEditModal = async () => {
  isEditModalOpen.value = false;
  await findArticulo();
};

const handleOptionClick = async (action, articulo) => {
  switch (action) {
    case 'view':
      openDetailModal(articulo);
      break;
    case 'edit':
      openEditModal(articulo);
      break;
    case 'delete':
      await onDelete(articulo);
      break;
  }
  articulo.showSettings = false; // Cierra el menú de configuración
};

onMounted(async () => {
  try {
    await findArticulo();
  } catch (error) {
    console.log(error);
  }
});

const onDelete = async (articulo) => {
  const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este artículo?');

  if (confirmDelete) {
    try {
      await deleteArticulo(articulo.id);
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
  }
};

const toggleSettings = (articulo) => {
  results.value.forEach((ins) => {
    if (ins !== articulo) {
      ins.showSettings = false;
    }
  });
  articulo.showSettings = !articulo.showSettings;
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const filteredArticulos = computed(() => {
  return results.value.filter(articulo => {
    return articulo.titulo.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});
</script>
