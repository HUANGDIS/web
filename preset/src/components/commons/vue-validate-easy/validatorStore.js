
let validatorStore = {
  ip(val) {
    if (!/^(25[0-5]|2[0-4]\d|1\d\d|[1-9][0-9]|[1-9])\.(25[0-5]|2[0-4]\d|1\d\d|[1-9][0-9]|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9][0-9]|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9][0-9]|\d)$/.test(val)) {
      return "ip格式错误"
    }
  }
}

export default {
  getValidator(name) {
    if (!validatorStore[name]) throw `没有名${name}的验证方法`
    return validatorStore[name]
  },
  addValidator(name, validator) {
    validatorStore[name] = validator
  }
}