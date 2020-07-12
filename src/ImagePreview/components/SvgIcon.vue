<template>
  <svg class="svg-icon" aria-hidden="true" @click="handleClick">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import 'https://at.alicdn.com/t/font_1239600_7r0qv8bues.js'
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.name}`
    }
  },
  methods: {
    handleClick () {
      this.$listeners.click && this.$listeners.click()
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
