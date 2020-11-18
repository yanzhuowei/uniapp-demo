import './utils/ald-stat'

import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// vue的语法 + 小程序的组件标签
// 建议使用flex布局
// 不支持: v-html、ni-app只支持vue单文件组件（.vue 组件）、不支持作用域插槽...
// 原生小程组件没有生命周期，但是uniapp组件有生命周期等同于vue
