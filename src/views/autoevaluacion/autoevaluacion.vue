<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :title="'Autoevaluación'" :titleButton="'Autoevaluar'" :abrir="abrirFormulario" />

            <Formulario 
                :titulo="'Autoevaluación'" 
                v-model:is-open="mostrarFormulario" 
                :is-edit="editandoFormulario"
                @save="guardarEvaluacion"
            >
                <template #slotForm>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <formAutoevaluacion 
                            ref="formAutoevaluacionRef"
                            v-model:is-open="mostrarFormulario" 
                            :is-edit="editandoFormulario"
                            :criterios="criterios"
                            :idColaborador="colaboradorActual"
                        />
                    </el-col>
                </template>
            </Formulario>

            <el-table :data="evaluaciones" style="width: 100%" height="100%">
                <el-table-column prop="created_at" label="Fecha" width="150">
                    <template #default="{ row }">
                        {{ formatDateTime(row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column prop="colaborador" label="Colaborador" width="200">
                    <template #default="{ row }">
                        {{ row.colaborador.nombres }} {{ row.colaborador.apellidos }}
                    </template>
                </el-table-column>
                <el-table-column label="Tipo Evaluación" width="200">
                    <template #default="{ row }">
                        {{ row.evaluacion_tipos.tipo_evaluacion }}
                    </template>
                </el-table-column>
                <el-table-column prop="promedio" label="Promedio" width="100">
                    <template #default="{ row }">
                        {{ calcularPromedio(row.detalle_evaluacion) }}
                    </template>
                </el-table-column>
                <el-table-column label="Detalles" width="100">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="verDetalles(row)">
                            Ver
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog v-model="mostrarDetalles" title="Detalles de la Evaluación" width="70%">
                <el-descriptions :column="1" border>
                    <el-descriptions-item 
                        v-for="detalle in detallesSeleccionados" 
                        :key="detalle.id"
                        :label="detalle.criterio?.criterio || 'Sin criterio'"
                    >
                        {{ detalle.valoracion }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-dialog>
        </template>
    </LayoutMain>
</template>


<script lang="ts" setup>
import LayoutMain from '../../components/LayoutMain.vue';
import Header from '../../components/Header.vue'
import formAutoevaluacion from './components/formAutoevaluacion.vue';
import { Delete, Edit } from "@element-plus/icons-vue"
import Formulario from '../../components/Formulario.vue';
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import api, { ENDPOINTS } from '../../config/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const mostrarFormulario = ref(false)
const editandoFormulario = ref(false)
const refForm = ref();
const criterios = ref([]);
const dataCriterio = ref();
const loadingTable = ref(false);
const formAutoevaluacionRef = ref();
const evaluaciones = ref([]);
const mostrarDetalles = ref(false);
const detallesSeleccionados = ref<DetalleEvaluacion[]>([]);
const colaboradorActual = computed(() => authStore.user?.colaborador_id);

const abrirFormulario = () => {
    mostrarFormulario.value = true
    editandoFormulario.value = false
};

const editarFormulario = async() => {
    mostrarFormulario.value = true
    editandoFormulario.value = true 
}

const tableData = [
    {
        name: 'Marleny Vargas',
        did: '41258742',
        state: 'Meta',
        city: 'Villavicencio',
        address: 'Carrera 15 # 43-25',
        cargo: 'Asistente Gestion Humana',
        phone: '321458796',
        email: 'marlenyv@mail.com',
    },
];

interface CriterioMapped extends CategoriaResponse {
    [key: string]: any;
}

interface CategoriaResponse {
    id?: number;
    categoria?: string;
    descripcion_categoria?: string;
    criterios?: Array<{
        id: number;
        nombre: string;
        descripcion: string;
    }>;
}

interface DetalleEvaluacion {
    id: number;
    criterio: {
        criterio: string;
    };
    valoracion: number;
}

const obtenerCriterios = async () => {
    loadingTable.value = true;
    try {
        const response = await api.get(ENDPOINTS.CATEGORIAS_DATOS);
        // Ordenar criterios por id ascendente para asegurar que el índice corresponda al nivel
        criterios.value = response.data.result.map((categoria: any) => ({
            ...categoria,
            criterios: categoria.criterios.sort((a: any, b: any) => a.id - b.id)
        }));
    } catch (error) {
        console.error("Error al obtener criterios:", error);
        ElMessage.error("Error al cargar los criterios");
        criterios.value = [];
    } finally {
        loadingTable.value = false;
    }
};

const guardarEvaluacion = async () => {
    if (formAutoevaluacionRef.value) {
        const resultado = await formAutoevaluacionRef.value.guardarEvaluacion();
        if (resultado) {
            mostrarFormulario.value = false;
        }
    }
};

const obtenerEvaluaciones = async () => {
    try {
        const response = await api.get(ENDPOINTS.EVALUACION_DATOS);
        evaluaciones.value = response.data.result;
    } catch (error) {
        ElMessage.error('Error al cargar las evaluaciones');
    }
};

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('es-ES',{
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true,
    });
};

const calcularPromedio = (detalles: any[]) => {
    console.log('Detalles para calcular promedio:', detalles);
    if (!detalles?.length) return 0;
    const suma = detalles.reduce((acc, det) => {
        const valor = Number(det.valoracion);
        console.log('Valoracion de detalle:', det.valoracion, 'Convertido a number:', valor);
        return acc + valor;
    }, 0);
    console.log('Suma total:', suma, 'Cantidad:', detalles.length);
    const promedio = (suma / detalles.length).toFixed(2);
    console.log('Promedio calculado:', promedio);
    return promedio;
};

const verDetalles = (row: any) => {
    detallesSeleccionados.value = row.detalle_evaluacion || [];
    mostrarDetalles.value = true;
    console.log('Detalles de la fila:', row.detalle_evaluacion);   
};

onMounted(() => {
    obtenerCriterios();
    obtenerEvaluaciones();
});

</script>


<style scoped></style>