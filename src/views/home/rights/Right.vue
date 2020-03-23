<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <!--表格-->
      <el-table
        :data="rightsList"
        height="550px"
        border
        style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column  label="权限等级">
          <!--
         1、内组件访问外组件的数据，需要写在template
            slot-scope传递的值为访问数据的源数据
         2、userList.row表示userList数组的每一项
          -->
          <template slot-scope="rightsList">
            <el-tag v-if="rightsList.row.level === '0'">一级</el-tag>
            <el-tag v-if="rightsList.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-if="rightsList.row.level === '2'" type="danger">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
	export default {
		name: "Right",
    data(){
			return{
				//权限列表
				rightsList:[]
      }
    },
		created(){
			this.getRights()
    },
		methods:{
		 async getRights(){
		  const {data:res} = await 	this.$https.get('rights/list')
			 //console.log(res)
			 //将res赋值给权限列表
			 res.meta.status === 200 ?  this.rightsList = res.data : this.$message.error('获取权限列表失败')
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
</style>
