import {createRouter, createWebHistory} from 'vue-router'
import Colaboradores from '../views/colaboradores/colaboradores.vue'
import LayoutMain from '../components/LayoutMain.vue'
import Login from '../components/Login.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'


const routes = [

    {
        path:'/',
        name:'home',
        component:LayoutMain,
    },
    {
        path:'/colaboradores',
        name:'colaboradores',
        component:Colaboradores,
    },

    {
        path:'/login',
        name:'login',
        component:Login,
    }

]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router;