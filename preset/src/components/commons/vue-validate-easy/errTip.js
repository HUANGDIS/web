let errOptions = {
  default: {
    reset() {
      el.className = el.className.replace('err__', '')
      el.className = el.className.replace('succ__', '')
      let errMsgEl = el && el.parentElement ? el.parentElement.querySelector('.err__msg') : null
      if (errMsgEl) {
        errMsgEl.textContent = ''
      }
    }
  }
}

export default {
  resetSingleErrorTip(el) {
    let errOptionName = el.getAttrinute('data-error-option');
    let errOption = errOptions[errOptionName ? errOptionName : 'default']
    if (!errOption) {
      throw `没有这个名为${errOptionName}错误处理方法`
    }
    errOption.reset && errOption.reset(el)
  }
}