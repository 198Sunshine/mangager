<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="22">
          <div class="grid-content bg-purple">
            <img src="~assets/img/logo.png" alt="">
            <span class="text">后台管理系统</span>
          </div>
        </el-col>
        <el-col :span="2">
          <el-row>
            <el-button type="danger"  @click.prevent="logout">sign up</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
      <!--侧边导航-->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#ffffff"
          :unique-opened="true"
          :router="true">
          
          <!--左侧菜单-->
          <el-submenu  v-for="(item,index) in menuList" :index="item.id+''" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item  :index="'/'+subItem.path" v-for="subItem in item.children">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
	export default {
		name: "Home",
    data(){
			return {
		    //左侧菜单图标
				iconObj: {
					'125': 'el-icon-user',
					'103': 'el-icon-folder',
					'101': 'el-icon-shopping-bag-2',
					'102': 'el-icon-shopping-cart-2',
					'145': 'el-icon-s-data'
				},
        //默认路径
        activePath:'',
        menuList:[]
      }
    },
		created() {
			//验证token,不存在则跳转到登录页面
			this.activePath = window.sessionStorage.getItem('token')
			if(!this.activePath){
				this.$router.push('/')
			}
			this.getMenuList()
		},
    methods:{
			async getMenuList(){
				//需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
        //this.$https.defaults.headers.common['Authorization'] = this.activePath
        const { data:res } = await this.$https.get('menus')
				this.menuList = res.data
			},
      //登出
      logout(){
				this.$message.success('登出成功')
				//清除token
				window.sessionStorage.clear()
        this.$router.push('/')
      }
    }
	}
</script>

<style>
  .container{
    height: 100%;
  }
  .header {
    background-color: #373f41;
    color: #333;
    line-height: 60px;
    justify-content:space-between;
    align-items: center;
  }
  .aside {
    background-color: #333744;
    color: #333;
    line-height: 200px;
  }
  
  .main {
    background-color:  #eaedf1;
    color: #333;
    text-align: center;
  }
  .header img{
    height: 50px;
    position: absolute;
    left: 5px;
    top: 5px;
  }
  .text{
    line-height: 60px;
    margin-left:80px ;
    font-size: 20px;
    color: #ddfffc;
  }
  el-button{
    /*鼠标变小手*/
    cursor: pointer;
  }
  .el-menu-vertical-demo{
   width: 100%;
  }
</style>
