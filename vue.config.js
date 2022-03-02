const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: "./", // 部署应用包时的基本 URL
  outputDir: "dist", // 生成的生产环境构建文件的目录
  transpileDependencies: false, // 是否对依赖文件进行旧代码兼容 @see https://cli.vuejs.org/zh/config/#transpiledependencies
  configureWebpack: undefined, // webpack配置项
  css: { // css 相关配置
    loaderOptions: {}, // 向css相关的loader传递选项
  },
  devServer: { // 开发服务器
    proxy: { //
      "/api": { // 代理地址 代理配置
        target: process.env.VUE_APP_REQUEST_URL, // 被代理的地址
        changeOrigin: true, // 修改源
        ws: true, // 启动 WebSocket
        pathRewrite: { // 路径重写
          "/^api": "/", // 将代理地址替换为空
        }
      }
    }
  },
  pluginOptions: {}, // 插件配置项
})
