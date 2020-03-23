<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="23">
          <div class="grid-content bg-purple">
            <img src="~assets/img/logo.png" alt="">
            <span class="text">后台管理系统</span>
          </div>
        </el-col>
        <el-col :span="1">
          <el-row>
<!--            <el-button type="danger"  @click.prevent="logout">sign up</el-button>-->
            <span class="out"><i class="el-icon-switch-button" @click.prevent="logout"></i></span>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    
    <el-container class="aside-menu">
      <el-aside  :width="isCollapse ? '64px' : '180px' " class="aside">
        <div class="toggle-button" @click="toggleMenu">
         <i v-if="isCollapse" class="el-icon-d-arrow-right"></i>
          <i v-else class="el-icon-d-arrow-left"></i>
        </div>
        <!--unique-opened 只允许展开一个菜单-->
        <!--collapse-transition 关闭动画-->
        <el-menu
          default-active="2"
          text-color="#ffffff"
          active-text-color="gold"
          :unique-opened="true"
          router
          :collapse-transition="false"
          :collapse="isCollapse"
          >
          <!--左侧菜单-->
          <el-submenu  v-for="item in menuList"
                       :index="item.id+''"
                       :key="item.id">
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
      <!--侧边导航-->
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
					'125': 'el-icon-user-solid',
					'103': 'el-icon-s-tools',
					'101': 'el-icon-s-goods',
					'102': 'el-icon-s-shop',
					'145': 'el-icon-s-marketing'
				},
        //默认路径
        activePath:'',
        menuList:[],
				isCollapse:false,
        width:''
      }
    },
		created() {
			// //验证token,不存在则跳转到登录页面
			// this.activePath = window.sessionStorage.getItem('token')
			// if(!this.activePath){
			// 	this.$router.push('/')
			// }
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
				this.$confirm('是否退出登录', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message.success('退出成功')
					//清除token
					window.sessionStorage.clear()
					this.$router.push('/')
				})
      },
			toggleMenu(){
				this.isCollapse = !this.isCollapse
      }
    }
	}
</script>

<style>
  .container{
    height: 100%;
  }
  .header {
    background-color: #2d3741;
    color: #333;
    line-height: 60px;
    justify-content:space-between;
    align-items: center;
  }
  .aside {
    color: #eeeeee;
    background: #333744;
  }
  .el-menu{
    background: #333744;
  }
  .main {
    background-color:#eaedf1;
    color: #353f36;
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
  .toggle-button {
    background-color: #4A5064;
    font-size: 16px;
    line-height:24px;
    color: darkseagreen;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .out{
    /*鼠标变小手*/
    cursor: pointer;
    font-size: 24px;
    color: red;
  }
</style>
