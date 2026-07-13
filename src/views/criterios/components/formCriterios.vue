<template>
    <div v-loading="loading" element-loading-text="Guardando...">
        <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
            <el-form-item label="Nombre del ítem" prop="nombre">
                <el-input v-model="form.nombre" placeholder="Ej: Atención al usuario" />
            </el-form-item>

            <el-form-item label="Descripción del elemento a evaluar" prop="descripcion">
                <el-input v-model="form.descripcion" type="textarea" autosize
                    placeholder="Descripción del comportamiento esperado" />
            </el-form-item>

            <el-divider>Niveles cualitativos (1 a 5)</el-divider>

            <el-form-item v-for="(nivelItem, index) in form.niveles" :key="nivelItem.nivel"
                :label="`Nivel ${nivelItem.nivel}`" :prop="`niveles.${index}.descripcion`" :rules="reglaNivel">
                <el-input v-model="nivelItem.descripcion" type="textarea" autosize :rows="2"
                    :placeholder="`Descripción cualitativa del nivel ${nivelItem.nivel}`" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

defineProps({
    loading: {
        type: Boolean,
        required: true
    }
})

interface Nivel {
    nivel: number
    descripcion: string
}

const formRef = ref<FormInstance>()

const nivelesLimpios = (): Nivel[] => [1, 2, 3, 4, 5].map((nivel) => ({ nivel, descripcion: '' }))

const form = ref({
    id: null as number | null,
    nombre: '',
    descripcion: '',
    id_categorias_criterios: null as number | null,
    niveles: nivelesLimpios()
})

const rules: FormRules = {
    nombre: [
        { required: true, message: 'El nombre del ítem es requerido', trigger: 'blur' }
    ],
    descripcion: [
        { required: true, message: 'La descripción es requerida', trigger: 'blur' }
    ]
}

const reglaNivel: FormRules[string] = [
    { required: true, message: 'La descripción del nivel es requerida', trigger: 'blur' }
]

const validarForm = async () => {
    if (!formRef.value) return false

    try {
        await formRef.value.validate()
        return true
    } catch (error) {
        return false
    }
}

// Acepta tanto un ítem completo (editar) como un objeto parcial { id_categorias_criterios } (nuevo ítem)
const cargarDatos = (datos: any) => {
    const niveles: Nivel[] = [1, 2, 3, 4, 5].map((nivel) => {
        const existente = (datos.niveles || []).find((n: Nivel) => n.nivel === nivel)
        return { nivel, descripcion: existente?.descripcion || '' }
    })

    form.value = {
        id: datos.id ?? null,
        nombre: datos.nombre ?? '',
        descripcion: datos.descripcion ?? '',
        id_categorias_criterios: datos.id_categorias_criterios ?? null,
        niveles
    }

    formRef.value?.clearValidate()
}

const limpiarFormulario = () => {
    formRef.value?.resetFields()
    form.value = {
        id: null,
        nombre: '',
        descripcion: '',
        id_categorias_criterios: null,
        niveles: nivelesLimpios()
    }
}

defineExpose({
    validarForm,
    cargarDatos,
    limpiarFormulario,
    form
})
</script>
