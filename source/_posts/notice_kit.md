---
title: Loading动画以及消息提示框的JavaScript小插件
date: 2021-05-06 15:17:28
tags: [javascript,wheels]
categories: [JavaScript]
---

最近工作上做了几个H5活动页，比较简单的商品展示和领券动作，所以就使用原生js进行实现。然后实现过程中，发现需要到**显示加载动画**以及**消息提示框**，所以就去找了现有插件，但没找到特别满意的，最后就打算自己造个轮子，顺便练练手。

> Demo：https://ouduidui.cn/notice-kit/
>
> Github：https://github.com/OUDUIDUI/notice-kit

喜欢的朋友麻烦给个Star！！！

# 安装和引入

在[releases](https://github.com/OUDUIDUI/notice-kit/releases/tag/v1.0.0)下载`notice.min.css`和`notice.min.js`，放入你们的项目文件中，然后在`html`文件引入，并且实例化`Notice`：

```html
<link rel="stylesheet" href="./notice.min.css">

<script src="./notice.min.js"></script>
<script>const notice = new Notice();</script>
```

# Loading - 加载动画

## 显示Loading

使用下列代码就可以显示`loading`动画了。

```javascript
notice.showLoading();
```

![showloading](/images/notice_kit/showloading.gif)

当然，我们可以传入一个`options`对象去自定义`loading`动画，具体详见[具体详见Github](https://github.com/OUDUIDUI/notice-kit)。

其中我设置了6种加载动画，全部都是使用`css`动画实现。

```javascript
notice.showLoading({
  	type: 'dots',
    title: 'Loading',
    color: '#333',
    backgroundColor: 'rgba(255,255,255,.6)',
  	fontSize: 14
});
```

更多的加载动画可以在[Demo](https://ouduidui.cn/notice-kit/)中预览，喜欢的话麻烦在[Github](https://github.com/OUDUIDUI/notice-kit)给个Star！！

## 关闭Loading

```javascript
notice.hideLoading()
```

# Toast - 消息弹窗

使用下列代码可以显示消息弹窗：

```javascript
notice.showToast({
  text: 'This is a message.'
});
```

![showToast](/images/notice_kit/showToast.gif)

弹窗的样式在PC端和移动端是不一样的：

![showToast-mb](/images/notice_kit/showToast-mb.gif)

同样，我们可以通过调整`options`来设置消息弹窗的样式，具体详见[具体详见Github](https://github.com/OUDUIDUI/notice-kit)。

# 最后喜欢的朋友能够给个Star

Github：https://github.com/OUDUIDUI/notice-kit