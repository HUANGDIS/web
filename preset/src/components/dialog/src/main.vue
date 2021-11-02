<template>
  <div class="cus_dialog" :class="{'cus_dialog_enter_active':enterTo}" v-show='isShow'>
    <div class="cus_dialog_back" :style='{"width":backWidth,"height":backHeight}' v-show="!spreadOver"></div>
    <div class="cus_dialog_main" :style="{'top':top,'left':left,'width':width,'height':height,'margin-top':marginTop}">
      <!-- dialog head -->
      <div class="cus_dialogHead" v-dialogdrag :class="{cus_dialogHead_spread_over:spreadOver}">
        <span class="headTitle" :title="title">{{title}}</span>
        <span class="delIcon panel-tool-close" @click="cancelEvt"></span>
      </div>
      <!-- dialog content -->
      <div class="cus_dialogContent" :class="{cus_dialogContent_no_foot:hideFoot}">
        <div class="cus_dialogContent_north" v-if="multi" :class="{cus_dialogContent_north_spread_over:spreadOver}">
          <ul class="cus-dialog-jf-UI nav-tabs">
            <li v-for="(item,index) in userData"
              :key="index"
              :class="{active:item.active,disable:(maxIndex<index)}"
              @click="clickLi($event,index)"
              :style="{width:spreadOver?((parseInt(width) -32)/userData.length + 'px'): ''}"
            >
              <span class="nav_icon icon-complete" v-show="!spreadOver && maxindex >= index"></span>
              <a :href="item.step" @click.prevent v-if="!spreadOver">
                <span class="nav-title">{{item.name}}</span>
              </a>
              <a :href="item.step" @click.prevent v-if="!spreadOver">
                <span class="nav-title-icon">{{isNaN(Number(item.name.substr(0,1)))?'':item.name.substr(0,1)}}</span>
                <span class="nav-title">{{isNaN(Number(item.name.substr(0,1)))?item.name:item.name.substr(1)}}</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="cus_dialogContent_center" :class="{multiTab:multi}">
          <cus_dislog_render v-show="showCenter" ref="mydialog" class="cus_dialog_render_div">
          </cus_dislog_render>
        </div>
      </div>
      <!-- dialog foot -->
      <div class="cus_dialogFoot" :class="{cus_dialoFoot_spread_over:spreadOver}" v-if="!hideFooot">
        <div v-if="multi" class="cus_dislogFootButton">
          <button class="btn btn-default" v-show="!disableArr[0]" 
            :class="{'disabled':disableArr[0]}"
            @click="backStep"
            >
            {{dialog.backStep}}
          </button>
          <button class="btn btn-default btn-user"
            v-show="!disableArr[1]"
            :class="{'disabled':disableArr[1]}"
            @click="nextStep"
          >
          {{dialog.nextStep}}
          </button>
        </div>
      </div>
    </div>
  </div>  
