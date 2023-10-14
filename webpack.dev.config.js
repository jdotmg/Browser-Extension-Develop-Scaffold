const path = require('path')
const CopeWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

console.log(`当前环境：${process.env.NODE_ENV}`)
const distDir = `${path.resolve('dist')}/dev`
// 用于复制不参与编译的文件
const copyMap = [
    // 插件配置文件
    {
        from: path.resolve('manifest.json'), to: `${distDir}/manifest.json`
    },
    // 本地图片目录
    {
        from: path.resolve('assets'), to: `${distDir}/assets`
    },
    // 公共文件目录
    {
        from: path.resolve('public'), to: `${distDir}/`
    }
]
// webpack配置信息
module.exports = {
    mode: process.env.NODE_ENV,
    optimization: {
        minimize: true, // 启用代码压缩，可选
        minimizer: [new TerserPlugin({
            extractComments: false
        })] // 关闭创建代码中的注释文件
    }, // 入口文件
    entry: {
        background: "./src/background.ts",
        popup: "./src/popup.ts",
        content: './src/content.ts'
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: './dist' // 开发阶段服务器的根目录
    },
    // 指定打包文件所在目录
    output: {
        path: path.resolve(__dirname, `dist/dev`),
        filename: "js/[name].js", // 编译打包后的js文件名称
    },
    // 用来指定那些模块可以用来备注引入
    resolve: {
        extensions: ['.ts', ',js']
    },
    // 指定webpack的打包使用的模块
    module: {
        rules: [{
            test: /\.ts$/, // 规则生效的文件
            use: {
                loader: "ts-loader", // 要使用的loader
            }, exclude: /node_modules/, //编译排除的文件
        }]
    },
    plugins: [new CleanWebpackPlugin(), new CopeWebpackPlugin({
        patterns: copyMap
    })]
}