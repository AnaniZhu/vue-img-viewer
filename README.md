# Vue-img-viewer


[![npm version](https://img.shields.io/npm/v/vue-img-viewer.svg?style=flat-square)](http://badge.fury.io/js/vue-img-viewer)
[![npm license](https://img.shields.io/npm/l/vue-imgPreview.svg?style=flat-square)](http://badge.fury.io/js/vue-img-viewer)

基于 Vue 的轻量级图片预览组件

![demo](/static/demo.gif)


# 前提条件

- [Vue.js](https://github.com/vuejs/vue) `2.3.0+`


# 安装

## npm

```bash

$ npm i vue-img-viewer -S

```

# 用法

main.js:

```javascript

import Vue from 'vue'
import App from './App.vue'
import ImagePreview from 'vue-img-viewer'

Vue.use(ImagePreview)

new Vue({
  el: '#app',
  components: {
    App
  }
})
```

# Example

## 1. 插槽模式

> 此模式将图片作为slot， 组件将会自动识别内部图片并添加点击事件预览, 显隐由组件内部控制，此模式可传递缩放相关的Props。
>
> 此模式简单易用，绝大部分简单场景可以直接使用该模式


template
```html
  <!-- 过滤方式： includeSelector、excludeSelector过滤  -->
  <h4 class="mb16">includeSelector 和 excludeSelector过滤</h4>
  <image-preview
    max-scale="3"
    min-scale="0.6"
    scale-step="0.2"
    include-selector=".img , .s-img"
    exclude-selector=".img2 , .img3">
      <img
        v-for="(img, index) in imageUrls"
        :key="index"
        :src="img"
        :class="['img', index > 1 ? `img${index}` : '']"
        style="width: 100px; height: 100px; margin-right: 10px;">
      <img
        v-for="(img, index) in imageUrls"
        :key="imageUrls.length + index"
        :src="img"
        :class="['s-img', index > 1 ? `img${index}` : '']"
        style="width: 100px; height: 100px; margin-right: 10px;">
  </image-preview>

  <!-- 过滤方式：filter 函数 -->
  <h4 class="mb16">filter 函数过滤</h4>
  <image-preview
    max-scale="2"
    min-scale="0.5"
    scale-step="0.1"
    angle="45"
    :filter="filter">
      <img
        v-for="(img, index) in imageUrls"
        :key="index"
        :src="img"
        :class="['img', index > 1 ? `img${index}` : '']"
        style="width: 100px; height: 100px; margin-right: 10px;">
      <img
        v-for="(img, index) in imageUrls"
        :key="imageUrls.length + index"
        :src="img"
        :class="['s-img', index > 1 ? `img${index}` : '']"
        style="width: 100px; height: 100px; margin-right: 10px;">
  </image-preview>
```
script
```js

export default {
  data () {
    return {
      imageUrls: [
        'https://images.unsplash.com/photo-1536420111820-d84dee5c90c5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d76602c3cafa0599d42cfdf255c5eb8d&auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1536484049453-85de4ea3db6a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=902f2f3c5fbf8d85a2643ae073f39d39&auto=format&fit=crop&w=1222&q=80',
        'https://images.unsplash.com/photo-1536420095395-a592ce76a37e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=986b742530a59130ea65a65ea461653d&auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1536420124982-bd9d18fc47ed?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2d98a0cbfe7514bbe11cbd95ba2554f7&auto=format&fit=crop&w=701&q=80'
      ],
    }
  },
  methods: {
    filter (img, index) {
      return index > 2 && index < 5
    }
  }
}

```


## 2. 自定义模式

> 此模式需自定义传递图片url集合，自己控制显隐，扩展性强，适用于自定义较强的场景

template
```html
<template>
  <template v-for="(img, index) in imageUrls">
    <img
      :key="index"
      :src="img"
      style="width: 100px; height: 100px; margin-right: 10px;"
      @click="handleImgPreview(index)">
  </template>
  <image-preview
    :image-urls="imageUrls"
    :visible.sync="visible"
    :start-position="startPosition"></image-preview>
</template>
```
script
```js
export default {
  data () {
    return {
      visible: false,
      startPosition: 0,
      imageUrls: [
        'https://images.unsplash.com/photo-1536420111820-d84dee5c90c5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d76602c3cafa0599d42cfdf255c5eb8d&auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1536484049453-85de4ea3db6a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=902f2f3c5fbf8d85a2643ae073f39d39&auto=format&fit=crop&w=1222&q=80',
        'https://images.unsplash.com/photo-1536420095395-a592ce76a37e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=986b742530a59130ea65a65ea461653d&auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1536420124982-bd9d18fc47ed?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2d98a0cbfe7514bbe11cbd95ba2554f7&auto=format&fit=crop&w=701&q=80'
      ],
    }
  },
  methods: {
    handleImgPreview (index) {
      this.visible = true
      this.startPosition = index
    }
  }
}

```

## 支持自定义底部操作栏插槽

template
```html
<image-preview  ref="imgPreview">
  <img
    v-for="(img, index) in imageUrls"
    :key="index"
    :src="img"
    class="img"
    style="width: 100px; height: 100px; margin-right: 10px;">
  <span slot="operate">
    <!-- 旋转 -->
    <button @click="$refs.imgPreview.rotate(30)">旋转 30 度</button>
    <button @click="rotateExtraAngle">根据已有角度增加 30 度</button>
    <!-- 缩放 -->
    <button @click="$refs.imgPreview.zoom(2)">放大至 2 倍</button>
    <button @click="zoom"> 在自身基础上放大 50% </button>
    <!-- 重置回原始状态 -->
    <button @click="$refs.imgPreview.reset()">重置</button>
  </span>
</image-preview>
```
script
```js
export default {
  data () {
    return {
      imageUrls: [
        'https://images.unsplash.com/photo-1536420111820-d84dee5c90c5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d76602c3cafa0599d42cfdf255c5eb8d&auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1536484049453-85de4ea3db6a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=902f2f3c5fbf8d85a2643ae073f39d39&auto=format&fit=crop&w=1222&q=80',
        'https://images.unsplash.com/photo-1536420095395-a592ce76a37e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=986b742530a59130ea65a65ea461653d&auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1536420124982-bd9d18fc47ed?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2d98a0cbfe7514bbe11cbd95ba2554f7&auto=format&fit=crop&w=701&q=80'
      ],
    }
  },
  methods: {
    rotateExtraAngle () {
      // angle 为旋转前的角度
      return this.$refs.imgPreview.rotate(angle => angle + 30)
    },
    zoom () {
      // scale 为缩放前的比例
      return this.$refs.imgPreview.zoom(scale => scale * 1.5)
    }
  }
}

```

## Props

| prop | 描述 | 类型 | 默认值 |
| :--- | --- | --- | --- |
| `visible.sync`     | 控制显隐。常规模式可用，插槽模式无效            | `Boolean`       |   `false`       |
| `imageUrls`        | url集合。常规模式可用，插槽模式无效            | `Array`    | `[ ]`       |
| `maxScale`         | 最大缩放比例, 5 代表 5倍、500%, 不得小于1             | `Number`    | `5`         |
| `minScale`         | 最小缩放比例, 0.1 代表 0.1倍、10%, 不得大于1          | `Number`   | `0.1`            |
| `scaleStep`        | 单次缩放的比例（放大、缩小按钮）, 0.1 代表 每次变化0.1倍，变化10% | `Number`  | `0.1` |
| `angle`         | 单次旋转的角度，默认90度 | `Number` | `90`            |
| `include-selector` | css 选择器筛选指定图片，插槽模式下有效。<br> eg: include-selector = ".my-img" 实际筛选则为 img.my-img    | `String`  | `''` |
| `exclude-selector` | css 选择器过滤指定图片，插槽模式下有效。<br> eg: exclude-selector = ".other-img" 实际筛选则为 img:not(.ohter-img) | `String` | `''` |
| `filter`   | 同 `Array.prototype.filter` 函数，插槽模式下有效。<br> 过滤 imageList 集合，此参数存在时，includeSelector 和 excludeSelector 无效。 | `Function`   | `() => true` |
| `close-on-press-escape` | 按ESC键是否关闭弹窗 | `Boolean` | `false` |

## Methods
| 方法名 | 类型 | 描述 |
| :--- | --- | --- |
| `rotate` | `rotate(angle: number \| string \| Function):number \| string` | 旋转至指定角度。支持传入 `Number` 、`字符串数字`以及 `Function`(如果是函数，则该函数第一个参数为旋转前的角度), 该函数需要返回一个数字或者字符串数字，代表最终需旋转的角度。
| `zoom` | `zoom(angle: number \| string \| Function):number \| string` | 缩放到指定比例。支持传入 `Number` 、`字符串数字`以及 `Function`(如果是函数，则该函数第一个参数为缩放前的比例), 该函数需要返回一个数字或者字符串数字，代表最终缩放的比例。
| `reset` | `reset():void` | 重置到原始状态

## Slots
| 插槽名 | 描述 |
| :--- | --- |
| `default` | 插槽模式下可用，可传入任意 dom 结构，会自动识别其内部 `img` 标签并添加对应事件
| `operate` | 自定义底部操作栏


# License

[The MIT License](http://opensource.org/licenses/MIT)
