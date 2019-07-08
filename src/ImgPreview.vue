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
          <!-- draggable: false 禁止 chrome 拖拽图片 -->
          <img
            :src="finallyImageList[currentPosition]"
            :alt="`图片${currentPosition + 1}`"
            :style="imgStyle"
            class="image"
            draggable="false"
            @load="initAspectRatio"
            @mousedown="handleImageMouseDown"
            @wheel="wheelScale">
        </div>
        <div class="pos-tip">{{ currentPosition + 1 }} / {{ totalCount }}</div>
        <div class="close hover-icon" @click="close"><i class="iconfont icon-guanbi"></i></div>
        <div class="arrow arrow-prev hover-icon" @click="updatePosition(-1)"><i class="iconfont icon-shangyizhang"></i></div>
        <div class="arrow arrow-next hover-icon" @click="updatePosition(1)"><i class="iconfont icon-xiayizhang"></i></div>
        <div class="operate-area">
          <i class="iconfont icon-actionicon hover-icon" @click="increaseScale"></i>
          <i class="iconfont icon-suoxiao hover-icon" @click="decreaseScale"></i>
          <div class="divide"></div>
          <i class="iconfont icon-xuanzhuan hover-icon" @click="rotate -= innerAngle"></i>
          <i class="iconfont icon-xuanzhuan-r hover-icon" @click="rotate += innerAngle"></i>
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
    <div v-if="isSlotMode" ref="slotWrapper" @click="handleImgWrapperClick"><slot></slot></div>
  </div>
</template>

<script>

const DEFAULT_MAX_SCALE = 5 // 最大放大比例
const DEFAULT_MIN_SCALE = 0.1 // 最小放大比例
const DEFAULT_STEP = 0.1 // 单次缩放变化的比例
const DEFAULT_ANGLE = 90
const BASE_SELECTOR = 'img' // 默认选择器
const DEFAULT_FILTER_FUNCTION = () => true // 插槽模式下，默认过滤函数

export default {
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
    // 起始位置
    startPosition: {
      type: Number,
      default: 0
    },
    maxScale: {
      type: [String, Number],
      default: DEFAULT_MAX_SCALE,
      validator (val) {
        let result = Number.isFinite(+val)
        if (!result) console.error('prop maxScale 必须为Number类型或者数字字符串')
        return result
      }
    },
    minScale: {
      type: [String, Number],
      default: DEFAULT_MIN_SCALE,
      validator (val) {
        let result = Number.isFinite(+val)
        if (!result) console.error('prop minScale 必须为Number类型或者数字字符串')
        return result
      }
    },
    scaleStep: {
      type: [String, Number],
      validator (val) {
        let result = Number.isFinite(+val)
        if (!result) console.error('prop scaleStep 必须为Number类型或者数字字符串')
        return result
      },
      default: DEFAULT_STEP
    },
    angle: {
      type: [String, Number],
      validator (val) {
        let result = Number.isFinite(+val)
        if (!result) console.error('prop angle 必须为Number类型或者数字字符串')
        return result
      },
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
    }
  },
  data () {
    return {
      isFirstShow: false,
      currentPosition: 0,
      slotModeVisible: false,
      imgList: [],
      urlList: [],
      scale: 1,
      rotate: 0,
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
      return this.isSlotMode ? this.urlList : this.imageUrls
    },
    finallyVisible () {
      return this.isSlotMode ? this.slotModeVisible : this.visible
    },
    totalCount () {
      return (this.finallyImageList || []).length
    },
    imgStyle () {
      let {left, top} = this.position
      let styleKey = this.aspectRatio > 1 ? 'max-width' : 'max-height'
      return {
        transform: `translate3d(${left}px, ${top}px, 0) scale(${this.scale}) rotate(${this.rotate}deg)`,
        [styleKey]: '100%'
      }
    },
    scaleTipStyle () {
      let {left, top} = this.position
      return `transform: translate3d(calc(-50% + ${left}px), calc(-50% + ${top}px), 0)`
    }
  },
  watch: {
    visible (visible) {
      if (visible) {
        if (!this.isFirstShow) {
          this.handleFirstVisible()
        }
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    slotModeVisible (visible) {
      if (visible) {
        if (!this.isFirstShow) {
          this.handleFirstVisible()
        }
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    startPosition: function (val, old) {
      this.currentPosition = val
    }
  },
  mounted () {
    if (this.isSlotMode) {
      this.imgList = this.queryImgList()
      this.initImgList()
    }
    window.addEventListener('keyup', this.handlePressESC)
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.handlePressESC)
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
        let fitlerSelector = excludeSelectorList.map(exSelector => `:not(${exSelector})`)
        return BASE_SELECTOR + selector + fitlerSelector.join('')
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
      this.rotate = 0
      this.position = {
        left: 0,
        top: 0
      }
    },
    handleFirstVisible () {
      // dom渲染后，将其插入body中
      this.isFirstShow = true
      this.$nextTick(() => {
        // 避免 fixed 被祖先元素的 transform 等属性影响定位
        // refer: https://github.com/chokcoco/iCSS/issues/24
        document.body.appendChild(this.$refs.imagePreview)
      })
    },
    initAspectRatio (e) {
      let width = e.target.offsetWidth
      let height = e.target.offsetHeight
      this.aspectRatio = width / height
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
    increaseScale () {
      if (this.scale < this.innerMaxScale) {
        this.scale = +(this.scale + this.innerScaleStep).toFixed(1) // 处理精度丢失
      }
    },
    decreaseScale () {
      if (this.scale > this.innerMinScale) {
        this.scale = +(this.scale - this.innerScaleStep).toFixed(1) // 处理精度丢失
      }
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
      let {clientX, clientY} = e
      // 鼠标按下时记录的坐标
      let {x, y} = this.mouse
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
      let {keyCode, code} = e
      if (this.visible && (keyCode === 27 || code === 'Escape')) {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.25s;
}

.fade-in-enter,
.fade-in-leave-to {
  opacity: 0;
}

.preview-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  user-select: none;
  z-index: 10000;

  .image-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    z-index: 0;

    .image {
      border-radius: 4px;
      cursor: move;
      will-change: transform;
    }
  }

  .pos-tip {
    position: absolute;
    top: 48px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 15px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.15);
    color: #fff;
  }

  .hover-icon {
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.15s;
    cursor: pointer;

    &:hover {
      color: rgba(255, 255, 255, 0.95);
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    padding: 10px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.15);

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }

    .iconfont {
      font-size: 23px;
      font-weight: bold;
    }
  }

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: 40px 20px;
    text-align: center;

    &:hover {
      background-color: #3d3d3d;
    }

    &-prev {
      left: 0;
    }

    &-next {
      right: 0;
    }

    .iconfont {
      font-size: 32px;
      font-weight: bold;
    }
  }

  .operate-area {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24px 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
    color: rgba(51, 51, 51, 0.4);

    .iconfont {
      font-size: 24px;

      & + .iconfont {
        margin-left: 24px;
      }
    }

    .divide {
      display: inline-block;
      width: 1px;
      height: 20px;
      background-color: #d8d8d8;
      border-radius: 1px;
      margin: 0 24px;
      opacity: 0.5;
    }
  }

  .scale-tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    padding: 8px 15px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #d8d8d8;
    opacity: 0;
    pointer-events: none;
  }

  .fade-enter-active {
    transition: opacity 1.5s;
  }

  .fade-enter {
    opacity: 1;
  }
}
</style>
