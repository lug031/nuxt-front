// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    // Agrega aquí tus archivos CSS globales o estilos compartidos.
    '~/assets/css/main.css',
    'mosha-vue-toastify/dist/style.css', // Estilo de mosha-vue-toastify
  ],
  postcss: {
    plugins: {
      tailwindcss: {}, 
      autoprefixer: {},
    },
  },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    }
  },
  runtimeConfig: {
    public: {
      //apiBase: '/api'
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
