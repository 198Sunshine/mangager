<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <el-button type="primary" @click="addClick">添加分类</el-button>
      <!--表格-->
      <zk-table
          ref="table"
          sum-text="sum"
          index-text="#"
          :data="tableData"
          :columns="columns"
          border
          show-header
          show-index
          tree-type
          is-fold
          :expand-type="props.expandType"
          :selection-type="props.selectionType">
            <template slot="status" slot-scope="scope">
              <i class="el-icon-success"
                 style="color: lightgreen;"
                 v-if="scope.row.cat_deleted === false">
              </i>
            </template>
          <template slot-scope="scope" slot="level">
            <el-tag v-if="scope.row.cat_level === 0" type="primary">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        <template slot="setting" slot-scope="scope">
          <el-button
              size="mini"
              type="success"
              @click="editClick(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="delCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </zk-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15]"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          class="page"
          :total="totals">
      </el-pagination>

    </el-card>
    <!--弹出对话框-->
    <el-dialog title="添加分类"  :visible.sync="dialogFormVisibleAdd" width="500px" @close="closeDia">
      <el-form :model="addForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input  v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父类名称" prop="cat_father">
          <!--级联选择器-->
          <el-cascader
              v-model="value"
              :options="tableData"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
              @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑对话框-->
    <el-dialog title="编辑分类"  :visible.sync="dialogFormVisibleEdit" width="500px">
      <el-form :model="addForm" label-position="left" label-width="80px">
        <el-form-item label="分类名称">
          <el-input  v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="EditCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ZkTable from 'vue-table-with-tree-grid'
	export default {
		name: "Category",
    components:{
		 ZkTable
    },
    data(){
      return {
        props: {
          expandType: false,
          selectionType: false,
        },
        columns: [
          {
            label: '分类列表',
            prop: 'cat_name',
            width: '400px',
          },
          {
            label: '是否有效',
            minWidth: '50px',
            type: 'template',
            template: 'status'
          },
          {
            label: '排序',
            //自定义模板
            type: 'template',
            template: 'level'
          },
          {
            label: '操作',
            minWidth: '200px',
            type: 'template',
            template: 'setting'
          },
        ],
        //全部分类id
        id:[],
        //对话框表单
        addForm: {
          cat_name: ''
        },
        dialogFormVisibleAdd: false,
        dialogFormVisibleEdit: false,
        //级联选择器数据
        value: [],
        cat_level: -1,
        //表格数据
        tableData: [],
        cat_id: -1,
        type: 3,
        //每页条数
        pageSize: 5,
        //当前页码
        pageNum: 1,
        //总条数
        totals: 0,
        //表单验证规则
        rules: {
         cat_name:[
           { required: true, message: '请输入分类名称', trigger: 'blur' },
           { min: 1, max: 10, message: '长度在 1 至 10 个字符', trigger: 'blur' }
           ]
         }
      }
    },
    created() {
		  //获取商品分类列表
      let  pageSize = this.pageSize
     let  pageNum = this.pageNum
      this.getGoodsCateGory(3,pageSize,pageNum)
    },
    methods:{
      handleSizeChange(val) {
       this.pageSize = val
        //console.log(val)
        this.getGoodsCateGory(3,val,this.pageNum)
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getGoodsCateGory(3,this.pageSize,val)
      },
      async getGoodsCateGory(type,pageSize,pageNum){
        const res = await this.$https.get(`/categories?type=${type}&pagesize=${pageSize}&pagenum=${pageNum}`)
        const {meta:{status,msg},data:{result,total}} = res.data
        this.totals = total
        //console.log(res)
        status === 200 ? this.tableData = result : this.$message.warning(msg)
      },
      //点击弹出添加分类对话框
      addClick(){
        let pageSize = this.totals
        let pageNum = 1
        this.dialogFormVisibleAdd = true

        this.getGoodsCateGory(2,pageSize,pageNum)
      },
      //关闭对话框触发
      closeDia(){
        this.getGoodsCateGory(3,this.pageSize,this.pageNum)
      },
      //点击提交分类
      async addCate(){
        this.dialogFormVisibleAdd = false
        //cat_pid分类父 ID不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`
        //cat_name分类名称不能为空
        //cat_level分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        //判断value和cat_level的值
        if(this.value.length ===0){
          this.value = 0
          this.cat_level = 0
        }
        else if(this.value.length === 1){
          this.value = this.value[0]
          this.cat_level = 1
        }
        else if(this.value.length === 2){
          this.value = this.value[1]
          this.cat_level = 2
        }
        const res = await this.$https.post('/categories',{
          cat_pid:this.value,
          cat_name:this.addForm.cat_name,
          cat_level:this.cat_level
        })
        const {meta:{msg,status}} = res.data
        status === 201?this.$message.success(msg): this.$message.warning(msg)
        this.addForm = {}
        this.getGoodsCateGory(3,this.pageSize,this.pageNum)
        //console.log(res)
      },
      //级联选择器节点改变触发
      handleChange(value){
        this.value = value
      },
      //点击打开编辑对话框
      editClick(id){
        this.dialogFormVisibleEdit = true
        this.cat_id = id
      },
      //编辑分类
     async EditCate(){
        this.dialogFormVisibleEdit = false
       //:id分类 ID不能为空`携带在url中`
       //cat_name分类名称不能为空【此参数，放到请求体中】
       const res = await this.$https.put(`/categories/${this.cat_id}`,{
         cat_name:this.addForm.cat_name
       })
       const {meta:{msg,status}} = res.data
       status === 200 ? this.$message.success(msg): this.$message.warning(msg)
       //重置表单
       this.addForm = {}
       //刷新列表
       this.getGoodsCateGory(2,this.pageSize,this.pageNum)
       //console.log(res)
     },
      //删除分类
      delCate(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$https.delete(`/categories/${id}`)
          const {meta: {status, msg}} = res.data
          status === 200 ? this.$message.success(msg) : this.$message.warning(msg)
          //console.log(id)
          this.getGoodsCateGory(2,this.pageSize,this.pageNum)
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      }
		}
	}
</script>

<style scoped>
  .box-card{
    height: 100%;
    text-align: left;
    margin-top: 10px;
  }
  .zk-table{
    margin-top: 20px;
    font-size: 13px;
  }
</style>
