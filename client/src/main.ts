import './assets/fonts/lato.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// @ts-expect-error incorrect declaration export
import { AtomSpinner } from 'epic-spinners';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('AtomSpinner', AtomSpinner);
app.mount('#app');
