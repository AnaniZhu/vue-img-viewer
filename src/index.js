import ImagePreview from './ImagePreview.vue'

ImagePreview.install = Vue => Vue.Component(ImagePreview.name, ImagePreview)

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.Component(ImagePreview.name, ImagePreview)
}

export default ImagePreview
