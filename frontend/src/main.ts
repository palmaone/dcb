import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vuetify } from './plugins/vuetify'


import App from './App.vue'
import { router } from './router'



const pinia = createPinia()
createApp(App).use(vuetify).use(router).use(pinia).mount('#app')

