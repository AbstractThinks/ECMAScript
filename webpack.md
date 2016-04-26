        module.exports = {
          entry: [
            'webpack-dev-server/client?http://127.0.0.1:9090',
            'webpack/hot/dev-server',
            './app/app.js'      //入口文件
          ],
          output: {
            path: __dirname + '/build/js/',     ／／入口文件输出默认路径
            // publicPath: "http://127.0.0.1:9090/asset/",  
            //公共文件输出默认路径，如在js文件中引入的css及css中引入的图片文件等
            filename: 'bundle.js'       ／／入口文件输出默认名字
          },
          resolve: {
            extensions: ['', '.js', '.jsx']
          },
          module: {
            loaders: [
              { 
                test: /\.js$/, 
                loader: 'babel', 
                exclude: /node_modules/,
                query: {
                  presets: ['es2015', 'react', 'stage-0', 'stage-1'] 
                }
              },
              // { test: /\.css$/, loader: '"style!css' },
              // { test: /\.less/, loader: 'style-loader!css-loader!autoprefixer-loader!less-loader' }, 
              { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192&name=../../asset/img/[name].[ext]'},
              ／／设置css中引入的图片的输出路径及名称设置。
              {
                test: /\.scss$/,
                loader:ExtractTextPlugin.extract("css!sass")
                ／／设置样式输出文件
              }
            ]
          },
          plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new ExtractTextPlugin('../../asset/css/app.css')
            ／／设置样式输出文件的名字及路径
          ]
        };
