<template>
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto" class="form-criterios">
        <div class="form-container">
            <div class="left-section">
                <h4>Criterios de Evaluación</h4>
                <el-form-item label="Categoría" prop="categoria">
                    <el-input v-model="form.categoria" placeholder="Ingrese la categoría de criterio o Item" />
                </el-form-item>

                <el-form-item label="Descripción" prop="descripcion">
                    <el-input v-model="form.descripcion" placeholder="Digite una descripción de la categoría"
                        type="textarea" autosize />
                </el-form-item>
            </div>

            <div class="right-section">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item v-for="n in 5" :key="n" :title="`Criterio ${n}`" :name="n.toString()">
                        <div>
                            <el-form-item :prop="`criterio${n}`">
                                <el-input v-model="form[`criterio${n}`]" type="textarea" autosize />
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
const activeName = ref('1')


const form = reactive({
    categoria: '',
    descripcion: '',
    criterio1: '',
    criterio2: '',
    criterio3: '',
    criterio4: '',
    criterio5: ''
})

const formRules = reactive({
    categoria: [
        {
            required: true,
            message: 'Este campo no puede quedar vacío',
            trigger: 'blur'
        }
    ],
    descripcion: [{
        required: true,
        message: 'Este campo no puede quedar vacío',
        trigger: 'blur'
    }],
    criterio1: [{
        required: true,
        message: 'Campo requerido',
        trigger: 'blur'
    }],
    criterio2: [{
        required: true,
        message: 'Campo requerido',
        trigger: 'blur'
    }],
    criterio3: [{
        required: true,
        message: 'Campo requerido',
        trigger: 'blur'
    }],
    criterio4: [{
        required: true,
        message: 'Campo requerido',
        trigger: 'blur'
    }],
    criterio5: [{
        required: true,
        message: 'Campo requerido',
        trigger: 'blur'
    }]
})

const formRef = ref(null)

const validarForm = async () => {
    // if (!formRef.value) return false
    return new Promise((resolve) => {
        formRef.value.validate((valid) => {
            if (valid) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

const limpiarFormulario = () => {
    formRef.value.resetFields()
}

defineExpose({ validarForm, form, limpiarFormulario })

</script>

<style scoped>
.form-criterios {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.form-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.left-section {
    padding-right: 20px;
}

.right-section {
    border-left: 1px solid #eee;
    padding-left: 20px;
}

/* Estilos responsivos */
@media (max-width: 768px) {
    .form-container {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .left-section {
        padding-right: 0;
    }

    .right-section {
        border-left: none;
        padding-left: 0;
        border-top: 1px solid #eee;
        padding-top: 20px;
    }
}

h4 {
    margin-bottom: 20px;
    color: #333;
}

:deep(.el-collapse-item__header) {
    font-weight: bold;
    color: #626669;
}

:deep(.el-form-item__label) {
    font-weight: bold;
}
</style>