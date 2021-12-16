// 第三方插件引入
import Vue from 'vue'
// import Vue from 'vue/dist/vue.esm.js'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ConfirmPlugin from "./components/commons/confirm";


Vue.use(ConfirmPlugin)
Vue.use(ElementUI);


// 业务组件导入
import editpopover from './components/commons/editpopover/main.vue'



// 工具类(.js)导入
import utils from './utils/utils.js'
import enums from './utils/enum.js'
import vConform from './components/commons/confirm/index.js'


// import { util } from 'vue/types/umd'
// Vue.config.productionTip = false


// 注册全局组件
Vue.component('editpopover', editpopover)



// 添加Vue原型方法
Vue.prototype.utils = utils
Vue.prototype.enums = enums
// Vue.prototype.$vConfirm = vConform
// let haslogin = false
async function singleLogin() {
  if (window.location.search.split('?').length > 1 && window.location.search.split('?')[1].split('=').length > 1) {
    if (window.location.search.split('?')[1].split('=')[1]) {
      // 设置标志位，避免令牌失效导致无限循环调用
      haslogin = true
      // 临时token登录
      let index = window.location.search.split('&')[0].indexOf('=')
      let token = window.location.search.split('&')[0].slice(index + 1)
      let needRecheck = false

      let result = await new Promise((resolve, reject) => {
        ser.get('/system/user/info?a_t=' + encodeURIComponent(token), { handErrorSelf: true }).then((res) => {
          resolve(res)
        }).catch((err) => {
          resolve(err)
        })
      })
      if (result && result.status === 200) {
        localStorage.setItem('localuserdata', JSON.stringify(result.data))
        sessionStorage.setItem('localuserdata', JSON.stringify(result.data))
        localStorage.setItem('sessonId', result.data.sessonId ? res.data.sessonId : token)
        sessionStorage.setItem('sessonId', result.data.sessonId ? res.data.sessonId : token)
        store.commit('updateSessonId', result.data.sessonId ? res.data.sessonId : token)
        store.commit('updateUserData', result.data)
        utils.initWebSocket()
      }
      if (result && result.status === 401) {
        await ser.get('/system/user/info').then((res) => {
          if (res.status === 200) {
            localStorage.setItem('localuserdata', JSON.stringify(res.data))
            sessionStorage.setItem('localuserdata', JSON.stringify(res.data))
            localStorage.setItem('sessonId', token)
            sessionStorage.setItem('sessonId', token)
            store.commit('updateSessonId', token)
            store.commit('updateUserData', res.data)
            utils.initWebSocket()
          }
        })
      }
    }
  }
}


// 解析ui_config.xml全局默认配置
// let uiConfig
// if (process.env.NODE_ENV === 'production') {
//   uiConfig = getConfigXml('')
// } else {
//   uiConfig = getConfigXml()
// }

// store.commit('updateConf', uiConfig)



// 路由设置
// router.beforeEach((to, from, next) => {
//   if (!haslogin && to.fullPath === '/login' && from.fullPath === '/' && window.location.href.split('?').length > 1) {
//     singleLogin().then(() => {
//       // 单点登录获取用户信息成功
//       if (store.state.userData && store.state.userData.roleType && store.state.userData.roleType === 'SEC_AUD') {
//         window.location.href = '/#/homes/task'
//       } else {
//         window.location.href = '/#/homes/mains'
//       }
//     })
//     return
//   } else if (to.matched.length === 0) {
//     from.path ? next({ path: from.path }) : next('/')
//   } else {
//     if (to.matched.length === 3 && from.path === '/' && from.fullPath === '/' && from.matched.length === 0) {
//       // f5刷新时，首先会匹配一次路由，这里删除路由以免view更新发送多余请求
//       to.query.d = 1 //更改query以更改URl，便于检测厚点点击tree时的url更新变动
//       // to.matched[2].components = {}
//     }
//     if (to.matched.length === 2 && to.matched[to.matched.length - 1].path.split('/')[to.matched[to.matched.length - 1].path.split('/').length - 1] === ':id') {
//       // 匹配的第二个路由没有匹配到第三个tab的情况特殊解决
//       next({ path: to.matched[to.matched.length - 1].path.replace('/:id') })
//     } else if (to.matched.length === 1 && to.matched[0].path === '/homes') {
//       // 
//       next()
//     } else {
//       next()
//     }
//   }
// })

// router.afterEach((to, from) => {
//   // 
// })

// router.onError((error) => {

// })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
