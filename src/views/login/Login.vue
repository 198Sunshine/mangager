<template>
  <div class="login-wrap">
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="formData"
      class="login-form">
      <h1>用户登录</h1>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button  @click.prevent='loginPost()' class="login-button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
	export default {
		name: "login",
    data(){
			return {
				labelPosition: 'top',
				formData:{
					username:'admin',
          password:'123456'
        }
			}
    },
    methods:{
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
						this.$message({
							showClose: true,
							message: msg,
							type: 'success'
						})
					}else{
						//失败显示
						this.$message({
							showClose: true,
							message: msg,
							type: 'warning'
						})
					}
			}
			// loginPost(){
			// 	this.$https.post('login',this.formData).then(res => {
			// 		const {
			// 			data,
      //       meta:{ msg, status }
      //     } = res.data
			// 		console.log(res)
      //
			// 		if(status === 200){
      //       this.$router.push('/home')
			//
			// 			this.$message({
			// 				showClose: true,
			// 				message: msg,
			// 				type: 'success'
			// 			})
			// 		}else{
			// 			this.$message({
			// 				showClose: true,
			// 				message: msg,
			// 				type: 'warning'
			// 			})
      //     }
			// 	})
      // }
    }
	}
</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    /*水平垂直居中*/
    justify-content: center;
    align-items: center;
  }
  .login-form{
    background-color: #ffffff;
    width: 400px;
    border-radius: 5px;
    padding: 35px;
  }
  .login-wrap h1{
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .login-button{
    width: 100%;
  }
</style>
