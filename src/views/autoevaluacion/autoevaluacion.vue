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
import axios from 'axios';
import { ElMessage } from 'element-plus';

const mostrarFormulario = ref(false)
const editandoFormulario = ref(false)
const refForm = ref();
const criterios = ref([]);
const dataCriterio = ref();
const loadingTable = ref(false);
const colaboradorActual = ref(1);
const formAutoevaluacionRef = ref();
const evaluaciones = ref([]);
const mostrarDetalles = ref(false);
const detallesSeleccionados = ref<DetalleEvaluacion[]>([]);

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
        const response = await axios.get('http://127.0.0.1:8000/api/categorias/datos');
        criterios.value = response.data.result;
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
        const response = await axios.get('http://127.0.0.1:8000/api/evaluacion/datos');
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
    if (!detalles?.length) return 0;
    const suma = detalles.reduce((acc, det) => acc + det.valoracion, 0);
    return (suma / detalles.length).toFixed(2);
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