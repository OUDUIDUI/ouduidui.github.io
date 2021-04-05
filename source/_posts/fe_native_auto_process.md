---
title: 前端原生开发的一些自动化处理
date: 2021-03-31 10:27:32
tags: [前端,html,gulp,node]
categories: [Node]
sticky: 1
---

> [Github](https://github.com/OUDUIDUI/native-template)

##  初始目录设置

在最初将文件进行合理归纳，有助于后期的项目打包工作。

```shell
├─index.html                    # HTML页面
├─src                           
|  ├─static                     # 静态文件路径
|  |   └favicon.png
|  ├─js                         # JavaScript文件路径
|  | └main.js
|  ├─css                        # CSS文件路径
|  |  └style.css
```

## 项目运行同步预览

使用原生开发页面有一个问题，就是在测试的时候你得不断去刷新页面，而不会实时监听你的文件改动而进行刷新同步。

当然我们可以使用`VSCODE`去进行开发，使用`live server`插件去进行同步预览。

但不是每个人都是用`VSCODE`进行项目开发的，因此我们还是使用`node`去实现项目的同步预览。

```she
// 初始化Node
yarn

// 安装browser-sync
yarn add browser-sync
```

这里我使用`browser-sync`，更多的使用方法可以去[官网](https://browsersync.io/)查看，这里就不多说了。

安装完成后，打开命令行工作，执行以下命令。

```shell
// 进入项目路径
cd nativeTemplate

// 实行browsersync(监听html、css、js文件)
browser-sync start --server --files "*.html, src/css/*.css, src/js/*.js"
```

但每次开始项目都得去执行命令就会比较麻烦，我们可以将其配置到`package.json`中。

```json
{
  "scripts": {
    "serve": "browser-sync start --server --files \"*.html, src/css/*.css, src/js/*.js\""
  }
}
```

这样子我们以后只需要执行`yarn serve`就可以运行项目了。

## 配置跨域

当你原生开发然后需要对接接口的时候，配置跨域就是一个挺头疼的事情了。

当然你可以让后端将接口设置CORS跨资源共享，达到跨域的目的。

然而我们也可以使用`http-server`来实现跨域配置。

```shell
// 安装http-server
yarn add http-server
```

具体的使用操作我也不多说了，可以去看一下[文档说明](https://www.npmjs.com/package/http-server)。这里就只讲讲我们跨域要用到的操作。

我们先执行下面的命令，开启本地8888端口，然后重定向到我们的API接口。

```shell
http-server -p 8888 --cors -P https://jsonplaceholder.typicode.com
```

当然你依旧可以配置到`package.json`里，然后执行`yarn http-server`进行启动。

```json
{
  "scripts": {
    "http-server": "http-server -p 8888 --cors -P https://jsonplaceholder.typicode.com"
  }
}
```

然后这时候，我们就可以在`main.js`进行请求接口了。

```javascript
const baseApi = 'http://localhost:8888';

// 请求数据 （跨域请求）
function request() {
    fetch(baseApi + '/posts')
        .then(response => response.json())
        .then(data => console.log(`Request success!`, data))
}

request();
```

当然这个只能用于前端调试用，当项目实现后，我们可将`baseApi` 改为`/api`,然后让后端使用`nginx`去重定向既可。

## 项目打包

按理而言，使用原生开发是可以不需要打包项目的，直接部署就可以的。

但在实际开发中，还是需要进行项目的打包，一是将文件继续压缩，二是将静态文件进行重命名处理，防止缓存问题。

这里我们使用`gulp`来实现项目打包的自动化处理。

```shel
// 安装
yarn gulp gulp-cssmin gulp-htmlmin gulp-rev gulp-rev-collector gulp-uglify del
```

这里的`gulp-cssmin`、`gulp-htmlmin`、`gulp-uglify`是用于压缩css、html、js文件；`gulp-rev`、` gulp-rev-collector`、`del`是用于重命名静态文件处理的。

安装完成后，在根路径新建一个`gulpfile.js`文件，先把安装的东西引入。

```javascript
const gulp = require('gulp');
const rev = require('gulp-rev');
const del = require('del');
const revCollector = require('gulp-rev-collector');
const uglify = require('gulp-uglify');
const htmlMin = require('gulp-htmlmin');
const cssMin = require('gulp-cssmin');
```

然后我们先来实现css的压缩和重命名。

```javascript
gulp.task('rev:css', () => {
    return gulp.src('src/css/*.css')
        .pipe(rev())        // 将所有匹配到的文件名全部生成相应的版本号
        .pipe(cssMin())      // 压缩CSS
        .pipe(gulp.dest('dist/assets'))  // 将压缩好的新css文件保存到dist/assets路径下
        .pipe(rev.manifest())   //把所有生成的带版本号的文件名保存到rev-manifest.json文件中
        .pipe(gulp.dest('rev/css'))   //把rev-manifest.json文件保存到指定的路径
})
```

然后执行`gulp rev:css`命令后，路径下会多出了`dist`和`rev`文件夹，`dist/assets`路径下会有打包好的`css`文件，而在`rev/css`下会有一个`rev-manifast.json`文件，里面存放着文件名的映射表，用于后面更换`index.html`里的文件引入。

同理的我们也可以实现对`JavaScript`和其他静态文件的压缩和重命名处理。

```javascript
gulp.task('rev:js', () => {
    return gulp.src('src/js/*.js')
        .pipe(rev())
        .pipe(uglify())      // 压缩JS
        .pipe(gulp.dest('dist/assets'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
})

gulp.task('rev:static', () => {
    return gulp.src('src/static/**')
        .pipe(rev())
        .pipe(gulp.dest('dist/assets'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/static'))
})
```

然后依次执行`gulp rev:js`和`gulp rev:static`。

之后我们需要对`index.html`里面的引入进行替换。

```javascript
gulp.task('rev-collector', () => {
    return gulp.src(['rev/**/*.json', './*.html'])
        .pipe(revCollector({
            dirReplacements: {     // 对引入路径进行重置
                'src/css': 'assets',
                'src/js': 'assets',
                'src/static': 'assets'
            },
            replaceReved: true
        }))
        .pipe(htmlMin({         // 压缩HTML
            collapseWhitespace:true,
            collapseBooleanAttributes:true,
            removeComments:true,
            removeEmptyAttributes:true,
            removeScriptTypeAttributes:true,
            removeStyleLinkTypeAttributes:true,
            minifyJS:true,
            minifyCSS:true
        }))
        .pipe(gulp.dest('dist'))
})
```

执行`gulp rev-collector`后，既可在`dist`路径下看到新生成的`index.html`文件，此时我们项目打包的基础工作就做好了。

但如果我们后面还需要修改文件后再进行项目打包时，我们需要事前清理`dist`文件下的所有文件，不然的话就会累积着上次的文件，而不会被迭代掉。并且，对于`rev`文件夹也是如此，当项目打包结束后，该文件夹也没有任何作用了，也可以进行删除处理。

因此我们需要进行一个清理文件的工作。

```javascript
// 删除文件
gulp.task('clean:init', (cb) => {
    return del(['dist/*', 'rev/*'], cb)
})

gulp.task('clean:rev', (cb) => {
    return del(['rev'], cb)
})
```

这时候，我们在`gulpfile.js`中设置了6个自动化任务，并且每次都需要按照一定的顺序去执行任务，因此我们可以将所有任务进行一个整合。

```javascript
gulp.task('build', gulp.series(
    'clean:init',
    gulp.parallel('rev:js', 'rev:css', 'rev:static'),
    'rev-collector',
    'clean:rev'
))
```

现在我们可以执行`gulp build`实现全部打包动作。

简单说一下自动化工作流程：

- 首先执行`clean:init`，将原本的`dist`和`rev`文件清空删除。
- 其次同步执行`rev:js`、 `rev:css`、 `rev:static`，对全部静态文件进行压缩和重命名处理。
- 接着执行`rev-collector`，对`index.html`进行文件引入的更换。
- 最后执行`clean:rev`，将`rev`文件夹删除。

同样，我们也可以将其配置到`package.json`中。

```json
{
  "scripts": {
    "build": "gulp build"
  }
}
```

然后执行`yarn build`既可进行项目打包。

## 项目目录说明

```shell
├─index.html                    # HTML页面
├─src                           
|  ├─static                     # 静态文件路径
|  |   └favicon.png
|  ├─js                         # JavaScript文件路径
|  | └main.js
|  ├─css                        # CSS文件路径
|  |  └style.css
├─dist                          # 打包文件路径
|  ├─index.html
|  ├─assets
|  |   ├─favicon-a35b664aff.png
|  |   ├─main-ce0b6aa357.js
|  |   └style-118e221845.css
├─gulpfile.js                  # gulp配置文件
├─README.md                    # 说明文档
├─package.json                 # node配置文件
```

