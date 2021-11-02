<template>
  <div class="loginWrap">
    <div class="header"></div>
    <div class="login-shield"></div>
    <div class="loginDiv"></div>
    <div class="login-footer"></div>
  </div>
</template>

<script>
export default {
  data(){
    return{}
  },
  mounted(){

  },
  methods:{
    // 密码框  眼睛标识 鼠标按下键显示密码原文 
    mousedownFun(e){
      if(e.button === 0){
        this.showPassword = true
      }
    },
    mouseupFun(e){
      if(e.button === 0){
        this.showPassword = false
      }
    },
    mouseleaveFun(e){
      if(this.showPassword){
        this.showPassword = false
      }
    },
    login(){
      this.V.$validateAll(formScope).then(value=>{
        if(value && value.canSubmit){
          let userInfos = {
            username: '',
            password: '',
            captcha: ''
          }
          this.loading = true
          this.ser.parseJson('authentication',userInfos).then(res=>{
            if(res.status === 200){
              sessionStorage.setItem('sessonId',res.data.sessonId)
              localStorage.setItem('sessonnId',res.data.sessonId)
            }
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
