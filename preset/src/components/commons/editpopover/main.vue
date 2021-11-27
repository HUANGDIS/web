<template>
  <el-popover
    v-if="popoverData"
    ref="editpopover"
    :placement='popoverData.placement'
    trigger='manual'
    v-model="show"
    popover-class='popover'
    width='popverData.width'
   >
    <div ref="popover-body">
      <!-- 标题 -->
      <div class="popover-title" v-if="popoverData.title !== ''">{{popoverData.title}}</div>
      <!-- 内容 -->
      <div class="popover-con">
        <el-form ref="editForm" data-scope='editForm'>
          <el-input v-model="popoverData.value" ref="thisValue" :placement='popoverData.placement'  :style="{'width':(popoverData.width -115)+'px','height':'32px','display':'inline-block'}" class="inputValue"
          name="name" data-type="input" ></el-input>
          <input type="text" class="hidden">
          <div class="btnDiv">
            <button type="button" @click="complate"><i class="el-icon-check"></i></button>
            <button type="button" @click="cancel"><i class="el-icon-close"></i></button>
          </div>
          <div class="popover-last-slot">
            <slot name="lastFix"></slot>
          </div>
        </el-form>
      </div>
    </div>
    <span class="el-icon-edit" slot="reference" @click="show=!show"></span>
  </el-popover>
</template>
<script>
export default{
  name: 'editpopover',
  props:{
    options:{
      type: Object
    }
  },
  data(){
    return{
      show: false,
      popoverData: null,
      rules: null
    }
  },
  watch:{
    show(val){
      if(val){
        this.setData()
      }
    }
  },
  beforeMount(){
    this.setData()
  },
  methods:{
    showPop(){
      document.addEventListener('click',this.listenEvent)
      this.$refs.editpopover.$refs.popper.addEventListener('click',this.stopPropagation)
    },
    hidePop(){
      document.removeEventListener('click',this.listenEvent)
      this.$refs.editpopover.$refs.popper.removeEventListener('click',this.stopPropagation)
    },
    listenEvent(evt){
      if(this.$refs.editpopover.showPopper && (evt.hasOwnProperty('isTrusted')?!evt.isTrusted:(e.pageX ===0 && e.pageY ===0))){
        return
      }
      if(this.$refs.editpopover.showPopper){
        this.show = false
      }
    },
    stopPropagation(evt){
      evt.stopPropagation()
    },
    /**
     * 暂未添加校验
     */
    setData(){
      this.popoverData ={
        show: false,
        title: this.options.title? this.options.title:'',
        width: this.options.width? this.options.width: '300',
        placement: this.options.placement? this.options.placement: 'right',
        value: this.options.value?this.options.value: '',
        popoverIsShow: this.options.popoverIsShow?this.options.popoverIsShow: false,
        visible: this.popoverIsShow?this.popoverIsShow:false,
        axiosFun:this.options.axiosFun?this.options.axiosFun:null
      }
      //验证信息 默认只有一个框 且name是name验证对象的第一个属性为其验证规则
      this.rules = this.options.rules? Object.assign({},this.options.rules): {}
      let keys = Object.keys(this.rules)
      this.rules.name = this.rules[keys[0]]

      if(this.$refs.thisValue && this.rules.name){
        this.V.$removeRules(this.$refs.thisValue.$el)
        this.V.$validateSingle(this.$refs.thisValue.$el)
        this.V.$addRules(this.$refs.thisValue.$el,this.rules.name)
      }
    },
    complateFun(){
      if(this.popoverData.axiosFun){
        this.popoverData.axiosFun(this.popoverData.value)
        this.show = false
      }
      this.popoverData.visible = false
    },
    complate(){
      let that = this;
      this.V.$validateAll(this.$refs.editForm.$el).then((value)=>{
        if(value && value.canSumit){
          that.complateFun()
        }else{
          return false
        }
      })
    },
    cancel(){
      if(this.$refs.thisValue){
        this.V.$removeRules(this.$refs.thisValue.$el)
      }
      this.popoverData.visible = false
      this.show = false
    }
  }
}
</script>
<style lang="less" scoped>
.edit{
  background: '';
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-left: 7px;
  vertical-align: middle;
  cursor: pointer;
}
.popover-title{
  margin: 0;
  padding: 8xp 14px;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ebebeb;
  border-radius: 5px 5px 0 0 ;
}
.popover-con{
  padding: 10px 15px;
  font-size: .9em;
  float: left;
}
.inputValue .el-input__inner /deep/{
  width: 100% !important;
  height: 32px !important;
  line-height: 32px!important;
}
.btnDiv{
  float: right;
  margin-left: 5px;
  text-align: justify;
  button{
    height: 32px;
    padding: 6px 12px;
    background-color: #fff;
    border: 1px solid #d1d3de;
    color: #595959;
    margin-bottom: 0;
  }
}
.poppover-last-slot{
  /* display: inline-block; */
  line-height: 32px;
  float:right;
}
.hidden{
  display: none;
}
</style>
