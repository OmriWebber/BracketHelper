import './assets/main.scss'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';


import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import VueClipboard from 'vue3-clipboard'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue)
app.use(VueClipboard)

app.mount('#app')
