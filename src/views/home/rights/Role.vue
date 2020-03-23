<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <el-button type="success" plain class="button" @click="clickRoles">添加角色</el-button>
      <!--表格区域-->
      <el-table
        :data="rolesList"
        height="500px"
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template  slot-scope="rolesList">
            <!--无权限显示提示-->
            <p v-if="rolesList.row.children.length === 0" class="">未分配权限</p>
            <!--有权限时显示的标签-->
            <el-row
              v-for="(item1,i1) in rolesList.row.children"
              :class="['bottomBd','vcenter',i1 === 0 ? 'topBd' : '']"
              :key="i1"
              ref="item1Keys"
            >
              <!--一级权限-->
              <el-col :span="5">
                <el-tag type="primary" closable @close="delTag(rolesList.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级权限-->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :class="['bottomBd','vcenter',i2 === 0 ? '' : 'topBd']"
                  :key="i2"
                  ref="item2Keys"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable  @close="delTag(rolesList.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--三级权限-->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3,i3) in item2.children"
                            :key="i3" closable
                            @close="delTag(rolesList.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column  label="操作">
          <!--
         1、内组件访问外组件的数据，需要写在template
            slot-scope传递的值为访问数据的源数据
         2、userList.row表示userList数组的每一项
        -->
          <template slot-scope="rolesList">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(rolesList.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(rolesList.row)"
              >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="handlePoint(rolesList.row)"
              >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  <!--1、点击添加角色 对话框-->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleadd"  width="500px"  @close="closeDia">
      <el-form
          :model="form"
          status-icon
          :rules="rules"
          label-position="left"
          label-width="80px"
          ref="formAdd"
      >
        <el-form-item label="角色名称"  prop="roleName">
          <el-input v-model="form.roleName"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
  <!--2、点击编辑 对话框-->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit" width="500px" @close="closeDia">
      <el-form :model="form"
               :rules="rules"
               show-message
               label-position="left"
               status-icon
               ref="formEdit"
               label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!--3、点击分配角色 对话框-->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisiblePoint" width="500px"  @close="closeDia">
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
        :default-checked-keys="rightID"
        icon-class="el-icon-loading"
        ref="treeKeys"
      >
      </el-tree>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblePoint = false">取 消</el-button>
        <el-button type="primary" @click="pointRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		name: "role",
    data(){
			return {
				rolesList:[],
				dialogFormVisibleadd:false,
				dialogFormVisibleEdit:false,
				dialogFormVisiblePoint:false,
        form:{
					roleName:'',
          roleDesc:''
        },
        //添加表单验证
        rules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 4, max: 6, message: '长度在 4 到 6 个字符', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur'}
          ],
        },
        //树形结构的数据
				rightsList:[],
				defaultProps:{
					label:'authName',
          children:'children'
        },
        //角色选中的权限id
        rightID:[],
        currentId:''
      }
    },
    created(){
			this.getRole()
    },
    methods:{
		  async	getRole(){
				const {data:res} = await this.$https.get('roles')
				res.meta.status === 200 ? this.rolesList = res.data : this.$message.error('获取角色列表失败')
			},
      //点击添加弹出对话框
      clickRoles(){
		  	//开启对话框
		  	this.dialogFormVisibleadd = true
      },
      //添加角色
      addRoles(){
		    this.$refs.formAdd.validate( async valid => {
		      if(!valid){
		        this.$message.warning('请确认是否按要求填写')
            return false
          }
          //关闭对话框
          this.dialogFormVisibleadd = false
          const res = await this.$https.post('roles',this.form)
          const {meta:{status,msg}} = res.data
          status === 201 ? this.$message.success(msg) : this.$message.warning(msg)
          //刷新界面
          this.getRole()
        })
			},
      //关闭对话框前刷新
      closeDia(){
		    this.form = {}
		    this.getRole()
      },
      //点击编辑弹出对话框
			handleEdit(user){
		  	this.dialogFormVisibleEdit = true
        this.form = user
      },
      //编辑角色
      editRoles(){
		    this.$refs.formEdit.validate(async valid => {
          if(!valid){
            this.$message.warning('请确认是否按要求填写')
            return false
          }
          this.dialogFormVisibleEdit = false
          const res = await this.$https.put(`roles/${this.form.id}`,this.form)
          const {meta:{status,msg}} = res.data
          status === 200 ? console.log('') : this.$message.warning(msg)
          this.getRole()
        })
			},
      //点击删除弹出
      handleDelete(user){
				this.form = user
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const res = await  this.$https.delete(`roles/${this.form.id}`)
          const {meta:{status,msg},data} = res.data
          status === 200 ? this.$message.success(msg) : this.$message.warning(msg)
          this.getRole()
				}).catch(() => {
					this.$message.info('已取消删除')
				})
      },
      //删除权限
      delTag(role,right){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
          const res = await this.$https.delete(`roles/${role.id}/rights/${right}`)
          const {meta:{status,msg},data} = res.data
					status === 200 ? this.$message.success('删除成功') : this.$message.warning(msg)
					//console.log(res)
					//this.getRole()
          //更新数据，不刷新整个页面，刷新该数据的页面
          role.children = data
				}).catch(() => {
					this.$message.info('已取消删除')
				})
      },
      //分配权限弹出对话框
			async handlePoint(role){
		  	this.dialogFormVisiblePoint= true
        const res = await this.$https.get('rights/tree')
        const {meta:{status,msg},data} = res.data
				status === 200 ? this.rightsList = data : this.$message.warning(msg)
				//console.log(res)
				//角色选中的勾选
        this.getRoleId(role,this.rightID)
        
        //获取当前对象的id
        this.currentId = role.id
			},
      //获取角色选择的权限id
      getRoleId(role,arr){
       // role.children.forEach(item => {
				//  item.children.forEach(item1 => {
       // 		item1.children.forEach(item2 => {
       // 			arr.push(item2.id)
       //    })
       //  })
       // })
        //存在三级权限、、、自动勾选一级和二级权限
        //判断是否有三级权限
        //三级权限不存在children，则将id添加到arr中
        if(!role.children)  return arr.push(role.id)
        //通过递归，获取节点权限并保存在arr中
        role.children.forEach(item => this.getRoleId(item,arr))
      },
      //点击分配权限提交按钮
			 async pointRoles() {
		  	this.dialogFormVisiblePoint = false
				 const keys = [
				 	...this.$refs.treeKeys.getCheckedKeys(),
          ...this.$refs.treeKeys.getHalfCheckedKeys()
         ].join(',')
				 const res = await this.$https.post(`roles/${this.currentId}/rights`,{rids:keys})
				 //console.log(res)
				 const {meta:{status,msg}} = res.data
         status === 200 ? this.$message.success(msg) : this.$message.warning(msg)
         this.getRole()
			 }
		}
	}
</script>

<style scoped>
  .box-card{
    height: 100%;
    text-align: center;
    margin-top: 10px;
  }
  .button{
    float: left;
    margin-bottom: 10px;
  }
 .el-tag{
   margin: 7px;
 }
  .bottomBd{
    border-bottom: 1px solid #eee;
  }
  .topBd{
    border-top: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
