// confirmPlugin.js
import Confirm from './src/confirm.vue'



const confirmPlugin = {
  install(Vue) {
    let confirm = Vue.extend(Confirm)
    Vue.prototype.$vConfirm = function (options) {
      if (options === null || options === undefined) {
        options = {
          message: ''
        }
      } else if (typeof options === 'string' || typeof options === 'number') {
        options = {
          message: options
        }
      }
      options.width = options.width ? options.width : '400px'
      options.height = options.height ? options.height : '190px'
      options.left = (document.documentElement.clientWidth - parseInt(options.width)) / 2 + 'px'
      options.top = (document.documentElement.clientHeight - parseInt(options.height)) * 2 / 5 + 'px'

      var evtArr;
      if (arguments.length === 2) {
        evtArr = {
          confirm: arguments[1]
        }
      } else if (arguments.length === 3) {
        evtArr = {
          confirm: arguments[1],
          cancel: arguments[2]
        }
      }

      let component = new confirm({
        data: options,
        methods: evtArr
      })
      // let instance = new confirm({ propsData: options })
      document.body.appendChild(component.$mount().$el)
    }
  }
}

export default confirmPlugin
