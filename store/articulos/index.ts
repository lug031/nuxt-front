import { defineStore } from "pinia";
import articulos from "../../api/articulos";
import type { IArticulo } from "../../models/IArticulo";

export const useArticulosStore = defineStore("crudArticulos", {
  state: () => ({
  }),
  actions: {
    async find(): Promise<IArticulo[]> {
      try {
        const { data } = await articulos.get(`/`);
        return data;
      } catch (error) {
        console.error('Error al obtener artículos:', error);
        return [];
      }
    },
    async findByTitulo(titulo: string): Promise<IArticulo | null> {
      try {
        const { data } = await articulos.get(`/titulo`, {
          params: { titulo }
        });
        return data;
      } catch (error) {
        console.error('Error al obtener artículo por título:', error);
        return null;
      }
    },
    async findArticuloById(id: string): Promise<IArticulo | null> {
      try {
        const { data } = await articulos.get(`/${id}`);
        return data;
      } catch (error) {
        console.error('Error al obtener artículo por ID:', error);
        return null;
      }
    },
    async createArticulo(createArticuloDto: any): Promise<IArticulo | null> {
      try {
        const { data } = await articulos.post(`/`, createArticuloDto);
        return data;
      } catch (error) {
        console.error('Error al crear artículo:', error);
        return null;
      }
    },
    
    async updateArticulo(id: string, updateArticuloDto: any): Promise<IArticulo | null> {
      try {
        const { data } = await articulos.patch(`/${id}`, updateArticuloDto);
        return data;
      } catch (error) {
        console.error('Error al actualizar artículo:', error);
        return null;
      }
    },
    
    async deleteArticulo(id: string): Promise<boolean> {
      try {
        await articulos.delete(`/${id}`);
        return true;
      } catch (error) {
        console.error('Error al eliminar artículo:', error);
        return false;
      }
    },
  },
});
