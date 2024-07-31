import { ref } from 'vue';
import { useArticulosStore } from '../store/articulos';
import { createToast } from 'mosha-vue-toastify';
import type { IArticulo } from '~/models/IArticulo';

export const useArticulos = () => {
  const store = useArticulosStore();
  const filters = ref({
    titulo: '',
    contenido: '',
    fechaPublicacion: '',
    autor: ''
  });

  const loading = ref(false);
  const results = ref<IArticulo[]>([]);
  const currentArticulo = ref<IArticulo | null>(null);
  const isModalOpen = ref(false);
  const isDetailModalOpen = ref(false);
  const isEditModalOpen = ref(false);

  const findArticulo = async (): Promise<void> => {
    try {
      loading.value = true;
      const result = await store.find();
      if (Array.isArray(result)) {
        results.value = result;
      } else {
        console.error('La respuesta de la API no es un arreglo');
        results.value = [];
      }
      loading.value = false;
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
      loading.value = false;
    }
  };

  const findArticuloById = async (id: string): Promise<void> => {
    try {
      loading.value = true;
      const result = await store.findArticuloById(id);
      if (result) {
        currentArticulo.value = result;
        
        Object.assign(filters.value, result);
      } else {
        console.error('No se encontró el artículo con ID:', id);
        currentArticulo.value = null;
      }
      loading.value = false;
    } catch (error) {
      console.error('Error al obtener el artículo por ID:', error);
      loading.value = false;
    }
  };

  const createArticulo = async (): Promise<void> => {
    try {
      if (!filters.value.titulo || !filters.value.contenido || !filters.value.fechaPublicacion || !filters.value.autor) {
        createToast('Para poder crear el artículo debe completar los campos', {
          type: 'danger',
          position: 'top-right',
        });
        return;
      }

      loading.value = true;
      const payload: IArticulo = {
        titulo: filters.value.titulo,
        contenido: filters.value.contenido,
        fechaPublicacion: filters.value.fechaPublicacion,
        autor: filters.value.autor,
      };

      const result = await store.createArticulo(payload);
      if (result) {
        createToast('El artículo se ha agregado correctamente', {
          type: 'success',
          position: 'top-right',
        });
        await findArticulo();
        closeModal(); // Cierra el modal después de crear el artículo
      } else {
        createToast('Ocurrió un error al agregar el artículo', {
          position: 'top-right',
          type: 'danger',
        });
        console.error('Error al crear el artículo');
      }
      loading.value = false;
    } catch (error) {
      createToast('Ocurrió un error al agregar el artículo', {
        position: 'top-right',
        type: 'danger',
      });
      console.error('Error al crear el artículo:', error);
      loading.value = false;
    }
  };

  const updateArticulo = async (id: string): Promise<void> => {
    try {
      if (!filters.value.titulo || !filters.value.contenido || !filters.value.fechaPublicacion || !filters.value.autor) {
        createToast('Para poder actualizar el artículo debe completar los campos', {
          type: 'danger',
          position: 'top-right',
        });
        return;
      }

      loading.value = true;
      const payload: IArticulo = {
        titulo: filters.value.titulo,
        contenido: filters.value.contenido,
        fechaPublicacion: filters.value.fechaPublicacion,
        autor: filters.value.autor,
      };

      const result = await store.updateArticulo(id, payload);
      if (result) {
        createToast('El artículo se ha actualizado correctamente', {
          type: 'success',
          position: 'top-right',
        });
        await findArticulo();
        closeEditModal(); // Cierra el modal después de actualizar el artículo
      } else {
        createToast('Ocurrió un error al actualizar el artículo', {
          position: 'top-right',
          type: 'danger',
        });
        console.error('Error al actualizar el artículo');
      }
      loading.value = false;
    } catch (error) {
      createToast('Ocurrió un error al actualizar el artículo', {
        position: 'top-right',
        type: 'danger',
      });
      console.error('Error al actualizar el artículo:', error);
      loading.value = false;
    }
  };

  const deleteArticulo = async (id: string): Promise<void> => {
    try {
      loading.value = true;
      const success = await store.deleteArticulo(id);
      if (success) {
        createToast('El artículo se ha eliminado correctamente', {
          type: 'success',
          position: 'top-right',
        });
        await findArticulo(); // Volver a buscar los artículos después de eliminar
      } else {
        createToast('Ocurrió un error al eliminar el artículo', {
          type: 'danger',
          position: 'top-right',
        });
      }
      loading.value = false;
    } catch (error) {
      createToast('Ocurrió un error al eliminar el artículo', {
        type: 'danger',
        position: 'top-right',
      });
      console.error('Error al eliminar el artículo:', error);
      loading.value = false;
    }
  };

  const openModal = () => {
    isModalOpen.value = true;
  };

  const openModalDetail = () => {
    isDetailModalOpen.value = true;
  };

  const openEditModal = (id: string) => {
    isEditModalOpen.value = true;
    findArticuloById(id);
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const closeModalDetail = () => {
    isDetailModalOpen.value = false;
  };

  const closeEditModal = () => {
    isEditModalOpen.value = false;
  };

  return {
    filters,
    loading,
    results,
    currentArticulo,
    isModalOpen,
    isDetailModalOpen,
    isEditModalOpen,
    openModal,
    openModalDetail,
    openEditModal,
    closeModal,
    closeModalDetail,
    closeEditModal,
    findArticulo,
    findArticuloById,
    deleteArticulo,
    createArticulo,
    updateArticulo
  };
};
