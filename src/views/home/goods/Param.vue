<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning"  show-icon left :closable="closable"></el-alert>
      <!--视图-->
      <el-form v-model="parmForm">
        <el-form-item label="选择商品分类：">
          <!--级联选择器-->
          <div class="block">
            <el-cascader
                :options="seletedOptions"
                :props="{expandTrigger: 'hover',value:'cat_id',label: 'cat_name',children:'children'}"
                v-model="value"
                clearable
                @change="getParamList"
            >
            </el-cascader>
            <!--tab标签页-->
            <el-form-item>
              <el-tabs tab-position="top"
                       style="height: 200px;"
                       :before-leave="tabLeave">
                <el-tab-pane label="动态参数">
                  <el-form-item>
                    <el-button
                        type="primary"
                        :disabled="isdisabled"
                        size="mini"
                        @click="addClick">添加参数
                    </el-button>
                  </el-form-item>
                  <!--表格-->
                  <el-table :data="paramList" border style="width: 100%;font-size: 12px;">
                    <!--tag标签-->
                    <el-table-column  prop="" width="50px" type="expand">
                      <template slot-scope="scope">
                        <el-tag
                            :key="index"
                            v-for="(tag,index) in scope.row.attr_vals"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(scope.row,index)">
                          {{tag}}
                        </el-tag>
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                    </el-table-column>
                    <!--索引-->
                    <el-table-column
                        prop=""
                        type="index"
                        width="min-width">
                    </el-table-column>
                    <el-table-column
                        prop="attr_name"
                        :label="parmForm.parmName"
                        width="645">
                    </el-table-column>
                    <!--操作-->
                    <el-table-column
                        label="操作"
                        width="645">
                      <template slot-scope="scope">
                        <el-row>
                          <el-button type="primary"
                                     size="mini"
                                     icon="el-icon-edit"
                                     circle
                                     @click="editClick(scope.row)"></el-button>
                          <el-button type="danger"
                                     size="mini"
                                     icon="el-icon-delete"
                                     circle
                                     @click="delParam(scope.row.attr_id)"></el-button>
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <!--静态参数面板-->
                <el-tab-pane label="静态属性">
                  <el-form-item>
                    <el-button
                        type="primary"
                        :disabled="isdisabled"
                        size="mini"
                        @click="addClick">添加属性
                    </el-button>
                  </el-form-item>
                  <!--表格-->
                  <el-table :data="paramList" border style="width: 100%;font-size: 12px;">
                    <el-table-column
                        prop=""
                        width="50px"
                        type="expand"
                    >
                      <template slot-scope="scope">
                        <el-tag
                            :key="index"
                            v-for="(tag,index) in scope.row.attr_vals"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(scope.row,index)">
                          {{tag}}
                        </el-tag>
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else
                                   class="button-new-tag" size="small"
                                   @click="showInput(scope.row)" aria-placeholder="1">
                          +New tag
                        </el-button>
                      </template>
                    </el-table-column>
                    <!--索引-->
                    <el-table-column
                        prop=""
                        type="index"
                        width="min-width">
                    </el-table-column>
                    <el-table-column
                        prop="attr_name"
                        :label="parmForm.parmName"
                        width="645">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="645">
                      <template slot-scope="scope">
                        <el-row>
                          <el-button type="primary"
                                     size="mini"
                                     icon="el-icon-edit"
                                     circle
                                     @click="editClick(scope.row.attr_id)"></el-button>
                          <el-button type="danger"
                                     size="mini"
                                     icon="el-icon-delete"
                                     circle
                                     @click="delParam(scope.row.attr_id)"></el-button>
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </div>
        </el-form-item>

        <!--弹出添加参数对话框-->
        <el-dialog :title="parmForm.addParmTitle"
                   :visible.sync="dialogFormVisibleAdd"
                   width="500px">
          <el-form class="form"
                   :model="form"
                   label-position="left"
                   ref="parForm"
                   label-width="80px">
            <el-form-item :label="parmForm.parmName" prop="name">
              <el-input v-model="form.attr_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addParam">确 定</el-button>
          </div>
        </el-dialog>
        <!--编辑参数对话框-->
        <el-dialog :title="parmForm.editParmTitle"
                   :visible.sync="dialogFormVisibleEdit"
                   width="500px"
                   @close="editClose"
        >
          <el-form class="form"
                   label-position="left"
                   label-width="80px"
                   ref="parForm">
            <el-form-item :label="parmForm.parmName" prop="name">
              <el-input v-model="form.attr_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editParam">确 定</el-button>
          </div>
        </el-dialog>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        closable:false,
        //设置按钮是否禁用
        isdisabled:true,
        seletedOptions:[],
        //设置默认显示的分类
        value:[],
        //参数列表
        paramList:[],
        //attr_sel
        attr_sel:'',
        attr_id:0,
        //表单数据
        form:{
          attr_name:''
        },
        attr_vals:[],
        //设置动态列表参数
        parmForm:{
          parmName:'',
          addParmTitle:'',
          editParmTitle:''
        },
        dialogFormVisibleAdd:false,
        dialogFormVisibleEdit:false,
        //input的样式
        inputVisible:false,
        inputValue:''
      }
    },
    created() {
      this.getGoodCate()
    },
    methods: {
      //获取三级分类
      async getGoodCate() {
        const res = await this.$https.get(`/categories?type=3`)
        const {meta: {status, msg}, data} = res.data
        //console.log(res)
        status === 200 ? this.seletedOptions = data : this.$message.warning(msg)
      },
      //当节点改变时,请求参数
      async getParamList() {
        //请求路径：categories/:id/attributes
        if (this.value.length === 3) {
          //获取动态参数列表
          const res = await this.$https.get(`categories/${this.value[2]}/attributes?sel=${this.attr_sel}`)
          //获取attr_vals
          res.data.data.forEach(item => {
            //判断是否为空数组
            item.attr_vals = item.attr_vals.length !== 0 ? item.attr_vals.split(',') : []
            item.inputValue = ''
            item.inputVisible = false
          })
          this.paramList = res.data.data

          this.isdisabled = false
        }
      },
      //tabs切换时判断状态
      tabLeave(activeName) {
        //console.log(activeName)
        //0表示动态参数tab,1表示静态属性tab
        if (activeName === '0') {
          this.attr_sel = 'many'
          this.parmForm = {
            parmName: '参数名称',
            addParmTitle: '添加动态参数',
            editParmTitle: '修改动态参数'
          }
        } else {
          this.attr_sel = 'only'
          this.parmForm = {
            parmName: '属性名称',
            addParmTitle: '添加静态属性',
            editParmTitle: '修改静态属性'
          }
        }
        this.getParamList()
      },
      //点击弹出添加参数对话框
      addClick() {
        this.dialogFormVisibleAdd = true
      },
      //添加动态参数
     async addParam() {
          this.dialogFormVisibleAdd = false
          //请求路径：categories/:id/attributes
          //:id分类 ID不能为空`携带在url中
          // attr_name参数名称不能为空
          // attr_sel[only,many]不能为空
          // attr_vals如果是 many 就需要填写值的选项，以逗号分隔【可选参数】
          const res = await this.$https.post(
            `categories/${this.value[2]}/attributes`,
            {
              attr_name: this.form.attr_name,
              attr_sel: this.attr_sel,
              attr_vals: this.attr_vals.join(',')
            }
          )
          res.data.meta.status === 201 ? this.$message.success(res.data.meta.msg) : this.$message.warning(res.data.meta.msg)
          //清空表单元素
          this.form = {}
          this.getParamList()
      },
      //删除商品参数/属性
      delParam(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$https.delete(`categories/${this.value[2]}/attributes/${id}`)
          const {meta: {status, msg}} = res.data
          status === 200 ? this.$message.success(msg) : this.$message.warning(msg)
          //console.log(id)
          this.getParamList()
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },
      // 更新参数/属性
      async updateParm(row) {
        const res = await this.$https.put(`categories/${this.value[2]}/attributes/${this.attr_id}`,
          {
          //attr_name新属性的名字不能为空，携带在`请求体`中
          // attr_sel属性的类型[many或only]不能为空，携带在`请求体`中
          // attr_vals参数的属性值可选参数，携带在`请求体`中id
          attr_name: this.form.attr_name,
          attr_sel: this.attr_sel,
          attr_vals: row.attr_vals.join(',')
        })
        //console.log(res)
        const {meta: {status, msg}} = res.data
        status === 200 ? this.$message.success('修改参数成功') : this.$message.warning(msg)
      },
      //点击弹出编辑对话框
      editClick(row) {
        this.dialogFormVisibleEdit = true
        this.attr_id = row.attr_id
        this.form.attr_name = row.attr_name
      },
      //编辑动态参数
      editParam(){
          let row = {}
          this.paramList.forEach(item => {
            row = item
          }
          )
          this.updateParm(row)
          //清除form表单
          this.form = {}
          this.dialogFormVisibleEdit = false
      },
      //监听编辑弹框关闭
      editClose(){
        this.getParamList()
      },
      //删除tag
      async handleClose(row,i) {
        this.form.attr_name = row.attr_name
        this.attr_id = row.attr_id
        row.attr_vals.splice(i, 1)
        //console.log(row)
        this.updateParm(row)

      },
      showInput() {
       this.inputVisible = true
        this.inputValue = '+New tag'
        //   让输入框自动获取焦点
        // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ' '
          row.inputVisible = false
          return
        }
        this.form.attr_name = row.attr_name
        this.attr_id = row.attr_id
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = true
        this.updateParm(row)
    }
    }
  }
</script>

<style scoped>
  .box-card{
    height:600px;
    overflow: auto;
    text-align: left;
    margin-top: 10px;
  }
  .el-alert{
    margin-bottom: 10px;
  }
  .block{
    text-align: left;
  }
  .form{
    text-align: left;
  }
  .tag{
    margin-right: 15px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
