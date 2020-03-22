<template>
  <div class="login-wrap">
    <el-form
      label-width="80px"
      :model="formData"
      ref="loginFormRef"
      class="login-form"
      status-icon
      :rules="rules">
      <div class="avater"><img src="~assets/img/logo1.png"/></div>
      <div class="form-div">
        <!--重置需要设置prop值,且值与formData中对应的值保持一致-->
         <el-form-item label="用户名" prop="username">
           <el-input v-model="formData.username" prefix-icon="el-icon-user-solid" ></el-input>
         </el-form-item>
         <el-form-item label="密 码" prop="password">
           <el-input  type="password" v-model="formData.password" prefix-icon="el-icon-lock" ></el-input>
         </el-form-item>
         <el-button  @click='loginPost'  class="login-button" type="primary">登录</el-button>
        <el-button type="info"class="login-button" @click="loginReset">重置</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
	export default {
		name: "login",
    data(){
			return {
				formData:{
					username:'',
          password:''
        },
        //表单验证
				rules: {
					username: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
					],
          password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ]
				}
    }
    },
    methods:{
			loginReset () {
				// resetFields：element-ui提供的表单方法
				this.$refs.loginFormRef.resetFields()
			},
			 async loginPost(){
			    const res = await this.$https.post('login',this.formData)
         //解构赋值
					const {data,meta:{msg,status}} = res.data
					//console.log(res)

				 if(status === 200){
						//登录成功保存token值
            window.sessionStorage.setItem('token',data.token)
						//登录成功跳转到home组件
						await this.$router.push('/home')
            //登录成功显示
						this.$message.success(msg)
					}else
						this.$message.error('登陆失败')
			}
    }
	}
</script>

<style scoped>
  /*头像框*/
  .avater{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 1px solid #eeeeee;
    overflow: hidden;
    padding: 10px;
    transform: translate(-50%,-80%);
    position: absolute;
    left:50%;
    box-shadow: 1px 1px 10px #7e8c8d;
    background-color:#fff;
    padding: 5px;
  }
  .avater  img{
    width: 100%;
    height: 100%;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    background-color:#eeeeee;
  }
  .login-wrap {
    height: 100%;
    background-color:#0086b3;
    display: flex;
    /*水平垂直居中*/
    justify-content: center;
    align-items: center;
  }
  .login-form{
    background-color: #ffffff;
    width: 400px;
    border-radius: 5px;
    padding: 40px;
    height: 250px;
  }
  .form-div{
    transform: translate(0,30%);
  }
  .login-button{
    width: 20%;
    transform: translate(130%);
    margin: 15px;
    padding: 10px;
  }
</style>
