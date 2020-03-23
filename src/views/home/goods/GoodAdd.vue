<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card" style="width: 98%">
      <el-alert title="添加商品信息" type="info" show-icon center :closable="closable"></el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="isActive * 1" finish-status="success" space="20%" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--Tab标签栏-->
      <el-form label-position="top" :model="goodsForm" :rules="rules" ref="formGoods">
        <el-tabs tab-position="left" @tab-click="tabClick()"  v-model="isActive" :before-leave="beforeLeave">
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
            <el-form-item label="商品分类">
              <!--级联选择器-->
              <div class="block">
                <el-cascader
                    :options="seletedOptions"
                    :props="{expandTrigger: 'hover',value:'cat_id',label: 'cat_name',children:'children'}"
                    v-model="value"
                    clearable
                >
                </el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item v-for="item in cateMany" :label="item.attr_name">
              <el-checkbox-group  v-model="item.attr_vals">
                <el-checkbox v-for="item1 in item.attr_vals" :label="item1"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item v-for="item in cate1Many" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-form-item>
              <el-upload
                  class="upload-demo"
                  action="http://127.0.0.1:8888/api/private/v1/upload"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :headers="headers"
                  list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <el-form-item>
              <!--富文本-->
              <quill-editor
                  v-model="goodsForm.goods_introduce"
                  style="height: 300px;"
              ></quill-editor>
            </el-form-item>
            <el-form-item class="button">
              <el-button type="primary" @click="addGoods">添加商品</el-button>
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
        seletedOptions:[],
        //设置默认显示的分类
        value:[],
        //动态参数
        cateMany:[],
        //静态参数
        cate1Many:[],
        //设置图片上传请求头
        headers:{
          Authorization:window.sessionStorage.getItem('token')
        }
      }
    },
    created() {
      this.getGoodCate()
    },
    methods:{
      //获取三级分类
      async getGoodCate(){
        const res = await this.$https.get(`/categories?type=3`)
        const {meta:{status,msg},data} = res.data
        //console.log(res)
        status === 200 ? this.seletedOptions = data : this.$message.warning(msg)
      },
      //切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
      beforeLeave(active,oldActive){
          if(oldActive === '0'&& this.value.length !== 3){
            this.$message.warning('请选择商品分类')
            return false
          }
      },
      //当tab标签页选中触发
      tabClick(){
        this.isActive === '1' && this.getGoodsCate()
        this.isActive === '2' && this.getGoodsCate1()
      },
      async getGoodsCate(){
        //获取分类id的三级动态参数
        const res = await this.$https.get(`categories/${this.value[2]}/attributes?sel=many`)
        const {meta:{msg,status},data} = res.data
        status === 200 ? this.cateMany = data : this.$message.warning(msg)
        //将动态参数的attr_vals对象转换为数组

        // this.cateMany.forEach(item => {
        //  item.attr_vals =  item.attr_vals.trim().split(',')
        // })
        this.cateMany.map(item => {
          //判断是否是空数组，如果为空，返回空数组
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          this.goodsForm.attrs.push({
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          })
        })
      },
      //获取三级分类的静态参数
      async getGoodsCate1(){
        const res = await this.$https.get(`categories/${this.value[2]}/attributes?sel=only`)
        const {meta:{msg,status},data} = res.data
        status === 200 ? this.cate1Many = data : this.$message.warning(msg)
        //console.log(this.cate1Many)
        this.cate1Many.map(item => {
          this.goodsForm.attrs.push({
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          })
        })
      },
      //点击已经上传的文件的钩子
      handlePreview(file){

      },
      //文件列表移除文件时的钩子
      handleRemove(file){
      let Index = this.goodsForm.pics.map((item,index) => {
        //当删除的图片在pics中存在，返回其index
         if(item.pic === file.response.data.tmp_path){
            return index
         }
      })
        this.goodsForm.pics.slice(Number(Index),1)
      },
      //文件上传成功时的钩子
      handleSuccess(file){
        //file.data.tmp_path 图片临时上传路径
        //console.log(file)
        this.goodsForm.pics.push({pic:file.data.tmp_path})
      },
      //添加商品
      addGoods(){
          this.$refs.formGoods.validate(async vaild => {
            if(!vaild){
              this.$message.warning('请正确填写商品表单信息')
              return false
            }
            this.goodsForm.goods_cat = this.value.join(',')
            const res = await this.$https.post('/goods',this.goodsForm)
            const {meta:{msg,status}} = res.data
            status === 201 ? this.$message.success(msg) : this.$message.error(msg)
            //console.log(this.goodsForm)
            this.$router.back()
          })

       },
      //返回上一级页面
      goBack(){
        this.$router.back()
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
