---
title: 简单实现VUE-Router
date: 2021-04-09 21:59:18
tags: [vue,vue-router]
categories: [Vue]
sticky: 1
---
> [github](https://github.com/OUDUIDUI/vue-source-code-study/tree/vue_router)

# vue-router 
`Vue-router`是`Vue.js`官方的路由管理器。

它和`Vue.js`的核心深度集成，让构建单页面应用变得易如反掌。

## 安装
```shell script
vue add router
```

## 核心步骤
-  步骤一：使用`vue-router`插件
```javascript
//router.js
import Router from 'vue-router';

/*
* VueRouter是一个插件
*   1）实现并声明两个组件router-view router-link
*   2）install: this.$router.push()
* */
Vue.use(Router);  // 引入插件
```

- 步骤二：创建Router实例
```javascript
// router.js
export default new Router({...})   // 导出Router实例
```

- 步骤三：在根组件添加该实例
```javascript
// main.js
import router from './router';
new Vue({
    router   // 添加到配置项
}).$mount("#app")
```

- 步骤四：添加路由视图
```vue
<!--  App.vue  -->
<router-view></router-view>
```

- 步骤五：导航
```vue
<router-link to="/">Home</router-link>
<router-link to="/about">About</router-link>
```
```javascript
this.$router.push('/');
this.$router.push('/about')
```

# vue-router简单实现
## 需求分析
- 单页面应用程序中，`url`发生变化时候，不能刷新，显示对应视图
  - hash：`#/about`
  - History api：`/about`
- 根据`url`显示对应的内容
  - `router-view`
  - 数据响应式：`current`变量持有`url`地址，一旦变化，动态执行`render`

## 任务

- 实现一个插件
  - 实现`VueRouter`类
    - 处理路由选项
    - 监控`url`变化
    - 响应变化
  - 实现`install`方法
    - `$router`注册
    - 两个全局组件

## 实现

### 创建新的插件

在`Vue2.x`项目中的`src`路径下，复制一份`router`文件，重命名为`ou-router`。

然后在`ou-router`路径下新建一个`ou-vue-router.js`文件，并将`index.js`文件中的`VueRouter`引入改为`ou-vue-router.js`。

```javascript
import VueRouter from './ou-vue-router'
```

同时将`main.js`中的`router`引入也修改一下。

```javascript
import router from './ou-router'
```

### 创建Vue插件

关于Vue插件的创建：

- 可以使用`function`实现，也可以使用`object`或`class`实现；
- 要求必须有一个`install`方法，将来会被`Vue.use()`使用

```javascript
let Vue;   // 保存Vue的构造函数，插件中需要用到

class VueRouter {}

/*
* 插件：实现install方法，注册$router
*   参数1是Vue.use()一定会传入
* */
VueRouter.install = function (_Vue) {
    Vue = _Vue;  // 引用构造函数，VueRouter中要使用
}

export default VueRouter;
```

### 挂载`$router`

当我们发现`vue-router`引入`vue`的时候，第一次是在`router/index.js`中使用了`Vue.use(Router)`，在这个时候也就会调用了`vue-router`的`install`方法；而第二次则是在`main.js`中，创建根组件实例的时候引入`router`,即`new Vue({router}).$mount("#app")`。

也就是说，当调用`vue-router`的`install`方法的时候，项目还没有创建`Vue`的根组件实例。因此我们需要在`vue-router`的`install`方法使用全局混入，延迟到`router`创建完毕才执行挂载`$router`。

```javascript
let Vue;   // 保存Vue的构造函数，插件中需要用到

class VueRouter {}

/*
* 插件：实现install方法，注册$router
*   参数1是Vue.use()一定会传入
* */
VueRouter.install = function (_Vue) {
    Vue = _Vue;  // 引用构造函数，VueRouter中要使用

    /* 挂载$router */
    /*
    * 全局混入
    *   全局混入的目的是为了延迟下面逻辑到router创建完毕并且附加到选项上时才执行
    * */
    Vue.mixin({
        beforeCreate() {    // 此钩子在每个组件创建实例时都会调用
            /* this.$options即创建Vue实例的第一个参数 */
            if(this.$options.router){   // 只在根组件拥有router选项
                Vue.prototype.$router = this.$options.router;  // vm.$router
            }

        }
    })
}

export default VueRouter;
```

### 注册全局组件`router-link`和`router-view`

首先在`install`方法中注册两个全局变量。

```javascript
let Vue; 

class VueRouter {}

VueRouter.install = function (_Vue) {
    Vue = _Vue;

    Vue.mixin({
        ...
    })

    /* 注册全局组件router-link和router-view */
    Vue.component('router-link',{
        render(createElement){
            return createElement('a','router-link');     // 返回虚拟Dom
        }
    });
    Vue.component('router-view',{
        render(createElement){
            return createElement('div','router-view');   // 返回虚拟Dom
        }
    })
}

export default VueRouter;
```

#### 实现`router-link`

- `router-view`是一个`a`标签
- 将`router-view`的`to`属性设置到`a`标签的`herf`属性（先默认使用`hash`方法）
- 获取`router-view`的插槽内容，插入`a`标签中

```javascript
 Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            }
        },

        render(createElement) {      // 返回虚拟Dom
            return createElement('a',
                {
                    attrs: {href: '#' + this.to}    // 设置a标签的href属性
                },
                this.$slots.default    // 获取标签插槽内容
            );
        }
    });
```

#### 实现`router-view`

`router-view`实质上根据`url`的变化，实时响应渲染对应的组件，而`createElement`函数是可以传入一个组件参数的。

因此，我们不进行渲染任何内容，后面实现监听`url`变化后，从映射表获取到组件后，再来实现`router-view`。

```javascript
Vue.component('router-view', {
        render(createElement) {
            let component = null;
            return createElement(component);   // 返回虚拟Dom
        }
    })
```

### 监听`url`变化

我们在`VueRouter`类的`constructor`函数中监听`url`的变化，这里我们默认使用`hash`方式。

而且，我们需要将存入`url`的变量设置为**响应式**数据，这样子当其发生变化的时候，`router-view`的`render`函数才能够再次执行。

```javascript
class VueRouter {
    /*
    * options:
    *   mode: 'hash'
    *   base: process.env.BASE_URL
    *   routes
    * */
    constructor(options) {
        this.$options = options;

        // 将current设置为响应式数据，即current变化时router-view的render函数能够再次执行
        const initial = window.location.hash.slice(1) || '/';
        Vue.util.defineReactive(this, 'current',initial);

        // 监听hash变化
        window.addEventListener('hashchange', () => {
            this.current = window.location.hash.slice(1);
        })
    }
}
```

因此，我们可以来实现`router-view`组件。

在`render`函数中，`this.$router`指向的是`VueRouter`创建的实例，因此我们可以通过`this.$router.$option.routes`获取路由映射表，`this.$router.current`获取当前路由，然后通过遍历匹配获取组件。

```javascript
Vue.component('router-view', {
  	render(createElement) {
    		let component = null;
   		 // 获取当前路由对应的组件
   		 const route = this.$router.$options.routes
    			.find(route => route.path === this.$router.current);

  		  if (route) {
  				    component = route.component;
  		  }
  		  return createElement(component);   // 返回虚拟Dom
 		 }
})
```

### 实现`history`模式

前面的实现都默认为`hash`模式，接下来简单实现一下`history`模式。

首先将监听`url`的代码优化一下，并判别`mode`的值来设置`current`的初始值，而`history`模式下初始值为`window.location.pathname`。

```javascript
class VueRouter {
    /*
    * options:
    *   mode: 'hash'
    *   base: process.env.BASE_URL
    *   routes
    * */
    constructor(options) {
        this.$options = options;

        switch (options.mode) {
            case 'hash':
                this.hashModeHandle();
                break;
            case 'history':
                this.historyModeHandle();
        }
    }

    // Hash模式处理
    hashModeHandle() {
        // 将current设置为响应式数据，即current变化时router-view的render函数能够再次执行
        const initial = window.location.hash.slice(1) || '/';
        Vue.util.defineReactive(this, 'current', initial);

        // 监听hash变化
        window.addEventListener('hashchange', () => {
            this.current = window.location.hash.slice(1);
        })
    }

    // History模式处理
    historyModeHandle() {
        const initial = window.location.pathname || '/';
        Vue.util.defineReactive(this, 'current', initial);
    }
}
```

然后我们来实现`history`模式下的`router-link`组件。

在`history`模式下，当我们点击`router-link`时，即点下`a`标签时，页面会重新刷新。所以我们需要设置一下其点击事件，取消默认事件，然后通过`history.pushState`去修改`url`，然后重设`current`的值。

```javascript
Vue.component('router-link', {
    render(createElement) {      // 返回虚拟Dom
        const self = this;
        const route = this.$router.$options.routes
            .find(route => route.path === this.to);
        return createElement('a',
            {
                attrs: {href: this.to},    // 设置a标签的href属性
                on: {
                    click(e) {
                        e.preventDefault();   // 取消a标签的默认事件，即刷新页面
                        history.pushState({}, route.name, self.to);   // 通过history.pushState来改变url
                        self.$router.current = self.to;
                    }
                }
            },
            this.$slots.default    // 获取标签插槽内容
        );
    }
})
```

最后我们将两种模式的`router-link`组件进行一个合并。

```javascript
Vue.component('router-link', {
    props: {
        to: {
            type: String,
            required: true
        }
    },

    render(createElement) {      // 返回虚拟Dom
        if(this.$router.$options.mode === 'hash'){
            return createElement('a',
                {
                    attrs: {href: '#' + this.to}    // 设置a标签的href属性
                },
                this.$slots.default    // 获取标签插槽内容
            );
        }else{
            const self = this;
            const route = this.$router.$options.routes
                .find(route => route.path === this.to);
            return createElement('a',
                {
                    attrs: {href: this.to},    // 设置a标签的href属性
                    on: {
                        click(e) {
                            e.preventDefault();   // 取消a标签的默认事件，即刷新页面
                            history.pushState({}, route.name, self.to);   // 通过history.pushState来改变url
                            self.$router.current = self.to;
                        }
                    }
                },
                this.$slots.default    // 获取标签插槽内容
            );
        }
    }
});
```

