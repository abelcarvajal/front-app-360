<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>Evaluación 360</h2>
      <el-form @submit.prevent="handleLogin">
        <el-form-item label="Número de cédula">
          <el-input v-model="form.cedula" type="text" placeholder="Ingresa tu cédula" />
        </el-form-item>
        <el-form-item label="Contraseña">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" block>
          Ingresar
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
const form = ref({ cedula: '', password: '' })

async function handleLogin() {
  loading.value = true
  try {
    const data = await auth.login(form.value.cedula, form.value.password)
    if (data.debe_cambiar_password) {
      router.push('/cambiar-password')
    } else {
      router.push('/')
    }
  } catch (e) {
    ElMessage.error('Cédula o contraseña incorrecta')
  } finally {
    loading.value = false
  }
}
</script>
