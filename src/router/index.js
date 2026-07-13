import {createRouter, createWebHistory} from 'vue-router'
import Colaboradores from '../views/colaboradores/colaboradores.vue'
import Cargos from '../views/cargos/cargos.vue'
import LayoutMain from '../components/LayoutMain.vue'
import Login from '../views/auth/Login.vue'
import CambiarPassword from '../views/auth/CambiarPassword.vue'
import Criterios from '../views/criterios/criterios.vue'
import Autoevaluacion from '../views/autoevaluacion/autoevaluacion.vue'
import { useAuthStore } from '../stores/auth'

const routes = [

    {
        path:'/',
        name:'home',
        component:LayoutMain,
    },
    {
        meta: { requiresAuth: true },
        path:'/colaboradores',
        name:'colaboradores',
        component:Colaboradores,
    },
    {
        meta: { requiresAuth: true },
        path:'/cargos',
        name:'cargos',
        component:Cargos,
    },
    {
        meta: { requiresAuth: true, roles: ['psicologo', 'admin'] },
        path:'/criterios',
        name:'criterios',
        component:Criterios,
    },
    {
        path:'/login',
        name:'login',
        component:Login,
    },
    {
        meta: { requiresAuth: true },
        path:'/cambiar-password',
        name:'cambiar-password',
        component:CambiarPassword,
    },
    {
        meta: { requiresAuth: true },
        path:'/autoevaluacion',
        name:'autoevaluacion',
        component:Autoevaluacion,
    }

]

const router = createRouter({
    history:createWebHistory(),
    routes
})

// Agregar navigation guard global:
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (auth.isAuthenticated && !auth.user) {
    await auth.fetchUser()
  }

  // Redirigir a cambio de contraseña si es primer acceso
  if (auth.isAuthenticated && auth.debeCambiarPassword && to.path !== '/cambiar-password') {
    return next('/cambiar-password')
  }

  // Control de acceso por rol
  if (to.meta.roles && !to.meta.roles.some(r => auth.tieneRol(r))) {
    return next('/')
  }

  next()
})

export default router;
