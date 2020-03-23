<template>
  <el-card>
    <div class="div">
      <h2>本网站用户访问来源</h2>
      <h4>纯属虚构娱乐</h4>
      <div id="myChart" :style="{width: '1200px', height: '600px'}"></div>
    </div>
  </el-card>
</template>

<script>
  let echarts = require('echarts')
  export default {
    name: "Welcome",
    mounted() {
      let myChart = echarts.init(document.getElementById('myChart'))
     let option = {
       tooltip: {
         trigger: 'item',
         formatter: '{a} <br/>{b} : {c} ({d}%)'
       },
       legend: {
         orient: 'vertical',
         left: 'left',
         data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
       },
       series: [
         {
           name: '访问来源',
           type: 'pie',
           radius: '55%',
           center: ['58%', '40%'],
           data: [
             {value: 335, name: '直接访问'},
             {value: 310, name: '邮件营销'},
             {value: 234, name: '联盟广告'},
             {value: 135, name: '视频广告'},
             {value: 1548, name: '搜索引擎'}
           ],
           emphasis: {
             itemStyle: {
               shadowBlur: 10,
               shadowOffsetX: 0,
               shadowColor: 'rgba(0, 0, 0, 0.5)'
             }
           }
         }
       ]
     };
      myChart.setOption(option)
    }
  }
</script>

<style scoped>
  .div h2{
    font-size: 22px;
    font-weight: 600;
    text-align: center;
  }
  .div h4{
    font-size: 14px;
    font-weight: 400;
    margin-top: 10px;
    text-align: center;
  }
</style>