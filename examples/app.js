import Vue from 'vue'
import ImagePreview from 'vue-img-viewer'
import Example from './pages/example.vue'

Vue.use(ImagePreview)

// if (module.hot) {
//   module.hot.accept()
// }

new Vue({
  render: h => h(Example)
}).$mount('#app')
