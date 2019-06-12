import ImgPreview from './ImgPreview.vue'
import '//at.alicdn.com/t/font_1239600_z1ho2s724n.css'

export default {
  install (Vue, options = {}) {
    Vue.Component('ImgPreview', ImgPreview)
  }
}