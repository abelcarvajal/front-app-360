<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :title="'Autoevaluación'" :titleButton="'Autoevaluar'" :abrir="abrirFormulario" />

            <Formulario :titulo="'Autoevaluación'" v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario">

                <template #slotForm>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <formAutoevaluacion 
                            v-model:is-open="mostrarFormulario" 
                            :is-edit="editandoFormulario"
                            :criterios="criterios"
                        />
                    </el-col>
                </template>

            </Formulario>

            <el-table :data="tableData" style="width: 100%" height="100%">
                <el-table-column fixed prop="name" label="Nombre" width="250" />
                <el-table-column prop="did" label="Did" width="100" />
                <el-table-column prop="cargo" label="Cargo" width="100" />
                <el-table-column prop="state" label="Departamento" width="150" />
                <el-table-column prop="city" label="Ciudad" width="150" />
                <el-table-column prop="address" label="Dirección" width="200" />
                <el-table-column prop="phone" label="Teléfono" width="100" />
                <el-table-column prop="email" label="Email" width="100" />
                <el-table-column fixed="right" label="Opciones" min-width="120">
                    <template #default>
                        <el-button link type="primary" size="small" :icon="Edit" @click="editarFormulario"></el-button>
                        <el-button link type="danger" :icon="Delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>

        </template>
    </LayoutMain>
</template>


<script lang="ts" setup>
import LayoutMain from '../../components/LayoutMain.vue';
import Header from '../../components/Header.vue'
import formAutoevaluacion from './components/formAutoevaluacion.vue';
import { Delete, Edit } from "@element-plus/icons-vue"
import Formulario from '../../components/Formulario.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const mostrarFormulario = ref(false)
const editandoFormulario = ref(false)
const refForm = ref();
const criterios = ref([]);
const dataCriterio = ref();
const loadingTable = ref(false);

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

onMounted(() => {
    obtenerCriterios();
});

</script>


<style scoped></style>