import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Product from './views/nav1/Product.vue'
import ProductInfo from './views/nav1/ProductInfo.vue'
import Client from './views/nav1/Client.vue'
import Channel from './views/nav1/Channel.vue'
import LoginRegister from './views/nav2/LoginRegister.vue'
import APPUV from './views/nav2/APPUV.vue'
import H5UV from './views/nav2/H5UV.vue'
import ProductAdvertising from './views/nav3/ProductAdvertising.vue'

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
        name: '产品配置',
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
        name: '广告配置',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/ProductAdvertising', component: ProductAdvertising, name: '产品广告配置' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计相关',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/LoginRegister', component: LoginRegister, name: '登录注册统计' },
            { path: '/APPUV', component: APPUV, name: 'APPUV统计' },
            { path: '/H5UV', component: H5UV, name: 'H5UV统计' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;