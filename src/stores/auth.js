import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api, { ENDPOINTS } from '@/config/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const debeCambiarPassword = computed(() => user.value?.debe_cambiar_password ?? false)
  const roles = computed(() => user.value?.roles ?? [])

  function tieneRol(rol) {
    return roles.value.includes(rol)
  }

  async function login(cedula, password) {
    const response = await api.post(ENDPOINTS.AUTH_LOGIN, { cedula, password })
    token.value = response.data.token
    user.value = response.data.user
    user.value.debe_cambiar_password = response.data.debe_cambiar_password
    localStorage.setItem('token', token.value)
    return response.data
  }

  async function logout() {
    await api.post(ENDPOINTS.AUTH_LOGOUT)
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  async function fetchUser() {
    if (!token.value) return
    const response = await api.get(ENDPOINTS.AUTH_ME)
    user.value = response.data
  }

  async function cambiarPassword(passwordActual, passwordNuevo, passwordNuevoConfirmation) {
    await api.post(ENDPOINTS.AUTH_CAMBIAR_PASSWORD, {
      password_actual: passwordActual,
      password_nuevo: passwordNuevo,
      password_nuevo_confirmation: passwordNuevoConfirmation,
    })
    if (user.value) user.value.debe_cambiar_password = false
  }

  return {
    token,
    user,
    isAuthenticated,
    debeCambiarPassword,
    roles,
    tieneRol,
    login,
    logout,
    fetchUser,
    cambiarPassword,
  }
})
