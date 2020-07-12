<template>
  <div>
    <transition name="fade-in">
      <!-- 第一次打开后才渲染dom -->
      <div
        v-if="isFirstShow"
        v-show="finallyVisible"
        ref="imagePreview"
        class="preview-container">
        <div class="image-wrapper">
          <slot name="loading" :loading="loading">
            <Snippet v-if="loading" />
          </slot>
          <!-- draggable: false 禁止 chrome 拖拽图片 -->
          <img
            v-show="!loading"
            ref="image"
            :src="finallyImageList[currentPosition]"
            :alt="`图片${currentPosition + 1}`"
            :style="imgStyle"
            class="image"
            draggable="false"
            @load="handleImageLoad"
            @error="hideLoading"
            @abort="hideLoading"
            @mousedown="handleImageMouseDown"
            @wheel="wheelScale">
        </div>
        <div class="pos-tip">{{ currentPosition + 1 }} / {{ totalCount }}</div>
        <div class="close hover-icon" @click="close"><SvgIcon class="icon" name="guanbi" /></div>
        <div class="arrow arrow-prev hover-icon" @click="updatePosition(-1)"><SvgIcon class="icon" name="shangyizhang" /></div>
        <div class="arrow arrow-next hover-icon" @click="updatePosition(1)"><SvgIcon class="icon" name="xiayizhang" /></div>
        <div class="operate-area">
          <slot name="operate">
            <SvgIcon class="icon hover-icon" name="actionicon" @click="increaseScale" />
            <SvgIcon class="icon hover-icon" name="suoxiao" @click="decreaseScale" />
            <div class="divide" />
            <SvgIcon class="icon hover-icon" name="xuanzhuan" @click="leftRotate" />
            <SvgIcon class="icon hover-icon" name="xuanzhuan-r" @click="rightRotate" />
            <div class="divide" />
            <SvgIcon class="icon hover-icon" name="zhongzhi" @click="onResetClick" />
          </slot>
        </div>
        <transition name="fade">
          <div
            :key="scale"
            :style="scaleTipStyle"
            class="scale-tip">
            {{ ~~(scale * 100) }}%
          </div>
        </transition>
      </div>
    </transition>
    <div v-if="isSlotMode" ref="slotWrapper" @click="handleImgWrapperClick"><slot /></div>
  </div>
</template>

<script>
import Snippet from './components/Snippet'
import SvgIcon from './components/SvgIcon'

import { forbiddenBodyScroll, ALERT, validateNumber } from '../util'

const DEFAULT_MAX_SCALE = 5 // 最大放大比例
const DEFAULT_MIN_SCALE = 0.1 // 最小放大比例
const DEFAULT_STEP = 0.1 // 单次缩放变化的比例
const DEFAULT_ANGLE = 90
const DEFAULT_LOADING_DELAY = 300 // 默认 loading 延迟时间 (ms)
const BASE_SELECTOR = 'img' // 默认选择器
const DEFAULT_FILTER_FUNCTION = () => true // 插槽模式下，默认过滤函数

