export function forbiddenBodyScroll () {
  let scrollBarWidth = window.innerWidth - document.documentElement.offsetWidth
  let scrollBarHeight = window.innerHeight - document.documentElement.offsetHeight
  if (scrollBarWidth || scrollBarHeight) {
    document.body.style.overflow = 'hidden'
    // 给 body 添加边距防止抖动
    const { style } = document.body
    let { paddingRight, paddingBottom } = getComputedStyle(document.body)

    let initPaddingRight = style.paddingRight
    let initPaddingBottom = style.paddingBottom

    if (scrollBarWidth) {
      paddingRight = parseInt(paddingRight) || 0
      document.body.style.paddingRight = paddingRight + scrollBarWidth + 'px'
    }
    if (scrollBarHeight) {
      paddingBottom = parseInt(paddingBottom) || 0
      document.body.style.paddingBottom = paddingBottom + scrollBarHeight + 'px'
    }

    return function restoreBodyScroll () {
      document.body.style.overflow = ''
      document.body.style.paddingRight = initPaddingRight
      document.body.style.paddingBottom = initPaddingBottom
    }
  } else {
    return function () {}
  }
}
