import {createRouter, createWebHistory} from 'vue-router'
import Colaboradores from '../views/colaboradores/colaboradores.vue'
import Cargos from '../views/cargos/cargos.vue'
import LayoutMain from '../components/LayoutMain.vue'
import Login from '../components/Login.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import Criterios from '../views/criterios/criterios.vue'


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
        path:'/cargos',
        name:'cargos',
        component:Cargos,
    },
    {
        path:'/criterios',
        name:'criterios',
        component:Criterios,
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