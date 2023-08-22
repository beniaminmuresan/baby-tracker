import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-green/theme.css'
import 'primevue/resources/primevue.min.css'

const app = createApp(App);
app.use(PrimeVue);
app.mount('#app');