</template>
<script>
export default{
  name: 'cusdialog',
  data(){
    return {
      enterTo: false,
      isShow: true,
      backWidth: '100%',
      backHeight:'100%',
      spreadOver: false, //是否铺满内容区
      top: '100px',
      left:'100px',
      width:'300px',
      height:'200px',
      marginTop: '-20px',
      title: '',
      multi: false,
      userData:'',
      currentIndex: 0,
      maxIndex: 0,
      showCenter: false,
      hideFooot: false,
      disableArr: [1,0,1,0],
    }
  },
  directives:{
    dialogdrag: function(el,d,vNode){
      var oDiv = el
      oDiv.onmousedown = function(ev){
        for(let i=0;i<Array.from(document.querySelectorAll(".el-select-dropdown")).length;i++){
          if(Array.from(document.querySelectorAll(".el-select.dropdown"))[i].style.display !== 'none'){
            Array.from(document.querySelectorAll(".el-select.dropdown"))[i].style.display = 'none'
          }
        }
        ev.preventDefault()
        var disX = ev.clientX - oDiv.parentNode.offsetLeft
        var disY = ev.clientY - oDiv.parentNode.offsetTop
        document.onmousemove = function(ev){
          var l = ev.clientX - disX
          var t = ev.clientY - disY
          vNode.context.left = l + 'px'
          vNode.context.top = t + 'px'
        };
        document.onmouseup = function(){
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  },
  methods:{
    close(){
      this.isShow = false
      this.$message.closeAll(); //关闭弹出界面关闭验证错误信息
      if(this.$el.remove){
        this.$el.remove()
      }else{
        this.$el.parentElement.removeChild(this.$el)
      }
      setTimeout(()=>{
        this.$destroy()
      },20)
    },
    async cancelEvt(){
      let grandChild = this.$refs.mydialog.$children[0];
      if(grandChild.cancelFun){
        //调用用户自己的cancelFun函数
        grandChild.cancelFun()
      }
      if(this.cancel){
        this.cancel()
      }
      if(this.saveUnComplete){
        var saveUnCompleteFalg = await new Promise((resolve)=>{
          this.$vConfirm({
            confirmType: this.enums.ConfirmEnum.CONFIRM_TWO,
            content:"是否保存草稿，下次打开时可继续编辑？",
            confirm:()=>{
              resolve(true)
            },
            cancel:()=>{
              if(this.saveMap.has(this.oriOpt.title)){
                this.saveMap.delete(this.oriOpt.title)
              }
              resolve(false)
            }
          })
        })
        if(saveUnCompleteFalg === true){
          this.saveMap.set(this.oriOpt.title,this.$el)
          this.$el.style.display = 'none'
          this.$el.stockHash = null
          return
        }
      }
      this.close()
    },
    customFun(funName){
      if(!funName){
        return
      }
      if(typeof this.$refs.mydialog.$children[0][funName] !== 'function'){
        throw new Error(funName + 'is not a function')
      }
      return this.$refs.mydialog.$children[0][funName]()
    },
    // li的点击事件
    clickLi($event,clickIndex){
      let that = this
      let target = $event.target
      if(target.targetName.toLowerCase() === 'a'){
        target = $event.target.parentNode
      }
      if(this.maxIndex >= clickIndex){
        let checkAllStep = async ()=>{
          let checkFlag = true,checkValidate
          //向后跳时判断途中每一步是否check成功
          if(this.currentIndex<clickIndex){
            for(let i=this.currentIndex;i<clickIndex;i++){
              if(that.userData[i].getData){
                await that.customFun(that.userData[i].getData)
              }
              let scope = that.userData[i].checkAllStep;
              let element = that.$refs.mydialog.$el.querySelector(scope)
              checkValidate = await that.V.$validateAll(element);
              if(checkValidate && !checkValidate.canSumit){
                that.currentIndex = i
                break
              }else if(that.userData[i].checkFun){
                checkFlag = await that.customFun(that.userData[i].checkFun)
                if(!checkFlag){
                  that.currentIndex = ibreak
                }
              }
            }
          }
          if(checkValidate && !checkValidate.canSumit){
            this.currentIndex = checkValidate && checkValidate.canSumit ? clickIndex : this.currentIndex
          }else{
            this.currentIndex = checkFlag ? clickIndex : this.currentIndex
          }
          this.userData.forEach(function(li,index){
            if(index === that.currentIndex){
              li.active = true
            }else{
              li.active = false
            }
          })
        }
        checkAllStep()
      }
    },
    stepChange(direction,data){
      if(direction === 'back'){
        if(this.currentIndex > 0){
          data[this.currentIndex -1].active = true
          this.currentIndex--
        }else if(this.currentIndex ===0){ //第一步
          data[this.currentIndex].active = true
        }
      }else if(direction === 'next'){
        if(this.currentIndex+1 < data.length){
          data[this.currentIndex +1].active = true
          this.currentIndex++
        }else if(this.currentIndex +1 === data.length){ //最后一步
          data[this.currentIndex].active = true
        }
      }
      this.userData = data
    },
    backStep(){
      var that = this
      var data = this.userData
      if(data && this.disableArr[0] === 0){
        data.forEach(function(item,index){
          if(item.active === true){
            that.currentIndex = index
            item.active = false
          }
        })
        //更改currentIndex userData
        this.stepChange('back',this.userData)
      }
    },
    mextStep(event){
      let that = this,
      data = this.userData,
      checkFlag = true,
      nextStepRun = async()=>{
        for(let i=0,len=data.length;i<len;i++){
          if(data[i].active === true){
            if(data[i].checkFun){
              let rst = await that.customFun(data[i].checkFun);
              if(rst){
                that.currentIndex = i
                
              }
            }
          }
        }
      }
    },
  }
}
</script>
<style scoped>

</style>
