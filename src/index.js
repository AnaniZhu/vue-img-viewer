import ImagePreview from './ImagePreview'

ImagePreview.install = Vue => Vue.component(ImagePreview.name, ImagePreview)

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(ImagePreview.name, ImagePreview)
}

export default ImagePreview
