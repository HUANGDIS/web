<template>
  <div class="test">
    <div>
      <el-table
        :data="tableData"
        border
        >
        <el-table-column
          prop="date"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="300">
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template>
            <el-button  type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click='handleDelete()'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <editpopover :options="editAddrOptions" v-show=true></editpopover> 
  </div>
</template>
<script>
export default{
  data(){
    return{
       confirmOptions: {
        height: '230px',
        isShow: true,
        title: '提示',
        content: '确定删除吗？',
        confirmType: 'CONFIRM_ONE'
      },
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
    }
  },
  methods:{
   handleDelete(){
    this.$vConfirm({
        ...this.confirmOptions,
        confirmCallBack: this.confirmCallBack,
        cancelCallBack: this.cancelCallBack,
      })
   },
   confirmCallBack() {
      console.log('confirmCallBack this ======', this);
    },
    cancelCallBack() {
      console.log('cancelCallBack this ======', this);
    },
 },
 computed:{
   editAddrOptions(){
     return{
       title: '修改地址',
       value: this.tableData.address,
     }
   }
 }
}

</script>
<style lang="less" scoped>
.test{
  margin-top: 20px;
}
</style>
