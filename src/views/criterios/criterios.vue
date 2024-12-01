<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :title="'Criterios'" :titleButton="'Nuevo Criterio'" :abrir="abrirFormulario" />

            <Formulario :titulo="'Gestion de criterios de evaluación'" v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario" @save="guardarDatos">

                <template #slotForm>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <formCriterios v-model:is-open="mostrarFormulario" ref="refForm" />
                    </el-col>
                </template>

            </Formulario>

            <el-table :data="criterios">
                <el-table-column fixed prop="categoria" label="Categoría Criterio" width="150" />
                <el-table-column prop="descripcion" label="Descripción" width="200" />
                <el-table-column prop="criterio1" label="Criterio 1" width="200" />
                <el-table-column prop="criterio2" label="Criterio 2" width="200" />
                <el-table-column prop="criterio3" label="Criterio 3" width="200" />
                <el-table-column prop="criterio4" label="Criterio 4" width="200" />
                <el-table-column prop="criterio5" label="Criterio 5" width="200" />
                <el-table-column fixed="right" label="Opciones" min-width="150">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit" 
                            @click="editarFormulario(scope.row)"></el-button>
                        <el-button link type="danger" :icon="Delete"
                            @click="eliminarCriterio(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

        </template>
    </LayoutMain>
</template>


<script lang="ts" setup>
import LayoutMain from '../../components/LayoutMain.vue';
import Header from '../../components/Header.vue'
import formCriterios from './components/formCriterios.vue';
import { Delete, Edit } from "@element-plus/icons-vue"
import Formulario from '../../components/Formulario.vue';
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const mostrarFormulario = ref(false)
const editandoFormulario = ref(false)
const refForm = ref()
const criterios = ref<CriterioMapped[]>([])

const abrirFormulario = () => {
    mostrarFormulario.value = true
    editandoFormulario.value = false
};

const editarFormulario = async(row: CriterioMapped) => {
    mostrarFormulario.value = true
    editandoFormulario.value = true
}

const guardarDatos =async () => {
    const validacion = await refForm.value.validarForm()

    if(validacion){
        await crearCriterio()
    }
    
}

const crearCriterio = async () => {
    
    const urlCatCrit='http://127.0.0.1:8000/api/categorias/guardar'
    

    const dataCatCrit = {
        categoria:refForm.value.form.categoria,
        descripcion:refForm.value.form.descripcion,
        criterio1:refForm.value.form.criterio1,
        criterio2:refForm.value.form.criterio2,
        criterio3:refForm.value.form.criterio3,
        criterio4:refForm.value.form.criterio4,
        criterio5:refForm.value.form.criterio5
    }
    
    axios.post(urlCatCrit,dataCatCrit)
    .then(res=>{
        console.log(res)
        refForm.value?.limpiarFormulario()
        ElMessage.success('Criterio creado correctamente')
    })
    .catch(err=>{
        console.log(err)
        ElMessage.error('Error al crear el criterio')
    })

    
}
const actualizarCriterio = async () => {
    
}

const eliminarCriterio = async (row: CriterioMapped) => {
    console.log('ELIMINAR CRITERIO',row)
}

const datosCriterio = async () => {
    
}

const obtenerCriterios = async () => {
    const urlCatCrit='http://127.0.0.1:8000/api/categorias/datos'
    
    try {
        const response = await axios.get<{ status: string; message: string; result: CategoriaResponse[] }>(urlCatCrit)
        const datos = Array.isArray(response.data.result) ? response.data.result : [response.data.result]
        
        criterios.value = datos.map((item: CategoriaResponse) => ({
            ...item,
            criterio1: item.criterios?.[0]?.criterio || '',
            criterio2: item.criterios?.[1]?.criterio || '',
            criterio3: item.criterios?.[2]?.criterio || '',
            criterio4: item.criterios?.[3]?.criterio || '',
            criterio5: item.criterios?.[4]?.criterio || '',
        }))
    } catch (error) {
        console.error('Error al obtener criterios:', error)
        ElMessage.error('Error al cargar los criterios')
        criterios.value = []
    }
}

onMounted(()=>{
    obtenerCriterios()
})

interface Criterio {
    id: number;
    criterio: string;
    id_categorias_criterios: number;
}

interface CategoriaResponse {
    id: number;
    categoria: string;
    descripcion: string;
    criterios: Criterio[];
}

interface CriterioMapped extends CategoriaResponse {
    criterio1?: string;
    criterio2?: string;
    criterio3?: string;
    criterio4?: string;
    criterio5?: string;
}

</script>


<style scoped>
.el-table{
    text-align: center;
    width: 100%;
    height: 100%
}
</style>