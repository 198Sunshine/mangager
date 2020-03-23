<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <div id="myChart" :style="{width: '1100px', height: '500px'}"></div>
    </el-card>
  </div>
</template>

<script>
  let echarts = require('echarts')
	export default {
    data(){
      return {
        options:{}
      }
    },
    mounted() {
      this.getReport()
    },
    methods: {
      async getReport() {
        const res = await this.$https.get('reports/type/1')
        const {meta: {status}} = res.data
        status === 200 ? this.list = res.data : this.$message.warning('获取报表数据失败')
        console.log(res)
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
       let options1 = {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
              axisPointer: {
              type: 'cross',
                label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
           xAxis: [
             {
               boundaryGap: false
             }
           ],
           yAxis: [
             {
               type: 'value'
             }
           ]
        }
        let options2 = res.data.data
        let option = {...options1,...options2}
        this.options = option
        myChart.setOption(option)
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
</style>
