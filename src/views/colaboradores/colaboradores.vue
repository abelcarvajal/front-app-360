<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :title="'Colaboradores'" :titleButton="'Nuevo Colaborador'" :abrir="abrirFormulario" />

            <Formulario :titulo="'Gestión de colaboradores'" v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario">

                <template #slotForm>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <formColaboradores 
                        v-model:is-open="mostrarFormulario" 
                        :is-edit="editandoFormulario" 
                        :tipoDocumento="tipoDocumento"
                        :paises="paises" 
                        :departamentos="departamentos"
                        :ciudades="ciudades"
                        :ciudadResidencia="ciudadResidencia"
                        @update:paisSeleccionado="handlePaisChange"
                        @update:departamentosSeleccionado="handleDepartamentoChange"
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
import formColaboradores from './components/formColaboradores.vue';
import { Delete, Edit } from "@element-plus/icons-vue"
import Formulario from '../../components/Formulario.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const mostrarFormulario = ref(false)
const editandoFormulario = ref(false)
interface Pais {
    id: number;
    nombre_pais: string;
    created_at: string | null;
    updated_at: string | null;
}

interface Departamento {
    id: number;
    nombre_departamento: string;
    id_pais: number;
    created_at: string | null;
    updated_at: string | null;
}

interface Ciudad {
    id: number;
    nombre_ciudad: string;
    id_departamento: number;
    created_at: string | null;
    updated_at: string | null;
}

const tipoDocumento = ref('')
const paises = ref<Pais[]>([])
const departamentos = ref<Departamento[]>([])
const ciudades = ref<Ciudad[]>([])
const ciudadResidencia = ref([])
const paisSeleccionado = ref<number | null>(null)
const departamentoSeleccionado = ref<number | null>(null)
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

const getTipoDocumento = async () => {
    const urlTipoDocumento = 'http://127.0.0.1:8000/api/tipodoc/datos'
    try {
        axios.get(urlTipoDocumento)
        .then(function (response) {
            tipoDocumento.value = response.data.result
            console.log('Tipo de documento obtenido:', tipoDocumento.value)
        })
    } catch (error) {
        console.log(error)
    }
}

const getPais = async () => {
    const urlPais = 'http://127.0.0.1:8000/api/pais/datos'
    try {
        axios.get(urlPais)
        .then(function (response) {
            paises.value = response.data.result
            console.log('Paises obtenidos', paises.value)
        })
    } catch (error) {
        console.log(error)
    
    }
}

const getDepartamento = async (idPais: number) => {
    if (!idPais) return
    const urlDepartamento = `http://127.0.0.1:8000/api/departamento/datos/${idPais}`
    try {
        const response = await axios.get(urlDepartamento)
        if (Array.isArray(response.data)) {
            departamentos.value = response.data.sort((a, b) => a.nombre_departamento.localeCompare(b.nombre_departamento))
            console.log('Departamentos obtenidos:', departamentos.value)
        } else {
            console.error('La respuesta no es un array:', response.data)
            departamentos.value = []
        }
    } catch (error) {
        console.error('Error al obtener departamentos:', error)
        departamentos.value = []
    }
}

const getCiudad = async (idDepartamento: number) => {
    const urlCiudad = `http://127.0.0.1:8000/api/municipio/datos/${idDepartamento}`
    try {
        const response = await axios.get(urlCiudad)
        if (Array.isArray(response.data)) {
            ciudades.value = response.data.sort((a,b) => a.nombre_municipio.localeCompare(b.nombre_municipio))
        }
    } catch (error) {
        console.error('Error al obtener ciudades:', error)
        ciudades.value = []
    }
}

const getCiudadResidencia = async () => {
    const urlCiudadResidencia = `http://127.0.0.1:8000/api/municipio/datos/2878`
    try {
        const response = await axios.get(urlCiudadResidencia)
        ciudadResidencia.value = response.data
        console.log('Ciudades de residencia obtenidas:', ciudadResidencia.value)
    } catch (error) {
        console.error('Error al obtener ciudades:', error)
        ciudadResidencia.value = []
    }
}



const handlePaisChange = (nuevoPaisId: number) => {
    console.log('Nuevo ID de país seleccionado:', nuevoPaisId)
    paisSeleccionado.value = nuevoPaisId
    getDepartamento(nuevoPaisId)
    ciudades.value = [] // Limpiar ciudades cuando cambia el país
}

const handleDepartamentoChange = (nuevoDepartamentoId: number) => {
    console.log('Nuevo ID de departamento seleccionado:', nuevoDepartamentoId)
    departamentoSeleccionado.value = nuevoDepartamentoId
    getCiudad(nuevoDepartamentoId)
}

onMounted(() => {
    getPais()
    getTipoDocumento()
    getCiudadResidencia()
})


</script>


<style scoped></style>