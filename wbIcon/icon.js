import Vue from 'vue';
import WbIcon from './WbIcon.vue';

Vue.component('wb-icon', WbIcon);

const req = require.context('@/assets/svg', false, /\.svg$/);
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
requireAll(req);
