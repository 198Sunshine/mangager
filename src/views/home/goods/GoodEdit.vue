<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>信息编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card" style="width: 98%">
      <el-alert title="编辑商品信息" type="info" show-icon center :closable="closable"></el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="isActive * 1" finish-status="success" space="20%" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--Tab标签栏-->
      <el-form label-position="top" :model="goodsForm" :rules="rules" ref="formGoods">
        <el-tabs tab-position="left"   v-model="isActive" >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name" >
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"  prop="goods_price">
              <el-input v-model="goodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"  prop="goods_number">
              <el-input v-model="goodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"  prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight" type="double"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!--商品图片上传-->
          <el-tab-pane name="1" label="商品图片">
            <el-form-item>
              <el-upload
                  class="upload-demo"
                  action="http://127.0.0.1:8888/api/private/v1/upload"
                  :headers="headers"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <!--富文本编辑-->
          <el-tab-pane name="2" label="商品内容">
            <el-form-item>
              <quill-editor
                  v-model="goodsForm.goods_introduce"
                  style="height: 300px;"
              ></quill-editor>
            </el-form-item>
            <el-form-item class="button">
              <el-button type="primary" @click="editClick">提交商品信息</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  //导入富文本编辑器
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: "GoodChild",
    components:{
      quillEditor
    },
    data(){
      return{
        closable:false,
        //步骤栏默认活跃位置
        isActive:0,
        //表单数据
        goodsForm:{
          goods_name:'',
          goods_price:'',
          goods_cat:'',
          goods_number:'',
          goods_weight:'',
          goods_introduce:'',
          attrs:[],
          pics:[]
        },
        //表单验证规则
        rules:{
          goods_name:[
            { required: true, message: '请输入商品名称',trigger:'blur'},
          ],
          goods_price:[
            {required:true,message:'请输入商品价格',trigger:'blur'},
          ],
          goods_number:[
            {required:true,message:'请输入商品数量',trigger:'blur'},
          ],
          goods_weight:[
            {required:true,message:'请输入商品价格',trigger:'blur'},
          ]
        },
        //设置图片上传请求头
        headers:{
          Authorization:window.sessionStorage.getItem('token')
        }
      }
    },
    created() {
      this.getGoodsList()
    },
    methods:{
      async getGoodsList(){
        const res = await this.$https.get(`/goods/${this.$route.query.id}`)
        const {meta:{msg,status}} = res.data
        status === 200? this.goodsForm = res.data.data : this.$message.warning('获取商品列表失败')
        //console.log(res)
      },
      async editClick(){
        const res =await this.$https.put(`/goods/${this.$route.query.id}`,this.goodsForm)
        const {meta:{status}} = res.data
        status === 200 ? this.$message.success('商品信息修改成功') : this.$message.warning('商品信息修改失败,重新尝试修改')
        //重新跳转到商品列表页面
        this.$router.push('/goods')
      },
      //图片上传成功
      handleSuccess(file){
        let tmp_path = file.data.tmp_path
        this.goodsForm.pics.push(tmp_path)
      },
      //图片删除成功
      handleRemove(file){
        let tmp_path = file.response.data.tmp_path
        this.goodsForm.pics.splice(tmp_path)
      }
    }
  }
</script>

<style scoped>
  .box-card{
    height: 100%;
    margin-top: 10px;
    text-align: left;
  }
  .el-steps{
    margin-top: 20px;
  }
  .el-tabs{
    margin-top: 10px;
  }
  .button{
    margin-top: 80px;
    text-align: right;
  }
</style>
