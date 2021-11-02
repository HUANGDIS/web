import validate from './validate'
import validateAll from './validateAll'
import validatorStore from './validatorStore'
import fromElements from './formElements'
import errTip from './errTip'

var vueValidateEasy = {};
vueValidateEasy.install = function (Vue, options) {

  Vue.prototype.V = {}

  Vue.prototype.V.$validateSingle = async function (directiveEl, value) {
    return await validate(directiveEl, value)
  }
  /**
   * 新增验证方法
   * @param {String|Object} param
   * String类型时，为方法名，此时第二个参数是必须得
   * Object类型时， 为批量新增验证方法，此时第二个参数不需要传
   * @param {function} validator
   */
  Vue.prototype.V.$addValidateMethod = function (param, validator) {
    if ((typeof param).toLowerCase() === 'object') { //name代表合并一个对象 {a(){},b(){}}
      for (let name in param) {
        validatorStore.addValidator(name, param[name])
      }
    } else {
      validatorStore.addValidator(param, validator)
    }
  };
  /**
   * 扩展元素移除验证方法
   */
  Vue.prototype.V.$removeRules = function (directiveEl) {
    if (!directiveEl.binding.value) {
      return
    }
    directiveEl.binding.value = null
    errTip.resetSingleErrorTip(directiveEl)
  }
}