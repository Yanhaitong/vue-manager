import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Product from './views/nav1/Product.vue'
import ProductInfo from './views/nav1/ProductInfo.vue'
import Client from './views/nav1/Client.vue'
import Channel from './views/nav1/Channel.vue'
import APPUV from './views/nav2/APPUV.vue'
import H5UV from './views/nav2/H5UV.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '配置相关',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/product', component: Product, name: '产品配置' },
            { path: '/productInfo', component: ProductInfo, name: '产品管理' },
            { path: '/client', component: Client, name: '客户端配置' },
            { path: '/channel', component: Channel, name: '渠道配置' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计相关',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/APPUV', component: APPUV, name: 'APPUV统计' },
            { path: '/H5UV', component: H5UV, name: 'H5UV统计' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;