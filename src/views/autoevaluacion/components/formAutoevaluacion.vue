<template>
    <div>
        <div class="header-fixed">
            <h2>{{ tipoEvaluacionSeleccionado?.tipo_evaluacion || 'Formulario Autoevaluación' }}</h2>
            
            <!-- Selector de tipo de evaluación -->
            <el-select 
                v-model="tipoEvaluacionId" 
                placeholder="Seleccione tipo de evaluación"
                class="mb-4"
            >
                <el-option
                    v-for="tipo in tiposEvaluacion"
                    :key="tipo.id"
                    :label="tipo.tipo_evaluacion"
                    :value="tipo.id"
                />
            </el-select>
        </div>

        <div class="autoevaluacion-container">
            <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
                <div class="content-wrapper">
                    <el-collapse v-model="activeName" accordion>
                        <el-collapse-item
                            v-for="item in criterios"
                            :key="item.id"
                            :title="item.nombre"
                            :name="item.id.toString()"
                            :class="{ 'evaluado': respuestas[item.id] }"
                        >
                            <!-- Descripción del ítem -->
                            <div class="categoria-descripcion">
                                <h4>Descripción:</h4>
                                <p>{{ item.descripcion }}</p>
                            </div>

                            <!-- Área de evaluación -->
                            <div class="evaluacion-container">
                                <el-radio-group
                                    v-model="respuestas[item.id]"
                                    class="criterio-opciones"
                                    @change="handleRadioChange"
                                >
                                    <el-radio
                                        v-for="nivel in item.niveles"
                                        :key="nivel.nivel"
                                        :value="nivel.nivel"
                                        class="criterio-radio"
                                    >
                                        <div class="radio-content">
                                            <span class="radio-value">{{ nivel.nivel }}</span>
                                            <p class="criterio-texto">{{ nivel.descripcion }}</p>
                                        </div>
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-form>
        </div>

        <!-- Agregar botón de guardar al final -->
        <div class="actions-container">
            <el-button 
                type="primary" 
                @click="guardarEvaluacion"
                :disabled="!isFormValid"
            >
                Guardar Evaluación
            </el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, PropType, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api, {ENDPOINTS} from '../../../config/api'

const emit = defineEmits(['evaluacionGuardada']);

interface Nivel {
    nivel: number;
    descripcion: string;
}

interface Item {
    id: number;
    nombre: string;
    descripcion: string;
    id_categorias_criterios: number;
    niveles: Nivel[];
}

interface TipoEvaluacion {
    id: number;
    tipo_evaluacion: string;
}

const props = defineProps({
    criterios: {
        type: Array as PropType<Item[]>,
        required: true,
        default: () => []
    },
    idColaborador: {
        type: Number,
        required: true
    }
});

const tiposEvaluacion = ref<TipoEvaluacion[]>([]);
const tipoEvaluacionId = ref<number>();
const respuestas = ref<Record<number, number>>({});
const activeName = ref('1');
const form = ref({});
const rules = ref({});

const tipoEvaluacionSeleccionado = computed(() => 
    tiposEvaluacion.value?.find(tipo => tipo.id === tipoEvaluacionId.value)
);

const handleRadioChange = () => {
    setTimeout(() => {
        activeName.value = '';
    }, 300);
};

// Validación del formulario
const isFormValid = computed(() => {
    return tipoEvaluacionId.value && 
    Object.keys(respuestas.value).length === props.criterios.length;
});

// Obtener tipos de evaluación
const obtenerTiposEvaluacion = async () => {
    try {
        const response = await api.get(ENDPOINTS.TIPOS_DATOS);
        tiposEvaluacion.value = response.data.result;
    } catch (error) {
        ElMessage.error('Error al cargar tipos de evaluación');
    }
};

// Guardar evaluación
const guardarEvaluacion = async () => {
    try {
        // Validar que se hayan respondido todos los criterios
        if (Object.keys(respuestas.value).length === 0) {
            ElMessage.warning('Debe responder al menos un criterio');
            return false;
        }

        // Confirmación antes de guardar
        const confirmResult = await ElMessageBox.confirm(
            '¿Está seguro de guardar esta evaluación?',
            'Confirmación',
            {
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                type: 'warning',
            }
        );

        if (!confirmResult) return false;

        const evaluacionResponse = await api.post(ENDPOINTS.EVALUACION_GUARDAR, {
            fecha: new Date(),
            id_colab: props.idColaborador,
            id_tipo_ev: tipoEvaluacionId.value
        });

        const evaluacionId = evaluacionResponse.data.result.id;

        // Guardar detalles
        for (const [itemId, nivelSeleccionado] of Object.entries(respuestas.value)) {
            const detalleData = {
                valoracion: nivelSeleccionado,
                id_criterio: Number(itemId),
                id_evaluacion: evaluacionId
            };

            await api.post(ENDPOINTS.DETALLE_GUARDAR, detalleData);
        }

        ElMessage.success('Evaluación guardada exitosamente');
        return true;
    } catch (error) {
        if (error === 'cancel') return false;
        console.error('Error completo:', error.response?.data || error);
        ElMessage.error(`Error al guardar la evaluación: ${error.message}`);
        return false;
    }
};

// Cargar tipos de evaluación al montar el componente
onMounted(() => {
    obtenerTiposEvaluacion();
});

defineExpose({ guardarEvaluacion });
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

:deep(.evaluado) {
    .el-collapse-item__header {
        background-color: #f0f9eb;
        border-left: 3px solid #67c23a;
    }
}

.actions-container {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: flex-end;
}

.mb-4 {
    margin-bottom: 1rem;
}
</style>