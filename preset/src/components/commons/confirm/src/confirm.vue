// confirm.vue
<template>
  <div class="confirm-wrapper" v-if="isShow">
    <div class="container" :style="{'top': top,'left':left,'width':width,'height':height,'margin-top':marginTop}">
      <div class="confirm-title"  v-dialogdrag>
        <span>{{title}}</span>
        <span class="alertclose" @click="onCancel">×</span>
      </div>
      <div class="confirm_content_wrap">
        <span class="confirm-icon"><i :icon="messageType.messagerIcon"></i></span>
        <div class="confirm_conent">
          <div class="confirm-message" v-html="content"></div>
          <!-- 不生效 -->
          <div class="confirm_div-checkbox" v-show="checkboxType.checkboxOne">
            <el-checkbox v-model="checkboxType.checkboxOneStatus" @change='changeStatusOne'>{{checkboxType.checkboxInfo}}</el-checkbox>
            <el-tooltip placement='right' v-show="checkboxType.checkboxOneStatus && checkboxType.tipMessage">
              <div slot="content" v-html="checkboxType.tipMessage"></div>
              <span><i class="el-icon-info"></i></span>
            </el-tooltip>
          </div>
          <div v-show="checkboxType.checkboxTwo" class="confirm_content_div_checkbox">
            <el-checkbox v-model="checkboxType.checkboxTwoStatus">{{checkboxType.checkboxInfoTwo}}</el-checkbox>
          </div>
          <div v-show="tiptext" class="confirm-message">{{tiptext}}</div>
        </div>
      </div>
      <div class="confirm-footer">
        <div class="confirm_footer_btn_div" v-if='!hideFoot'>
          <button type="button" class="btnCancel" v-if="cancelTxt" @click="onCancel">{{cancelTxt}}</button>
          <button v-show='messageType.btnNum' type="button" class="primary btnConfirm" v-if="confirmTxt" @click="onConfirm">{{confirmTxt}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isShow: false,
      title: '',
      content: '',
      cancelTxt: '取消',
      confirmTxt: '确定',
      msg: '我是confirm组件',
      hideFoot: false , //用来隐藏确认和取消按钮
      confirmType: '',
      checkboxType:{
        checkboxOne: false,
        checkboxTwo: false,
        checkboxInfo: '',
        checkboxInfoTwo: '',
        tipMessage: '',
        checkboxOneStatus: false,
        checkboxTwoStatus: false
      },
      top: '100px',
      left: '100px',
      width: '400px',
      height: '180px',
      marginTop: '-20px',
      tiptext: false, //错误提示
    }
  },
  mounted(){},
  computed:{
    messageType(){
      let messageType = {}
      if(this.confirmType === this.enums.ConfirmEnum.CONFIRM_TWO){
        messageType.messagerIcon = 'el-icon-question';
        messageType.titleIcon = 'el-icon-question';
        messageType.btnNum = true
      }else if(this.confirmType === this.enums.ConfirmEnum.INFO_WARNING_TWO){
        messageType.messagerIcon = 'el-icon-warning';
        messageType.titleIcon = 'el-icon-warning';
        messageType.btnNum = true
        // this.title = '警告'
      }else if(this.confirmType === this.enums.ConfirmEnum.INFO_WARNING_ONE){
        messageType.messagerIcon = 'el-icon-warning';
        messageType.titleIcon = 'el-icon-warning';
        messageType.btnNum = false
        // this.title = '警告'
      }else if(this.confirmType === this.enums.ConfirmEnum.INFO_NORMARL){
        messageType.messagerIcon = 'el-icon-info';
        messageType.titleIcon = 'el-icon-info';
        messageType.btnNum = false
        // this.title = '信息'
      }else if(this.confirmType === this.enums.ConfirmEnum.INFO_ERROR){
        messageType.messagerIcon = 'el-icon-error';
        messageType.titleIcon = 'el-icon-error';
        messageType.btnNum = false
        // this.title = '错误'
      }else{
        messageType.messagerIcon = 'el-icon-info';
        messageType.titleIcon = 'el-icon-question';
        messageType.btnNum = true
      }
      return messageType
    }
  },
  directives:{
    dialogdrag: function(el){
      let oDiv = el;
      oDiv.onmousedown = function(ev){
        ev.preventDefault();
        let disX = ev.clientX - oDiv.parentNode.offsetLeft;
        let disY = ev.clientY - oDiv.parentNode.offsetTop;
        document.onmousemove = function(ev){
          let l = ev.clientX - disX;
          let t = ev.clientY - disY;
          oDiv.parentNode.style.left = l + 'px';
          oDiv.parentNode.style.top = t + 'px';
        }
        document.onmouseup = function(){
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }
  },
  methods: {
    onCancel () {
      this.isShow = false
      this.cancelCallBack()
    },
    onConfirm () {
      this.isShow = false
      this.confirmCallBack();
    },
    //更改是否选中的change事件
    async changeStatusOne(){
      if(this.checkboxType.changeStatusOne){
        await this.checkboxType.changeStatusOne(this)
      }
    }
  }
}
</script>

<style lang="less">
.confirm-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
}
.confirm-wrapper .container {
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 10%;
  right: 10%;
  // border-radius: 16px;
  transform: translateY(-50%);
}
.confirm-wrapper .container .confirm-title {
  height: 48px;
  line-height: 48px;
  background-color: #0062ac;
  border-bottom: 1px solid #d9d9d9;
  padding: 0 16px;
  color: #262626;
  font-size: 18px;
  cursor: move;
  .alertclose{
    float: right;
    cursor: pointer;
  }
}
.confirm-wrapper .container .confirm_content_wrap {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;

  .confirm-icon{
    width: 36px;
    height: 36px;
    margin-top: 26px;
    margin-left: 32px;
  }
  .confirm_conent{
    width: 100%;
    position: absolute;
    top: 50%;
    padding: 0px 32px;
    transform: translateY(-50%);
    box-sizing: border-box;
  }
}
.confirm-wrapper .container .confirm-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 52px;
  border-top: 1px solid #d9d9d9;
  .confirm_footer_btn_div{
    float: right;
    padding: 10px 16px;
  }
  button{
    text-align: center;
    cursor: pointer;
    font-weight: 500;
    padding: 5px 12px;
    font-size: 12px;
    border-radius: 3px;
    margin: 0 auto;
    text-align: right;
    border: 1px solid #dcdfe6;
    background-color: #fff;
  }
  button:nth-child(2){
    margin-left: 10px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
}
.confirm-wrapper .container .btn span.btnCancel {
  display: inline-block;
  text-align: center;
  font-size: 18px;
  background-color: #fff;
  line-height: 48px;
  width: 50%;
  color: #666;
}
.confirm-wrapper .container .btn span.btnConfirm {
  display: inline-block;
  text-align: center;
  width: 50%;
  font-size: 18px;
  color: #db2c17;
  background-color: #fff;
  line-height: 48px;
}
</style>
