# Vue-img-viewer


[![npm version](https://img.shields.io/npm/v/vue-img-viewer.svg?style=flat-square)](http://badge.fury.io/js/vue-img-viewer)
[![npm license](https://img.shields.io/npm/l/vue-img-viewer.svg?style=flat-square)](http://badge.fury.io/js/vue-img-viewer)

基于 Vue 的轻量级图片预览组件

![demo](/static/demo.gif)

- [更新日志](#更新日志)
- [前提条件](#%e5%89%8d%e6%8f%90%e6%9d%a1%e4%bb%b6)
- [安装](#%e5%ae%89%e8%a3%85)
  - [npm](#npm)
- [用法](#%e7%94%a8%e6%b3%95)
- [Example](#example)
  - [1. 插槽模式](#1-%e6%8f%92%e6%a7%bd%e6%a8%a1%e5%bc%8f)
  - [2. 自定义模式](#2-%e8%87%aa%e5%ae%9a%e4%b9%89%e6%a8%a1%e5%bc%8f)
  - [3. 支持自定义底部操作栏和 loading](#3-%e6%94%af%e6%8c%81%e8%87%aa%e5%ae%9a%e4%b9%89%e5%ba%95%e9%83%a8%e6%93%8d%e4%bd%9c%e6%a0%8f%e5%92%8c-loading)
  - [Props](#props)
  - [Methods](#methods)
  - [Slots](#slots)
- [License](#license)

# 更新日志
- [CHANGELOG](/CHANGELOG.md)

> 生成的 changelog 因为曾经 rebase 的原因导致发布日期展示有误，暂时忽略...

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

`template`
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
`script`
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

## 3. 支持自定义底部操作栏和 loading

`template`
```html
<image-preview  ref="imgPreview">
  <img
    v-for="(img, index) in imageUrls"
    :key="index"
    :src="img"
    class="img"
    style="width: 100px; height: 100px; margin-right: 10px;">
  <!-- 自定义底部操作栏 -->
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
  <!-- 自定义 loading -->
  <span slot="loading" slot-scope="{ loading }">
    <!-- 此处是你的 loading 组件 -->
    <Loading v-if="loading">loading</Loading>
  </span>
</image-preview>
```
`script`
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

| prop <div style="width: 135px"></div> | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `visible.sync`    | 控制显隐。常规模式可用，插槽模式无效            | `Boolean`       |   `false`       |
| `imageUrls`        | url集合。常规模式可用，插槽模式无效            | `Array`    | `[ ]`       |
| `urlMapper` | 预览 `url` 转换函数, 当缩略图 `url` 和预览图 `url` 不一致时，可用此函数转换。<br> 该函数接受缩略图 `url` 和预览下标 `index` 两个参数，返回的新值则作为预览图的 `url`。 <br>仅在插槽模式有效。 | `Function` <br> `(url: string, index: number): string` | `null` |
| `maxScale`         | 最大缩放比例, `5` 代表 5倍、500%, 不得小于1             | `Number`    | `5`         |
| `minScale`         | 最小缩放比例, `0.1` 代表 0.1倍、10%, 不得大于1          | `Number`   | `0.1`            |
| `scaleStep`        | 单次缩放的比例（放大、缩小按钮）, 0.1 代表 每次变化0.1倍，变化10% | `Number`  | `0.1` |
| `angle`         | 单次旋转的角度，默认90度 | `Number` | `90`            |
| `include-selector` | css 选择器筛选指定图片，插槽模式下有效。<br> eg: `include-selector = ".my-img"` 实际筛选则为 `img.my-img`    | `String`  | `''` |
| `exclude-selector` | css 选择器过滤指定图片，插槽模式下有效。<br> eg: `exclude-selector = ".other-img"` 实际筛选则为 `img:not(.other-img)` | `String` | `''` |
| `filter`   | 同 `Array.prototype.filter`的回调函数，插槽模式下有效。<br> 过滤 `image dom` 集合，此参数存在时，`includeSelector` 和 `excludeSelector` 无效。 | `Function` <br> `(image: HTMLImageElement): boolean`   | `() => true` |
| `close-on-press-escape` | 按 `ESC` 键是否关闭弹窗 | `Boolean` | `false` |
| `loading-delay` | 在图片加载完成之前展示 loading。此参数可控制 loading 展示的延时。<br> 如果图片在短时间内就加载完成，loading 刚显示就会瞬间消失，导致视觉上的闪动，用户体验不友好。<br> 而通过此参数可以控制 loading 显示的延迟。假设图片在设置的延时时间之内就加载完成，则不会展示 loading，超过延时时间且图片未加载完，才会展示 loading。<br> 默认为 300ms，建议设置一个合理的时间，如不需要可设置为 0。 | `Number` | `300` |

## Methods
| 方法名 | 类型 | 描述 |
| :--- | --- | --- |
| `rotate` | `rotate(angle: number \| string \| ((oldAngle: number) => number \| string)): void` | 旋转至指定角度。支持传入 `Number` 、`字符串数字`以及 `Function` (如果是函数，则该函数第一个参数为旋转前的角度), 该函数需要返回一个数字或者字符串数字，代表最终需旋转的角度。
| `zoom` | `zoom(angle: number \| string \|((oldScale: number) => number \| string)): void` | 缩放到指定比例。支持传入 `Number` 、`字符串数字`以及 `Function` (如果是函数，则该函数第一个参数为缩放前的比例), 该函数需要返回一个数字或者字符串数字，代表最终缩放的比例。
| `reset` | `reset():void` | 重置到原始状态

## Slots
| 插槽名 | 插槽参数 <div style="width: 135px"></div> |  描述 |
| :--- | --- | --- |
| `default` | -  | 插槽模式下可用，可传入任意 `dom` 结构，会自动识别其内部 `img` 标签并添加对应事件
| `operate` | - | 自定义底部操作栏
| `extraOperate` | - | 在已有底部操作的后面添加额外操作
| `loading` |`loading: boolean`| 自定义 loading，该插槽只能有一个根元素。


# License

[The MIT License](http://opensource.org/licenses/MIT)
