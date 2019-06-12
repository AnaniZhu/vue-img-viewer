import ImgPreview from './ImgPreview.vue'
export default {
  install (Vue, options = {}) {
    Vue.Component('ImgPreview', ImgPreview)
  }
}