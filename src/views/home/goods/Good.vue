<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
          <el-button type="primary" class="button" round @click="addClickGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table
        :data="goodsList"
        border
        style="width: 100%">
        <el-table-column type="index"  label="" width="40"></el-table-column>
        <el-table-column prop="goods_name" width="800" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量"></el-table-column>
        <!--
          1、内组件访问外组件的数据，需要写在template
             slot-scope传递的值为访问数据的源数据
          2、userList.row表示userList数组的每一项
        -->
        <el-table-column  label="创建时间">
          <template slot-scope="goodsList">
            {{goodsList.row.create_time | fmtDate}}
          </template>
        </el-table-column>
        <!--用户操作-->
        <el-table-column  label="操作">
          <template slot-scope="goodsList">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              circle
              @click="editClickGood(goodsList.row)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click="delGoods(goodsList.row.goods_id)"
              circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页显示-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 6, 9, 12]"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        class="page"
        :total="totals">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
	export default {
		name: "User",
		data(){
			return {
				query:'',
				goodsList:[],
        pageSize:3,
        pageNum:1,
        totals:0,
				dialogFormVisibleEdit:false,
				dialogFormVisibleAdd:false
			}
		},
		created(){
		  this.getGoodsList()
		},
		methods:{
		 async getGoodsList(){
       const res =await this.$https.get( `/goods?query=${this.query}&pagesize=${this.pageSize}&pagenum=${this.pageNum}`)
       //console.log(res)
       const {meta:{msg,status},data:{goods,total}} = res.data
        if(status === 200){
          this.goodsList = goods
          this.totals = total
        }else
        this.$message.warning(msg)
     },
			//搜索用户
			searchUser(){
		   this.getGoodsList()
			},
			//清空搜索重新加载数据
			loadUserList(){
		   this.getGoodsList()
			},
			//分页方法
			//数据条数改变
			handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.getGoodsList()
			},
			//页码改变
			handleCurrentChange(val) {
				this.pageNum = val
				this.getGoodsList()
				// console.log(`当前页: ${val}`);
			},
			//点击添加用户弹出弹框
			addClickGoods(){
        this.$router.push('/add')
			},
    //删除用户
      delGoods(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //发送删除请求
          const res = await this.$https.delete('goods/'+id)
          //console.log(res)
          const {meta:{msg,status}} = res.data
          if(status === 200){
            this.$message({
              type: 'success',
              message: msg
            })
            this.getGoodsList()
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
      editClickGood(user){
        this.dialogFormVisibleEdit = true
      }
    }

	}
</script>

<style>
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
