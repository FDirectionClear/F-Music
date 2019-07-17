const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin }= require('clean-webpack-plugin')
const Webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const axios = require('axios')

// 封装一个resolve方法，返回绝对路径
const resolve = (src) => path.resolve(__dirname,src)

module.exports = {
    mode:"development",
    entry:{
        main:"./src/index.js"
    },
    output:{
        path:path.resolve(__dirname,'bundle'),
        filename:"[name].[hash:4].js"
    },
    devtool:"cheap-module-eval-source-map",
    devServer:{
        contentBase:"./bundle",
        open:true,
        hot:true,
		hotOnly:false,
		before(app) {
			// 一些公共的请求头参数可以抽取出出来统一维护
			const baseHeader = {
				referer: 'https://c.y.qq.com/',
				host: 'c.y.qq.com'
			}

			// 获取轮播图的相关数据
			app.get('/api/getSliderMessage', function (req, res) {
				// 通过devServer挂一个代理来伪装referer和host等参数，从而欺骗qq音乐的服务器
				const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
				axios.get(url, {
					headers: Object.assign({},baseHeader),
					params: req.query
				}).then((response) => {
					// 在接收到qq音乐相应的数据后向前端发送一个json响应
					res.json(response.data)
				}).catch((e) => {
					console.log(e)
				})
			})

			// 获取热门歌单数据
			app.get('/api/getHotList', function (req, res) {
				  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
				  axios.get(url, {
					headers: Object.assign({},baseHeader),
					params: req.query
				  }).then((response) => {
					res.json(response.data)
				  }).catch((e) => {
					console.log(e)
				  })
			})
		}
	},
	resolve:{
		extensions:['.js','.vue','.json','.styl'],
		alias:{
			'@':resolve('./src'),
			'common':resolve('./src/common'),
			'components':resolve('./src/components'),
			'base':resolve('./src/base'),
			'api':resolve('./src/api')
		}
	},
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'babel-loader',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // {
            //     test:/\.(js|vue)$/,
            //     loader:'eslint-loader',
            //     exclude:/node_modules/,
            //     enforce:'pre'  // 保证.js 和 .vue文件在执行的时候率先被eslint-loader处理，相反可以选post
            // },
            {
                test:/\.(jpg|png|jpeg|gif|svg)$/,
                use:{
                    loader:"url-loader",
                    options:{
                        outputPath:"images/",
                        name:"[name].[hash:4].[ext]",
                        limit:"200"
                    }
                }
			},
			{
                test:/\.(eot|svg|ttf|woff)$/,
                use:{
                    loader:"file-loader",
                }
            },
            {
                test:/\.css$/,
                use:[
                    'vue-style-loader',
                    {
                        loader:'css-loader',
                        options:{ importLoaders:1 }
                    },
                    'postcss-loader', // postloader 应该最先执行
                ]
            },
            {
                test:/\.scss/,
                use:[
                    'vue-style-loader',
                    {
                        loader:'css-loader',
                        options:{ importLoaders:2 }
                    },
                    'postcss-loader', // 应该在sass/stylus-loader之后执行
                    'sass-loader'
                ]
            },
            {
                test: /\.styl(us)?$/,
                use:[
                    'vue-style-loader',
                    {
                        loader:'css-loader',
                        options:{ importLoaders:2 }
                    },
                    'postcss-loader',
                    'stylus-loader'
                ]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        }),
        new CleanWebpackPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin()
    ]
}

