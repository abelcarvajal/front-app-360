<template>
    <div v-loading="loading" element-loading-text="Loading..."
        :element-loading-spinner="$attrs['element-loading-spinner']"
        :element-loading-svg-view-box="$attrs['element-loading-svg-view-box']"
        :element-loading-background="$attrs['element-loading-background']">
        <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item class="categoria" label="Categoría" prop="categoria">
                        <el-input v-model="form.categoria" placeholder="Ingrese la categoría" />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item class="categoria" label="Descripción" prop="descripcion">
                        <el-input v-model="form.descripcion" placeholder="Ingrese la descripción" type="textarea"
                            autosize />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
                <el-col :span="12" v-for="n in 5" :key="n">
                    <el-form-item :label="`Criterio ${n}`" :prop="`criterio${n}`">
                        <el-input v-model="form[`criterio${n}`]" :placeholder="`Ingrese el criterio ${n}`"
                            type="textarea" :rows="2" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()


const form = ref({
    id: null,
    categoria: '',
    descripcion: '',
    criterio1: '',
    criterio2: '',
    criterio3: '',
    criterio4: '',
    criterio5: ''
})

const rules: FormRules = {
    categoria: [
        { required: true, message: 'La categoría es requerida', trigger: 'blur' }
    ],
    descripcion: [
        { required: true, message: 'La descripción es requerida', trigger: 'blur' }
    ]
}

const validarForm = async () => {
    if (!formRef.value) return false

    try {
        await formRef.value.validate()
        return true
    } catch (error) {
        return false
    }
}

const cargarDatos = (datos: any) => {
    form.value = {
        ...form.value,
        ...datos
    }
}

const limpiarFormulario = () => {
    if (formRef.value) {
        formRef.value.resetFields()
        form.value = {
            id: null,
            categoria: '',
            descripcion: '',
            criterio1: '',
            criterio2: '',
            criterio3: '',
            criterio4: '',
            criterio5: ''
        }
    }
}
const props = defineProps({
    loading: {
        type: Boolean,
        required: true
    }
})

defineExpose({
    validarForm,
    cargarDatos,
    limpiarFormulario,
    resetForm: () => formRef.value?.resetFields(),
    form
})
</script>
<style scoped>
.categoria {
    margin-bottom: 10px;
    text-emphasis-color: #414040;
    font-weight: bold;
}
</style>