export default {
  name: 'ImagePreview',
  components: {
    Snippet,
    SvgIcon
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 图片地址
    imageUrls: {
      type: Array,
      default: () => []
    },
    urlMapper: {
      type: Function,
      default: null
    },
    // 起始位置
    startPosition: {
      type: Number,
      default: 0
    },
    maxScale: {
      type: [String, Number],
      default: DEFAULT_MAX_SCALE,
      validator: validateNumber('maxScale')
    },
    minScale: {
      type: [String, Number],
      default: DEFAULT_MIN_SCALE,
      validator: validateNumber('minScale')
    },
    scaleStep: {
      type: [String, Number],
      validator: validateNumber('scaleStep'),
      default: DEFAULT_STEP
    },
    angle: {
      type: [String, Number],
      validator: validateNumber('angle'),
      default: DEFAULT_ANGLE
    },
    includeSelector: {
      type: String,
      default: ''
    },
    excludeSelector: {
      type: String,
      default: ''
    },
    filter: {
      type: Function,
      default: DEFAULT_FILTER_FUNCTION
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    loadingDelay: {
      type: [String, Number],
      default: DEFAULT_LOADING_DELAY,
      validator: validateNumber('loadingDelay')
    }
  },
  data () {
    return {
      isFirstShow: false,
      currentPosition: 0,
      slotModeVisible: false,
      loading: false,
      imgList: [],
      urlList: [],
      scale: 1,
      rotateAngle: 0,
      aspectRatio: 1,
      position: {
        left: 0,
        top: 0
      },
      mouse: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    isSlotMode () {
      return !!this.$slots.default
    },
    innerMaxScale () {
      let maxScale = +this.maxScale
      return Number.isFinite(maxScale) && maxScale >= 1 ? maxScale : DEFAULT_MAX_SCALE
    },
    innerMinScale () {
      let minScale = +this.minScale
      return Number.isFinite(minScale) && minScale <= 1 && minScale > 0 ? minScale : DEFAULT_MIN_SCALE
    },
    innerScaleStep () {
      let scaleStep = +this.scaleStep
      return Number.isFinite(scaleStep) ? scaleStep : DEFAULT_STEP
    },
    innerAngle () {
      let angle = +this.angle
      return Number.isFinite(angle) ? angle : DEFAULT_ANGLE
    },
    // 根据不同用法生成图片列表
    finallyImageList () {
      return this.isSlotMode
        ? this.urlMapper ? this.urlList.map(this.urlMapper) : this.urlList
        : this.imageUrls
    },
    finallyVisible () {
      return this.isSlotMode ? this.slotModeVisible : this.visible
    },
    totalCount () {
      return (this.finallyImageList || []).length
    },
    imgStyle () {
      let { left, top } = this.position
      let styleKey = this.aspectRatio > 1 ? 'max-width' : 'max-height'
      return {
        transform: `translate3d(${left}px, ${top}px, 0) scale(${this.scale}) rotate(${this.rotateAngle}deg)`,
        [styleKey]: '100%'
      }
    },
    scaleTipStyle () {
      let { left, top } = this.position
      return `transform: translate3d(calc(-50% + ${left}px), calc(-50% + ${top}px), 0)`
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler: 'handleVisible'
    },
    slotModeVisible: 'handleVisible',
    startPosition: function (val, old) {
      this.currentPosition = val
    },
    // 切换图片 src 时触发
    currentPosition: 'handleImageSourceChange',
    finallyImageList: 'handleImageSourceChange',

    closeOnPressEscape: {
      immediate: true,
      handler (val, oldVal) {
        if (val) {
          window.addEventListener('keyup', this.handlePressESC)
        }
        // 由 true -> false， 将之前事件解绑掉
        if (oldVal && !val) {
          window.removeEventListener('keyup', this.handlePressESC)
        }
      }
    }
  },
  mounted () {
    if (this.isSlotMode) {
      this.imgList = this.queryImgList()
      this.initImgList()
    }
  },
  beforeDestroy () {
    this.closeOnPressEscape && window.removeEventListener('keyup', this.handlePressESC)
  },
  // 插槽子元素变化时，重新初始化
  updated () {
    if (this.isSlotMode) {
      let newImgList = this.queryImgList()
      let equal = false
      if (this.imgList.length === newImgList.length && this.imgList.length) {
        equal = Array.from(this.imgList).every((img, index) => img === newImgList[index])
      }

      if (!equal) {
        this.imgList = newImgList
        this.initImgList()
      }
    }
  },
  methods: {
    // ==================================== 对外方法 Start =============================================
    rotate (angle) {
      if (typeof angle === 'function') {
        angle = +angle(this.rotateAngle)
      } else {
        angle = +angle
      }
      if (Number.isFinite(angle)) {
        this.rotateAngle = angle
      } else {
        ALERT('rotate方法参数必须为一个数字或函数(如果是函数，则该函数的返回值必须为数字)')
      }
    },
    zoom (zoomRate) {
      if (typeof zoomRate === 'function') {
        zoomRate = +zoomRate(this.scale)
      } else {
        zoomRate = +zoomRate
      }

      if (Number.isFinite(zoomRate)) {
        // 限制缩放范围在“设定范围之内”
        if (zoomRate < this.minScale) {
          this.scale = this.minScale
        } else if (zoomRate > this.maxScale) {
          this.scale = this.maxScale
        } else {
          this.scale = zoomRate
        }
        // console.error(`zoom传入的参数(如果是函数，则为函数的返回值)超过设定的缩放范围，该范围为${this.minScale}~${this.maxScale}`)
      } else {
        ALERT('zoom方法参数必须为一个数字或函数(如果是函数，则该函数的返回值必须为数字)')
      }
    },
    reset () {
      return this.resetImage()
    },
    // ==================================== 对外方法 End =============================================
    /**
     * 根据传入的css选择器筛选，生成最终的选择器
     * 举个例子
     * includeSelector: ".img1, img2"
     * excludeSelector: ".img3, .img4"
     * => ".img1:not(.img3):not(.img4), .img2:not(.img3):not(.img4)"
     */
    parseSelector () {
      const SPLIT_REG = /\s*,\s*/g
      let includeSelectorList = []
      let excludeSelectorList = []
      // 处理传入的css选择器的逗号
      if (this.includeSelector && typeof this.includeSelector === 'string') {
        includeSelectorList = this.includeSelector.split(SPLIT_REG)
      }
      if (this.excludeSelector && typeof this.excludeSelector === 'string') {
        excludeSelectorList = this.excludeSelector.split(SPLIT_REG)
      }
      let selectorList = includeSelectorList.map((selector) => {
        let filterSelector = excludeSelectorList.map(exSelector => `:not(${exSelector})`)
        return BASE_SELECTOR + selector + filterSelector.join('')
      })
      return selectorList.join(', ') || BASE_SELECTOR
    },
    queryImgList () {
      let selector = this.filter === DEFAULT_FILTER_FUNCTION ? this.parseSelector() : BASE_SELECTOR
      let imgList = this.$refs.slotWrapper.querySelectorAll(selector)
      return Array.from(imgList).filter(this.filter)
    },
    initImgList () {
      this.imgList.forEach(img => {
        img.style.cursor = 'zoom-in'
        this.urlList.push(img.src)
      })
    },
    handleImgWrapperClick (e) {
      if (e.target.tagName === 'IMG') {
        let index = Array.from(this.imgList).findIndex(img => img === e.target)

        if (index < 0) return

        this.slotModeVisible = true
        this.currentPosition = index
        this.resetImage()
      }
    },
    resetImage () {
      this.scale = 1
      this.rotateAngle = 0
      this.position = {
        left: 0,
        top: 0
      }
    },
    handleVisible (visible) {
      if (visible) {
        if (!this.isFirstShow) {
          this.handleFirstVisible()
        }
        this.restoreBody = forbiddenBodyScroll()
      } else {
        this.restoreBody && this.restoreBody()
      }
    },
    handleFirstVisible () {
      // dom渲染后，将其插入body中
      this.isFirstShow = true
      this.$nextTick(() => {
        // 避免 fixed 被祖先元素的 transform 等属性影响定位
        // refer: https://github.com/chokcoco/iCSS/issues/24
        document.body.appendChild(this.$refs.imagePreview)

        // loading
        this.handleImageSourceChange()
      })
    },
    initAspectRatio (e) {
      let width = e.target.offsetWidth
      let height = e.target.offsetHeight
      this.aspectRatio = width / height
    },
    handleImageLoad (e) {
      this.initAspectRatio(e)
      this.hideLoading()
      this.$emit('imageLoad')
    },
    updatePosition (next) {
      const _next = this.currentPosition + next
      if (_next >= this.finallyImageList.length) {
        this.currentPosition = 0
      } else if (_next < 0) {
        this.currentPosition = this.finallyImageList.length - 1
      } else {
        this.currentPosition = _next
      }
      this.resetImage()
    },
    handleImageSourceChange () {
      // 等待 dom 渲染之后再取 complete 属性
      this.$nextTick(() => {
      // 加载未缓存图片时，开启 loading
        if (this.$refs.image && !this.$refs.image.complete) {
          this.showLoading()
        }
      })
    },
    showLoading () {
      clearTimeout(this.loadingTimer)
      this.loadingTimer = setTimeout(() => {
        this.loading = true
      }, this.loadingDelay)
    },
    hideLoading () {
      clearTimeout(this.loadingTimer)
      this.loading = false
    },
    leftRotate () {
      if (!this.loading) {
        this.rotateAngle -= this.innerAngle
      }
    },
    rightRotate () {
      if (!this.loading) {
        this.rotateAngle += this.innerAngle
      }
    },
    increaseScale () {
      !this.loading && this.zoom(scale => (scale + this.innerScaleStep).toFixed(1))// 处理精度丢失
    },
    decreaseScale () {
      !this.loading && this.zoom(scale => (scale - this.innerScaleStep).toFixed(1)) // 处理精度丢失
    },
    onResetClick () {
      !this.loading && this.reset()
    },
    // 图片拽拉
    handleImageMouseDown (e) {
      this.mouse = {
        x: e.clientX,
        y: e.clientY
      }
      window.addEventListener('mousemove', this.handleImageMouseMove)
      window.addEventListener('mouseup', this.handleImageMouseUp)
    },
    handleImageMouseMove (e) {
      // 移动event的坐标
      let { clientX, clientY } = e
      // 鼠标按下时记录的坐标
      let { x, y } = this.mouse
      // 偏移后的位置
      let deltaX = clientX - x + this.position.left
      let deltaY = clientY - y + this.position.top
      this.mouse = {
        x: clientX,
        y: clientY
      }
      this.position = {
        left: deltaX,
        top: deltaY
      }
    },
    handleImageMouseUp (e) {
      window.removeEventListener('mousemove', this.handleImageMouseMove)
      window.removeEventListener('mouseup', this.handleImageMouseUp)
    },
    // 滚轮缩放
    wheelScale (e) {
      const RATIO = 35 // 实际缩放与缩放偏移量的系数
      let computedScale = this.scale - (e.deltaY / RATIO)
      this.scale = computedScale >= this.innerMinScale ? computedScale <= this.innerMaxScale ? computedScale : this.innerMaxScale : this.innerMinScale
    },
    close () {
      if (this.isSlotMode) {
        this.slotModeVisible = false
      } else {
        this.$emit('update:visible', false)
      }
      this.resetImage()
    },
    handlePressESC (e) {
      let { keyCode, code } = e
      if (this.finallyVisible && (keyCode === 27 || code === 'Escape')) {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
