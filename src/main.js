import Vue from 'vue'
import ElementUI from 'element-ui'
import router from './router'
import http from './http'
import dayjs from "dayjs";

import App from './App.vue'

import Clerk from './views/Member/Clerk.vue'
import Part from './views/Member/Part.vue'

import Record from './views/Order/Record.vue'
import Appeal from './views/Order/Appeal.vue'

import Capital from './views/Financial/Capital.vue'
import Customer from './views/Financial/Customer.vue'
import Withdrawal from './views/Financial/Withdrawal.vue'

import Agent from './views/Agency/Agent.vue'
import Create from './views/Agency/Create.vue'

import './assets/style.scss'
import 'element-ui/lib/theme-chalk/index.css'

Vue.component('member-clerk', Clerk)
Vue.component('member-part', Part)

Vue.component('order-record', Record)
Vue.component('order-appeal', Appeal)

Vue.component('financial-capital', Capital)
Vue.component('financial-customer', Customer)
Vue.component('financial-drawl', Withdrawal)

Vue.component('agent-agent', Agent)
Vue.component('agent-create', Create)

Vue.use(ElementUI)
Vue.config.productionTip = true

Vue.filter("date", function (value) {
  return dayjs(value).format("YYYY-MM-DD HH:MM:ss");
})

Vue.filter("onlyDate", function (value) {
  return dayjs(value).format("YYYY-MM-DD");
})

Vue.prototype.$http = http

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')