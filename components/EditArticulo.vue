<template>
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-white p-6 w-96 rounded-lg shadow-custom relative">
            <button @click="handleClose" class="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800">
                &times;
            </button>
            <h2 class="text-xl font-semibold mb-4">Editar Artículo</h2>
            <form @submit.prevent="handleSubmit">
                <div>
                    <label for="titulo" class="block font-semibold">Título</label>
                    <input placeholder="Título: Artículo Importante" v-model="filters.titulo" type="text" id="titulo"
                        class="w-full border p-2 rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <div class="mt-4">
                    <label for="contenido" class="block font-semibold">Contenido</label>
                    <textarea placeholder="Contenido: Descripción detallada del artículo" v-model="filters.contenido"
                        id="contenido" rows="3"
                        class="w-full border p-2 rounded focus:outline-none focus:border-blue-500" required></textarea>
                </div>
                <div class="mt-4">
                    <label for="fecha" class="block font-semibold">Fecha de Publicación</label>
                    <input type="date" v-model="filters.fechaPublicacion" id="fecha" name="fecha"
                        class="w-full border p-2 rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <div class="mt-4">
                    <label for="autor" class="block font-semibold">Autor</label>
                    <input placeholder="Autor: Nombre del Autor" v-model="filters.autor" type="text" id="autor"
                        class="w-full border p-2 rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <div class="mt-4">
                    <div class="text-right">
                        <LoadingButton :loading="loading" type="submit"
                            :disabled="(!filters.titulo || !filters.contenido || !filters.fechaPublicacion || !filters.autor)"
                            :class="(filters.titulo && filters.contenido && filters.fechaPublicacion && filters.autor)
                                ? 'bg-[#3B82F6] hover:bg-[#0b63f3] text-white'
                                : 'bg-[#EFF0EB] text-[#A7AAA2]'">
                            Guardar Cambios
                        </LoadingButton>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import { useArticulos } from './../composables/useArticulo';
import LoadingButton from './../components/LoadingButton.vue';

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

const { filters, updateArticulo, findArticuloById, loading } = useArticulos();
const isModalOpen = ref(false);

watch(() => props.id, async (newId) => {
    if (newId) {
        await findArticuloById(newId);
        if (filters.value.fechaPublicacion) {
            filters.value.fechaPublicacion = filters.value.fechaPublicacion.split('T')[0];
        }

        isModalOpen.value = true;
    }
}, { immediate: true });

const handleSubmit = async () => {
    try {
        await updateArticulo(props.id);
        handleClose();
    } catch (error) {
        console.error('Error al actualizar el artículo:', error);
    }
};

const handleClose = () => {
    if (props.onClose) {
        props.onClose();
        isModalOpen.value = false;
    }
};
</script>

<style>
.shadow-custom {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.25), 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>