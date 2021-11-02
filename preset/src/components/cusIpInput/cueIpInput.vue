<template>
  <div class="multiInputDiv el-input" @click.prevent>
    <el-tooltip :content="setToolTipConetnt('seg0')" 
    :disabled="setToolTipDisabled('seg0')"
    :placeholder="setToolTipPlacement('seg0')"
    >
      <input ref="ip0" 
        @keyup.190.110.stop="changeFocus"
        @input="changeValue" 
        v-bind="$attrs" 
        :disabled="setInputDisabled('seg0')"
        v-model="ip.seg0"
      >
    </el-tooltip>
    <span>.</span>
    <el-tooltip :content="setToolTipConetnt('seg1')" 
    :disabled="setToolTipDisabled('seg1')"
    :placeholder="setToolTipPlacement('seg1')"
    >
      <input ref="ip1" 
        @keyup.190.110.stop="changeFocus"
        @input="changeValue" 
        v-bind="$attrs" 
        :disabled="setInputDisabled('seg1')"
        v-model="ip.seg1"
      >
    </el-tooltip>
    <span>.</span>
    <el-tooltip :content="setToolTipConetnt('seg2')" 
    :disabled="setToolTipDisabled('seg2')"
    :placeholder="setToolTipPlacement('seg2')"
    >
      <input ref="ip2" 
        @keyup.190.110.stop="changeFocus"
        @input="changeValue" 
        v-bind="$attrs" 
        :disabled="setInputDisabled('seg2')"
        v-model="ip.seg2"
      >
    </el-tooltip>
    <span>.</span>
    <el-tooltip :content="setToolTipConetnt('seg3')" 
    :disabled="setToolTipDisabled('seg3')"
    :placeholder="setToolTipPlacement('seg3')"
    >
      <input ref="ip3" 
        @keyup.190.110.stop="changeFocus"
        @input="changeValue" 
        v-bind="$attrs" 
        :disabled="setInputDisabled('seg3')"
        v-model="ip.seg3"
      >
    </el-tooltip>
    <label class="err_msg" v-if="showErrorLabel"></label>
  </div>
</template>
<script>
export default{
  name:'multiInput',
  model:{
    prop: 'value',
    event: 'change'
  },
  data(){
    return{
      ip:{
        seg0: '',
        seg1: '',
        seg2: '',
        seg3: '',
      }
    }
  },
  props:{
    value: String,
    showErrorLabel: {
      type: Boolean,
      default: true
    },
    config:{
      default:()=>{
        return{}
      }
    }
  },
  computed:{
    setInputDisabled(){
      return (seg)=>{
        return this.config[seg] && this.config[seg].disabled || this.$attrs.disabled;
      }
    },
    setToolTipConetnt(){
      return function(seg){
        return this.config[seg] && this.config[seg].tipContent
      }
    },
    setToolTipContent(){
      return function(seg){
        return !(this.config[seg] && this.config[seg].showTip)
      }
    },
    setToolTipPlacement(){
      return function(seg){
        return this.config[seg] && this.config[seg].placement || "top"
      }
    }
  },
  watch:{
    value(val){
      this.setValue(val)
    }
  },
  mounted(){
    this.$el.getValue = this.getValue
    this.$el.bindEvent = this.bindEvent
    this.setValue(this.value)
  },
  methods:{
    changeValue(event){
      let regTes = /\d/g ;
      for(let item in this.ip){
        if(this.ip[item]){
          this.ip[item] = String(this.ip[item]).match(regTes) ? String(this.ip[item]).match(regTes).join('') : ''
        }
      }
      let value = this.ip.seg0 || this.ip.seg1 || this.ip.seg2 || this.ip.seg3 ?this.ip.seg0 +'.'+this.ip.seg1 +'.'+this.ip.seg2 +'.'+this.ip.seg3 :''
      this.$emit('change',value)
    },
    changeFocus(evt){
      //190对应大键盘  110对应小键盘
      evt.target.nextSibling.nextElementSibling.nextElementSibling.focus();
      return focus
    },
    getValue(){
      let regTes = /\d/g ;
      for(let item in this.ip){
        if(this.ip[item]){
          this.ip[item] = String(this.ip[item]).match(regTes) ? String(this.ip[item]).match(regTes).join(''):''
        }
      }
      if(this.ip.seg0 || this.ip.seg1||this.ip.seg2||this.ip.seg3){
        return this.ip.seg0 +'.'+this.ip.seg1 +'.'+this.ip.seg2 +'.'+this.ip.seg3 
      }else{
        return ''
      }
    },
    bindEvent(validate){
      for(let i in this.$refs){
        this.$refs[i].oninput=()=>{
          validate(this.$el,this,this.getValue())
        }
      }
    },
    setValue(value){
      let i = 0
      let ipArr = value.split('.')
      if(!ipArr){
        this.ip = ''
        return 
      }
      for(let item in this.ip){
        this.ip[item] = ipArr[i++] || ''
      }
    }
  },
  
}
</script>
<style scoped>
.multiInputDiv{
  width: 100%;
  border: 1px solid #d9d9d9;
  white-space: nowrap;
  min-width: 80px;
  line-height: 30px;
}
.multiInputDiv[disabled]{
  background-color: #f0f0f0;
  border-color: #d9d9d9;
  color: #C0C4CC;
  cursor: pointer;
}
.inputWrap{
  overflow: hidden;
}
input{
  width: calc((100% -10px)/4);
  border: 0;
  padding: 0px 2px 0px 10px;
  height: 30px;
}
input:not(:first-child){
  margin-left: -5px;
}
span{
  width: 5px;
  display: inline-block;
  line-height: 30px;
  margin-left: -5px;
}
</style>
