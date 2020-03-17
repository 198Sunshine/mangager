<template>
  <div>
  <!--面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <!--搜索框-->
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容"
                    v-model="query"
                    clearable
                    class="input-with-select"
                    @clear="loadUserList">
            <el-button slot="append"  @click="searchUser" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" class="button" @click="addClickUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table
        :data="userList"
        border
        style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!--
          1、内组件访问外组件的数据，需要写在template
             slot-scope传递的值为访问数据的源数据
          2、userList.row表示userList数组的每一项
        -->
        <el-table-column  label="创建时间">
          <template slot-scope="userList">
            {{userList.row.create_time | fmtDate}}
          </template>
        </el-table-column>
        
        <el-table-column label="状态">
          <template slot-scope="userList">
           <el-switch
             v-model="userList.row.mg_state"
             active-color="#13ce66"
             inactive-color="#ff4949"
             @change="updateStatus(userList.row)"
           ></el-switch>
          </template>
        </el-table-column>
        <!--用户操作-->
        <el-table-column  label="操作">
          <template slot-scope="userList">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              circle
              @click="editClickUser(userList.row)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click="delClickUser(userList.row.id)"
              circle></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              plain size="mini"
              circle
              @click="pointClicktUser(userList.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
        <!--分页显示-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          class="page"
          :total="totals">
        </el-pagination>
      
      <!--弹出对话框-->
      <!--1、添加用户 对话框-->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd" width="500px">
        <el-form :model="adduser" :rules="rule">
          <el-form-item label="用户名" label-width="100px" prop="username">
            <el-input v-model="adduser.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密 码" label-width="100px" prop="password">
            <el-input  type="password" v-model="adduser.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="100px" prop="email">
            <el-input v-model="adduser.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="100px" prop="mobile">
            <el-input v-model="adduser.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <!--2、编辑用户 对话框-->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit" width="500px">
          <el-form :model="adduser" :rules="rule">
            <el-form-item label="用户名" label-width="100px" prop="username">
              <el-input v-model="adduser.username" disabled  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px" prop="email">
              <el-input v-model="adduser.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px" prop="mobile">
              <el-input v-model="adduser.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editUser(adduser.id)">确 定</el-button>
          </div>
      </el-dialog>
      
      <!--角色分配对话框-->
      <el-dialog title="角色分配" :visible.sync="dialogFormVisiblePoint" width="500px">
        <div class="point">
          <p>当前用户:{{adduser.username}}</p>
          <p>当前角色:{{adduser.role_name}}</p>
          <span>分配角色:</span>
          <el-select v-model="seleteId" clearable placeholder="请选择标签">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisiblePoint = false">取 消</el-button>
          <el-button type="primary" @click="pointUser">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
	export default {
		name: "User",
    data(){
			//自定义邮箱验证
			let emailCheck = (rule,value,callback) => {
				const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
				!emailReg.test(value) && callback(new Error('邮箱不合法'))
			}
			//自定义手机号验证
      let mobileCheck = (rule,value,callback) => {
				const mobileReg = /^1[3-578]\d{9}$/
        !mobileReg.test(value) && callback(new Error('手机号不合法'))
      }
			return {
				query:'',
				userList:[],
        /*角色列表*/
        roles:[],
        seleteId:'',
        pagenum:1,
        pagesize:2,
				totals:0,
				adduser:{
					username:'',
          password:'',
          email:'',
          mobile:''
        },
				dialogFormVisibleAdd:false,
        dialogFormVisibleEdit:false,
				dialogFormVisiblePoint:false,
        //表单验证
        rule:{
        	username:[
        		{ required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 2, max: 10, message: '用户名的长度在2～10个字', trigger: 'blur'}
          ],
          password: [
						{ required: true, message: '请输入用户密码', trigger: 'blur' },
						{ min: 6, max: 18, message: '用户密码的长度在6～18个字', trigger: 'blur'}
          ],
          email:[
						{ required: true, message: '请输入邮箱', trigger: 'blur'},
            { validator: emailCheck, trigger: 'blur'}
          ],
					mobile:[
						{ required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: mobileCheck, trigger: 'blur' }
					]
        }
      }
    },
    created(){
			this.getUserList()
    },
		methods:{
			//请求页面数据
		  async	getUserList(){
		  	//需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
		  	// const AUTH_TOKEN = window.sessionStorage.getItem('token')
				// this.$https.defaults.headers.common['Authorization'] = AUTH_TOKEN
				//query查询参数可以为空
				//pagenum当前页码不能为空
        //pagesize每页显示条数不能为空
				const res = await this.$https.get(
					`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
				//console.log(res)
				const {data:{users,total},meta:{msg,status}} = res.data
				if(status === 200) {
        	//给表格数据赋值
          this.userList = users
          //给totals赋值
          this.totals = total
        }else
        	this.$message.warning(msg)
			},
      //搜索用户
			searchUser(){
				this.getUserList()
      },
      //清空搜索重新加载数据
      loadUserList(){
		  	this.getUserList()
      },
      //分页方法
      //数据条数改变
			handleSizeChange(val) {
		  	this.pagesize = val
        this.getUserList()
				// console.log(`每页 ${val} 条`);
			},
      //页码改变
			handleCurrentChange(val) {
		  	this.pagenum = val
        this.getUserList()
				// console.log(`当前页: ${val}`);
			},
      //点击添加用户弹出弹框
      addClickUser(){
		  	this.dialogFormVisibleAdd = true
				this.adduser = {}
      },
      //添加用户,发送请求
      async addUser(){
		  	//关闭对话框
				this.dialogFormVisibleAdd = false
        //发送请求
		  	const res = await this.$https.post('users',this.adduser)
        const {meta:{msg,status},data} = res.data
				if(status === 201){
        	//提示添加成功
          this.$message.success(msg)
          //更新视图
          this.getUserList()
          //清空对话框
          this.adduser = {}
        }else
        	//创建失败提示
        	this.$message.warning(msg)
			},
			//删除用户
      delClickUser(id){
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(async () => {
						//发送删除请求
            const res = await this.$https.delete('users/'+id)
						console.log(res)
						const {meta:{msg,status}} = res.data
            if(status === 200){
							this.$message({
								type: 'success',
								message: msg
							})
              this.getUserList()
            }
            else
            	this.$message.warning(msg)
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						})
					})
			},
			//点击编辑用户弹出弹框
      editClickUser(user){
		  	this.dialogFormVisibleEdit = true
        this.adduser = user
			},
      //编辑用户
			 async editUser(id){
		  	this.dialogFormVisibleEdit = false
		  	const res = await this.$https.put('users/'+id,this.adduser)
        const {meta:{msg,status}} = res.data
         if(status === 200){
					 this.$message.success(msg)
            this.getUserList()
				 }else
					 this.$message.warning(msg)
			 },
			//修改用户状态
			//users/:uId/state/:type
			async updateStatus(user){
		  const res = await	this.$https.put(`users/${user.id}/state/${user.mg_state}`)
        /*if(res.data.meta.status === 200){
        	this.$message.success('更新状态成功!')
        }*/
        res.data.meta.status === 200 && this.$message.success('状态更新成功')
			},
      //点击角色分配弹出对话框
			async pointClicktUser(user){
		  	this.adduser = user
		  	this.dialogFormVisiblePoint = true
        const res = await this.$https.get('roles')
				this.roles = res.data.data
        this.seleteId = ''
				//console.log(res)
			},
      //分配选中角色
			async pointUser(){
		  	//users/:id/role
        this.dialogFormVisiblePoint = false
		  	const res = await this.$https.put(`users/${this.adduser.id}/role`,{rid:this.seleteId})
        const {meta:{msg,status}} = res.data
				res.data.meta.status === 200 ? this.$message.success(msg) : this.$message.info(msg)
				this.getUserList()
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
  .input-with-select{
    float: left;
    width: 300px;
    margin-top:10px ;
  }
  .button{
    float: left;
    margin: 10px;
  }
  .page{
    float: left;
    margin: 10px;
  }
  .point{
    text-align: left;
    line-height: 2;
  }
</style>
