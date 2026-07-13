<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>Cambiar contraseña</h2>
      <p>Es tu primer acceso o tu contraseña fue restablecida. Debes definir una nueva antes de continuar.</p>
      <el-form @submit.prevent="handleSubmit">
        <el-form-item label="Contraseña actual">
          <el-input v-model="form.passwordActual" type="password" show-password />
        </el-form-item>
        <el-form-item label="Nueva contraseña">
          <el-input v-model="form.passwordNuevo" type="password" show-password />
        </el-form-item>
        <el-form-item label="Confirmar nueva contraseña">
          <el-input v-model="form.passwordNuevoConfirmation" type="password" show-password />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" block>
          Guardar
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const form = ref({ passwordActual: '', passwordNuevo: '', passwordNuevoConfirmation: '' })

async function handleSubmit() {
  loading.value = true
  try {
    await auth.cambiarPassword(form.value.passwordActual, form.value.passwordNuevo, form.value.passwordNuevoConfirmation)
    ElMessage.success('Contraseña actualizada correctamente')
    router.push('/')
  } catch (e) {
    ElMessage.error(e.response?.data?.message || 'No se pudo actualizar la contraseña')
  } finally {
    loading.value = false
  }
}
</script>
