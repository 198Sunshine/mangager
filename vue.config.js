module.exports = {
  lintOnSave: false,
  publicPath:'./',
  //配置别名
  configureWebpack:{
    resolve:{
      alias:{
        'assets':'@/assets',
        'common':'@/content',
        'components':'@/components',
        'views':'@/views',
        'plugins':'@/plugins'
      }
    }
  }
}
