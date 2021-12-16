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
    <el-form :rules="rules">
      <el-form-item>
        <!-- <ipInput  :showErrLabel="false" v-model="ip" :name="ip" data-type="custom"  data-scope="ip"></ipInput> -->
      </el-form-item>
    </el-form>
   <!-- 表格测试 -->
    <div>
      <el-grid width="500" :config="tableCfg" :data="data"></el-grid>
    </div>
    <!-- v-tree测试 -->
    <v-tree :treeData="treeData"></v-tree>
  </div>
</template>
<script>
// import ipInput from '../../components/commons/ipInput/ipInput.vue'
import elGrid from '../../components/el-grid/index'
import vTree from '../../components/v-tree/v-tree.vue'
export default{
  components:{elGrid,vTree},
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
      }],
      ip: '',
      rules:{
        ip:[
          ["required","ip是必须的"],
          ["ip"]
        ]
      },
      data: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, 
        {
          date: '2016-05-04',
          name: '王小虎',
          address:  '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      tableCfg:{
        showSelection:true,
        columns:[
          {
            prop: 'name',   
            label: '姓名'
          },
          {
            prop: 'date',  
            label: '日期'
          },
          {
            prop: 'address',  
            label: '地址'
          }
        ] 
      },
      treeData:[
          {
              text:'xiaoming', 
              id:'1', 
              icon:'folder', 
              children:[ 
                  {text:'1-1', id:'1-1',icon:'folder', 
                      children:[ 
                          {text:'1-1-1',id:'1-1-1', icon:'file',},
                          {text:'1-1-2',id:'1-1-2',icon:'file'}
                        ] 
                   },
                   { text:'1-2', id:'1-2', icon:'file', }] }, 
                   {text:'hua', id:'2', icon:'folder', 
                   children:[{ text:'2-2',id:'2-2', icon:'file', }] }, 
                   {text:'hua', id:'3', icon:'folder', 
                   children:[{text:'3-3', id:'3-3', icon:'file', }] }
      ]
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
        axiosFun: function(){},
       rules:{}
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
