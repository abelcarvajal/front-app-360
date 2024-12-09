<template>
    <div>
        <!-- Header fuera del contenedor principal -->
        <div class="header-fixed">
            <h2>Formulario Autoevaluación</h2>
            <h4>Autoevaluación de... </h4>
        </div>

        <div class="autoevaluacion-container">
            <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
                <div class="content-wrapper">
                    <el-collapse v-model="activeName" accordion>
                        <el-collapse-item 
                            v-for="categoria in criterios" 
                            :key="categoria.id"
                            :title="categoria.categoria"
                            :name="categoria.id.toString()"
                        >
                            <!-- Descripción de la categoría -->
                            <div class="categoria-descripcion">
                                <h4>Descripción:</h4>
                                <p>{{ categoria.descripcion }}</p>
                            </div>
                            
                            <!-- Área de evaluación -->
                            <div class="evaluacion-container">
                                <el-radio-group v-model="respuestas[categoria.id]" class="criterio-opciones">
                                    <el-radio 
                                        v-for="criterio in categoria.criterios" 
                                        :key="criterio.id"
                                        :value="criterio.id"
                                        class="criterio-radio"
                                    >
                                        <div class="radio-content">
                                            <span class="radio-value">{{ getCriterioNivel(criterio) }}</span>
                                            <p class="criterio-texto">{{ criterio.criterio }}</p>
                                        </div>
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, PropType } from 'vue'

interface Criterio {
    id: number;
    criterio: string;
    id_categorias_criterios: number;
}

interface Categoria {
    id: number;
    categoria: string;
    descripcion: string;
    criterios: Criterio[];
}

const props = defineProps({
    criterios: {
        type: Array as PropType<Categoria[]>,
        required: true,
        default: () => []
    }
});

const respuestas = ref({});
const activeName = ref('1');
const form = ref({});
const rules = ref({});

// Función para obtener el nivel del criterio (1-5)
const getCriterioNivel = (criterio: any) => {
    // Asumiendo que los criterios vienen ordenados del 1 al 5
    const index = props.criterios.find(cat => 
        cat.criterios.some(c => c.id === criterio.id)
    )?.criterios.findIndex(c => c.id === criterio.id);
    
    return index !== undefined ? index + 1 : '';
};
</script>

<style scoped>
.header-fixed {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    padding-bottom: 0.5rem;
}

.autoevaluacion-container {
    height: calc(100vh - 300px);
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
}

.content-wrapper {
    flex: 1;
    overflow-y: auto;
    padding-right: 16px;
    padding-bottom: 80px;
}

/* Contenedor principal */
.el-form {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 1rem;
    margin-bottom: 2rem; /* Espacio adicional al final */
}

/* Estilos del collapse */
:deep(.el-collapse) {
    overflow-y: visible;
}

:deep(.el-collapse-item__content) {
    padding: 1rem;
    padding-bottom: 2rem;
    max-height: none; /* Eliminar límite de altura */
}

:deep(.el-collapse-item__wrap) {
    overflow: visible; /* Permitir que el contenido sea visible completo */
}

/* Contenedor de criterios */
.evaluacion-container {
    margin: 1rem 0;
}

.criterio-opciones {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.criterio-radio {
    padding: 1rem;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    width: 100%;
}

.radio-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.radio-value {
    font-weight: bold;
    color: #409EFF;
    min-width: 1.5rem;
}

.criterio-texto {
    margin: 0;
    flex: 1;
    word-wrap: break-word;
}

:deep(.el-radio__label) {
    white-space: normal;
    word-break: break-word;
}

/* Asegurar que el último criterio sea visible */
.criterio-radio:last-child {
    margin-bottom: 20px;
}

/* Ajustar el diálogo para asegurar scroll */
:deep(.el-dialog__body) {
    overflow-y: auto;
    max-height: calc(90vh - 100px);
}
</style>