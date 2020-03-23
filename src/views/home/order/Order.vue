<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <!--搜索框-->
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容"
                    v-model="orderForm.query"
                    clearable
                    class="input-with-select"
                    @clear="loadOrderList">
            <el-button slot="append"  @click="searchOrder" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table
          :data="orderList"
          border
          style="width: 100%">
         <el-table-column
            label="#"
             type="index"
             width="60">
         </el-table-column>
         <el-table-column
             prop="order_number"
             label="订单编号"
             width="180">
         </el-table-column>
         <el-table-column
             prop="order_price"
             label="价格"
             width="180">
         </el-table-column>
         <el-table-column
             prop="order_pay"
             label="是否付款">
           <template slot-scope="scope">
           <el-tag v-if="scope.row.order_pay === '0'" type="danger">未付款</el-tag>
           <el-tag v-else type="success">已付款</el-tag>
           </template>
         </el-table-column>
        <el-table-column
            prop="is_send"
            label="是否发货"
            width="180">
        </el-table-column>
        <el-table-column
            label="下单时间"
            width="180">
          <template slot-scope="scope">
            {{scope.row.create_time | fmtDate}}
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button
                type="primary"
                icon="el-icon-edit"
                plain
                size="mini"
                circle
                @click="editClickOrder(scope.row)"></el-button>
            <el-button
                type="success"
                icon="el-icon-location"
                plain
                size="mini"
                @click="sendClickOrder(scope.row)"
                circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :current-page.sync="orderForm.pageNum"
          :page-size="orderForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          class="page"
          :total="orderForm.totals">
      </el-pagination>
    </el-card>
    <!--对话框-->
    <el-dialog title="修改地址"  :visible.sync="dialogFormVisibleEdit" width="500px">
      <el-form :model="orderForm" label-position="left" label-width="80px">
      <el-form-item label="省市区/县">
          <el-cascader
              v-model="value"
              :options="city_data"
              :props="{ expandTrigger: 'hover',value:'value',label:'label',children:'children'}">
          </el-cascader>
      </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="orderForm.order_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleEdit = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="物流详情"  :visible.sync="dialogFormVisibleSend" width="800px">
      <el-form :model="orderForm" label-position="left" label-width="80px">
        <el-timeline :reverse="true">
        <el-timeline-item
            v-for="(item, index) in sendList"
            :key="index"
            :timestamp="item.time"
            icon="el-icon-location"
            type="primary"
            placement="top"
        >
          {{item.context}}
        </el-timeline-item>
        </el-timeline>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import city_data from "./city_data2017";
  export default {
    name: 'Order',
    data(){
      return{
        order_id:'',
       orderForm:{
         query:'',
         order_name:'',
         pageNum:1,
         pageSize:5,
         totals:0,
         user_id:'',
         pay_status:'',
         s_send:'',
         order_fapiao_title:[],
         order_fapiao_compony:'',
         order_fapiao_content:'',
         consignee_add:''
       },
        city_data,
        dialogFormVisibleEdit:false,
        dialogFormVisibleSend:false,
        orderList:[],
        value:[],
        //物流信息
        sendList:[]
      }
    },
    created() {
      //获取订单列表
      this.getOrderList()
    },
    methods:{
      // query查询参数可以为空
      // pagenum当前页码不能为空
      // pagesize每页显示条数不能为空
      // user_id 用户 ID可以为空this.getOrderList()
      // pay_status支付状态可以为空
      // s_send是否发货可以为空
      // order_fapiao_title['个人','公司']可以为空
      // order_fapiao_company公司名称可以为空
      // order_fapiao_content发票内容可以为空
      // consignee_addr发货地址可以为空
     async getOrderList(){
        const res = await this.$https.get(`/orders?query=${this.orderForm.query}
        &pagenum=${this.orderForm.pageNum}&pagesize=${this.orderForm.pageSize}`)
       const {meta:{status,msg},data:{goods,total}} = res.data
       this.orderForm.totals = total
       status === 200 ? this.orderList = goods : this.$message.warning(msg)
       //console.log(res)
     },
      handleSizeChange(val){
       this.orderForm.pageSize = val
        this.getOrderList()
      },
      handleCurrentChange(val){
       this.orderForm.pageNum = val
        this.getOrderList()
      },
      loadOrderList(){
        //重新刷新获取订单页面
        this.orderForm.query = ''
        this.getOrderList()
      },
      //搜索相关订单
      searchOrder(){
       this.getOrderList()
      },
      editClickOrder(){
        this.dialogFormVisibleEdit = true
      },
      //获取物流信息
      async getSendMessage(){
        const res = await this.$https.get(`/kuaidi/1106975712662`)
        const {meta:{msg,status}} = res.data
        status === 200 ?  this.sendList = res.data.data : this.$message.warning('获取物流信息失败')
        this.sendList = res.data.data
     },
      sendClickOrder(row){
        this.dialogFormVisibleSend = true
        this.order_id = row.order_id
        this.getSendMessage()
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
  .input-with-select{
    float: left;
    width: 300px;
    margin:10px 0 ;
  }
  .button{
    float: left;
    margin: 10px;
  }
</style>
