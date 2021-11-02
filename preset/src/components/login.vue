<template>
  <div class="loginWrap">
    <form class="form-horizontal" role="form">
      <!-- 用户名 -->
      <div class="row">
        <div class="col-xs-12">
          <input placeholder="用户名" ref="username" 
            v-model="userName"
            class=""
            name="username"
            data-type="input"
            data-scope="loginForm"
            v-validate-easy="rules.username">
        </div>
      </div>
      <!--  -->
       <div class="row">
        <div class="col-xs-12" style="position:relative">
          <input placeholder="密码" ref="password" 
            v-model="password"
            :type="showPassword?'text':'password'"
            class=""
            name="password"
            data-type="input"
            data-scope="loginForm"
            v-validate-easy="rules.password"
            @keypress="keyPress($event,'password')"
            @keyup="keyUp($event,'password')"
            @blur="hideTip()">
            <!-- 密码是否可见 -->
            <span :class="['eye-span',showPassword?'icon-display':'icon-hide']"
              @mousedown="mousedownFun"
              @mouseup="mouseuoFun"
              @mouseleave="mouseleaveFun"
            ></span>
        </div>
        <!-- 开始大写锁定提示 -->
        <div class="info" v-show="capitalTip">
          <span>{{'大写锁定已开启'}}</span>
        </div>
      </div>
      <!-- 验证码 -->
      <div class="row" style="showCaptcha">
        <div class="col-xs-12">
          <input name="captcha" v-model="captcha" class="" placeholder="验证码" type="text">
          <span class="">
            <img src="captchaSrc" @click="changeImg" :alt="验证码">
          </span>
        </div>
      </div>
      <!-- 登录按钮 -->
      <div class="row">
        <div class="col-xs-12">
          <button class="" @click="login">{{'登录'}}</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data(){
    return{
      showPassword: false,
      userName:'',
      password: '',
      // 验证码可见性
      showCaptcha: false,
      // 验证码内容
      captcha: '',
      // 验证码图片地址
      captchaSrc: '',
      rules:{
        username:[
          ['required','用户名不能为空']
        ],

      },
      capitalTip:false,
      capital: false,
    }
  },
  methods:{
    // 控制密码可见性
    mousedownFun(e){
      if(e.button === 0){
        this.showPassword = true
      }
    },
    mouseuoFun(e){
      if(e.button === 0){
        this.showPassword = false
      }
    },
    mouseleaveFun(){
      if(this.showPassword){
        this.showPassword = false
      }
    },
    getStatus(){
      let that = this
      that.ser.get('/system/status').then((res)=>{
        // 更新sessionId loacluserData
        window.sessionStorage.setItem('sessonId',res.data.sessonId)
        window.localStorage.setItem('sessonId',res.data.sessonId)
        that.$store.commit('updateSessonId',res.data.sessonId)
        // 判断是否显示验证码
        if(res.data.validated === true){
          that.showCaptcha = true
          that.changeImg()
        }else{
          that.showCaptcha = false
        }
      })
    },
    changeImg(){
      let that = this
      that.ser.get('captcha').then((res)=>{
        if(res && res.data){
          that.captchaSrc = 'data:image/jpeg;base64'+ res.data
        }
      })
    },
    login(){
      let that = this
      let formScope = document.getElementsByTagName('form')[0]
      that.V.$validateAll(formScope).then((value)=>{
        if(value && value.canSumit){
          let userInfos = {
            // RSA加密
            username: that.utils.icsEncryptByRSA(that.userName),
            password: that.utils.icsEncryptByRSA(that.password),
            captcha: that.captcha
          }
          that.ser.postJson('authentication',userInfos).then((res)=>{
            if(res.status === 200){
              sessionStorage.setItem('sessonId',res.data.sessionId)
              localStorage.setItem('sessonId',res.data.sessionId)
              localStorage.setItem('localuserdata',JSON.stringify(res.data))
              sessionStorage.setItem('localuserdata',JSON.stringify(res.data))
              that.$store.commit('updateSessionId',res.data.sessionId)
              that.$store.commit('updateUserData',res.data)
              
              let afterLoginPath = that.$store.state.loginOutUrl === window.location.hash.replace("#/login#","")?window.location.hash.replace("#/login#",""): '/homes/mains'
              that.$router.push({path:afterLoginPath})

              that.utils.initWebSocket()
              // 修改密码
              that.loginMsgHandle(res.data)
            }else if(res.status === 202){
              that.getStatus()
            }
          })
        }
      })
    },
    isIE(){
      if(!!window.ActiveXObject || 'ActiveXObject' in window){
        return true
      }else{
        return false
      }
    },
    // 判断是否开启大写
    keyPress(event,control){
      if(!this.isIE()){
        var e = event || window.event;
        var keyvalue = e.keyCode || e.which
        var isShift = e.shiftKey || (keyvalue === 16) || false
        if(((keyvalue >= 65 && keyvalue<=90)&& !isShift)||((keyvalue>=97 && keyvalue <=122)&& isShift) ){
          // 大写开启
          this.capitalTip = true
          this.capital = true
        }else{
          this.capitalTip = false
        }
      }
    },
    // 当用户释放键盘上的字符键时触发,判断大写是否关闭
    keyUp(event,control){
      var e = event || window.event;
      var keyvalue = e.keyCode || e.which
      if(keyvalue ===20){
        if(this.capital){
          this.capitalTip = !this.capitalTip
        }
      }
    },
    hideTip(){
      // 失去光标关闭提示
      this.capitalTip = false
      this.capital = false
    }
  }
}
</script>