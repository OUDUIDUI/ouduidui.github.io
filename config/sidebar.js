/**
 * 侧边栏 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html#sidebar
 */
const sidebar = {
  '/front-end/': [
    {
      text: 'CSS',
      children: [
        '/front-end/css/center.md',
        '/front-end/css/stacking-context.md',
        '/front-end/css/clip-and-mask.md'
      ]
    },
    {
      text: 'JavaScript',
      children: [
        '/front-end/javascript/event-loop.md',
        '/front-end/javascript/hw-promise.md',
        '/front-end/javascript/js-module.md'
      ]
    },
    {
      text: 'Vue',
      children: [
        '/front-end/vue/vue-component.md',
        '/front-end/vue/vue2-component.md'
      ]
    },
    {
      text: '前端工程化',
      children: [
        '/front-end/engineering/webpack-study.md',
        '/front-end/engineering/publish-npm.md'
      ]
    },
    {
      text: '源码',
      children: [
        '/front-end/source-code/vue-diff.md',
        '/front-end/source-code/simple-vue2.md',
        '/front-end/source-code/simple-vue-router.md',
        '/front-end/source-code/simple-vuex.md',
        '/front-end/source-code/mini-axios.md',
      ]
    },
  ],
  '/tools/': [
    {
      text: 'Git',
      children: [
        '/tools/git/git.md',
        '/tools/git/git-commit-message.md',
        '/tools/git/git-flow.md'
      ]
    }
  ],
  '/design-patterns/': [
    {
      text: '设计模式',
      children: [
        '/design-patterns/design-principles.md',
        '/design-patterns/singleton.md',
        '/design-patterns/factory.md',
        '/design-patterns/abstract-factory.md',
      ]
    }
  ],
  '/algorithm/': [
    {
      text: '算法学习',
      children: [
        '/algorithm/sort.md'
      ]
    }
  ]
};

module.exports = sidebar