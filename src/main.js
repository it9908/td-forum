import Vue from 'vue'
import '@/assets/css/reset.css'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 代码高亮风格，选择更多风格需导入 node_modules/hightlight.js/styles/ 目录下其它css文件
import 'highlight.js/styles/atom-one-dark.css'; // 或者你喜欢的其他样式
import App from './App.vue'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';


// 注册需要的编程语言
hljs.registerLanguage('javascript', javascript);

Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  });
});


Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(mavonEditor)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
