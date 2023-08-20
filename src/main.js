import './assets/main.scss'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'


import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

watch(pinia.state,(state) => {
      localStorage.setItem("drivers", JSON.stringify(state.drivers));
    },
    { deep: true }
);

app.mount('#app')
