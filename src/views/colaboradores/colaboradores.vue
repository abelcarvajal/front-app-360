<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :title="'Colaboradores'" :titleButton="'Nuevo Colaborador'" :abrir="abrirFormulario" />

            <Formulario :titulo="'Gestión de colaboradores'" v-model:is-open="mostrarFormulario"
                :is-edit="editandoFormulario" @save="guardarColaborador" @update="actualizarColaborador"
                @cancel="obtenerColaboradores">

                <template #slotForm>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <formColaboradores v-model:is-open="mostrarFormulario" :is-edit="editandoFormulario"
                            :tipoDocumento="tipoDocumento" :paises="paises" :departamentos="departamentos"
                            :ciudades="ciudades" :ciudadResidencia="ciudadResidencia" :cargos="cargos"
                            :programas="programas" :centro_costo="centro_costo" ref="refForm"
                            @update:paisSeleccionado="handlePaisChange"
                            @update:departamentosSeleccionado="handleDepartamentoChange" :loading="loadingForm"
                            :element-loading-spinner="svg" element-loading-text="Loading..."
                            element-loading-svg-view-box="-10, -10, 50, 50"
                            element-loading-background="rgba(122, 122, 122, 0.8)" />
                    </el-col>
                </template>

            </Formulario>

            <div v-loading="loadingTable" element-loading-text="Loading..." :element-loading-spinner="svg"
                element-loading-svg-view-box="-10, -10, 50, 50" element-loading-background="rgba(122, 122, 122, 0.8)"
                class="table-container">
                <el-table :data="colaboradores">
                    <el-table-column fixed prop="nombre_completo" label="Nombre" width="250" />
                    <el-table-column prop="numero_documento" label="Did" width="120" />
                    <el-table-column prop="cargo_nombre" label="Cargo" width="200" />
                    <el-table-column prop="celular" label="Celular" width="120" />
                    <el-table-column prop="email" label="Email" width="250" />
                    <el-table-column fixed="right" label="Opciones" min-width="120">
                        <template #default="scope">
                            <el-button link type="primary" size="small" :icon="Edit"
                                @click="editarFormulario(scope.row.id)"></el-button>
                            <el-button link type="danger" :icon="Delete"
                                @click="eliminarColaborador(scope.row.id)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </template>
    </LayoutMain>
</template>


<script lang="ts" setup>
import LayoutMain from '../../components/LayoutMain.vue';
import Header from '../../components/Header.vue'
import formColaboradores from './components/formColaboradores.vue';
import { Delete, Edit } from "@element-plus/icons-vue"
import { Message, ElMessage, ElMessageBox, } from 'element-plus';
import Formulario from '../../components/Formulario.vue';
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';

const loadingForm = ref(false)
const loadingTable = ref(false)
const svg = `
        <path class="path" d="
        M 30 15
        L 28 17
        M 25.61 25.61
        A 15 15, 0, 0, 1, 15 30
        A 15 15, 0, 1, 1, 27.99 7.5
        L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
        `


const mostrarFormulario = ref(false)
const editandoFormulario = ref(false)
interface Pais {
    id: number;
    nombre_pais: string;
}

interface Departamento {
    id: number;
    nombre_departamento: string;
    id_pais: number;
}

interface Ciudad {
    id: number;
    nombre_ciudad: string;
    id_departamento: number;
}

interface Colaborador {
    id: number;
    nombre_completo: string;
    numero_documento: string | number;
    cargo_nombre: string;
    celular: string;
    email: string;
}

const tipoDocumento = ref([])
const paises = ref<Pais[]>([])
const departamentos = ref<Departamento[]>([])
const ciudades = ref<Ciudad[]>([])
const ciudadResidencia = ref([])
const paisSeleccionado = ref<number | null>(null)
const departamentoSeleccionado = ref<number | null>(null)
const cargos = ref([])
const programas = ref([])
const centro_costo = ref([])
const refForm = ref<InstanceType<typeof formColaboradores> | null>(null);
const colaboradores = ref<Colaborador[]>([])
const abrirFormulario = () => {
    mostrarFormulario.value = true
    editandoFormulario.value = false
};

const editarFormulario = async (row: number) => {
    loadingForm.value = true;
    try {
        await getColaboradorById(row);
        mostrarFormulario.value = true
        editandoFormulario.value = true
    } catch (error) {
        console.error('Error al editar:', error);
        ElMessage.error('Error al cargar el formulario de edición');
    } finally {
        loadingForm.value = false;
    }
}



//Obtener datos

const getTipoDocumento = async () => {
    const urlTipoDocumento = 'http://127.0.0.1:8000/api/tipodoc/datos'
    try {
        axios.get(urlTipoDocumento)
            .then(function (response) {
                tipoDocumento.value = response.data.result
            })
    } catch (error) {
        ElMessage.error('Error al obtener tipos de documento');
    }
}

const getPais = async () => {
    const urlPais = 'http://127.0.0.1:8000/api/pais/datos'
    try {
        axios.get(urlPais)
            .then(function (response) {
                paises.value = response.data.result
            })
    } catch (error) {
        ElMessage.error('Error al obtener países');
    }
}

const getDepartamento = async (idPais: number) => {
    if (!idPais) return
    const urlDepartamento = `http://127.0.0.1:8000/api/departamento/datos/${idPais}`
    try {
        const response = await axios.get(urlDepartamento)
        if (Array.isArray(response.data)) {
            departamentos.value = response.data.sort((a, b) => a.nombre_departamento.localeCompare(b.nombre_departamento))

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
            ciudades.value = response.data.sort((a, b) => a.nombre_municipio.localeCompare(b.nombre_municipio))
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

    } catch (error) {
        console.error('Error al obtener ciudades:', error)
        ciudadResidencia.value = []
    }
}

const getCargos = async () => {
    const urlCargos = 'http://127.0.0.1:8000/api/cargos/datos'
    try {
        axios.get(urlCargos)
            .then(function (response) {
                cargos.value = response.data.result

            })
    } catch (error) {
        console.error('Error al obtener cargos:', error)
        cargos.value = []
    }
}

const getProgramas = async () => {
    const urlProgramas = 'http://127.0.0.1:8000/api/programa/datos'
    try {
        axios.get(urlProgramas)
            .then(function (response) {
                programas.value = response.data.result

            })
    } catch (error) {
        console.error('Error al obtener programas:', error)
        programas.value = []
    }
}

const getCentroCosto = async () => {
    const urlCentroCosto = 'http://127.0.0.1:8000/api/centro_costo/datos'
    try {
        axios.get(urlCentroCosto)
            .then(function (response) {
                centro_costo.value = response.data.result

            })
    } catch (error) {
        console.error('Error al obtener centro de costo:', error)
        centro_costo.value = []
    }
}

const handlePaisChange = async (nuevoPaisId: number | string) => {
    if (!nuevoPaisId) {
        departamentos.value = [];
        ciudades.value = [];
        return;
    }
    paisSeleccionado.value = Number(nuevoPaisId);
    await getDepartamento(Number(nuevoPaisId));
    departamentoSeleccionado.value = null;
    ciudades.value = [];
}

const handleDepartamentoChange = async (nuevoDepartamentoId: number | string) => {
    if (!nuevoDepartamentoId) {
        ciudades.value = [];
        return;
    }
    departamentoSeleccionado.value = Number(nuevoDepartamentoId);
    await getCiudad(Number(nuevoDepartamentoId));
}

//Guardar datos del colaborador
const guardarColaborador = async () => {
    loadingForm.value = true;
    try {
        // Verifica que el formulario existe
        if (!refForm.value) {
            ElMessage.error('Error: Formulario no inicializado');
            loadingForm.value = false;
            return;
        }

        // Espera a que el DOM se actualice antes de validar
        await nextTick();

        // Validar el formulario antes de enviar
        const validacion = await refForm.value.validarForm();
        if (!validacion) {
            ElMessage.warning('Por favor, complete todos los campos requeridos');
            return;
        }

        // Formatear la fecha
        const fechaNacimiento = formatearFecha(refForm.value.form.date);
        if (!fechaNacimiento) {
            ElMessage.error('La fecha de nacimiento no es válida');
            return;
        }

        // Crear el objeto con exactamente la misma estructura que en Postman
        const formData = {
            nombres: refForm.value.form.nombres,
            apellidos: refForm.value.form.apellidos,
            tipo_documento_id: Number(refForm.value.form.tipoDocumento), // Convertir a número
            numero_documento: refForm.value.form.numeroDocumento,
            fecha_nacimiento: fechaNacimiento,
            ciudad_nacimiento_id: Number(refForm.value.form.ciudad), // Convertir a número
            ciudad_residencia_id: Number(refForm.value.form.ciudadResidencia), // Convertir a número
            direccion: refForm.value.form.direccion,
            telefono_fijo: refForm.value.form.telefonoFijo || null, // Opcional
            celular: refForm.value.form.celular,
            email: refForm.value.form.email,
            id_cargos: Number(refForm.value.form.cargo), // Convertir a número
            id_programas: Number(refForm.value.form.programa), // Convertir a número
            id_centro_costo: Number(refForm.value.form.centro_costo) // Convertir a número
        };

        // Validar que todos los campos requeridos tengan valor y sean del tipo correcto
        const camposRequeridos = {
            nombres: 'string',
            apellidos: 'string',
            tipo_documento_id: 'number',
            numero_documento: 'string',
            fecha_nacimiento: 'string',
            ciudad_nacimiento_id: 'number',
            ciudad_residencia_id: 'number',
            direccion: 'string',
            celular: 'string',
            email: 'string',
            id_cargos: 'number',
            id_programas: 'number',
            id_centro_costo: 'number'
        };

        for (const [campo, tipo] of Object.entries(camposRequeridos)) {
            if (!formData[campo]) {
                ElMessage.error(`El campo ${campo} es requerido`);
                return;
            }
            if (typeof formData[campo] !== tipo) {
                ElMessage.error(`El campo ${campo} debe ser de tipo ${tipo}`);
                return;
            }
        }



        const response = await axios.post('http://127.0.0.1:8000/api/colaborador/guardar', formData);

        // Verificar la respuesta del servidor
        if (response.data && (response.data.status === 'success' || response.status === 200 || response.data.message.includes('exitosamente'))) {
            ElMessage({
                message: 'Colaborador guardado exitosamente',
                type: 'success',
                duration: 3000
            });

            // Limpiar el formulario
            limpiarFormulario();

            // Actualizar la lista de colaboradores
            await obtenerColaboradores();

            // Cerrar el formulario
            mostrarFormulario.value = false;
            editandoFormulario.value = false;
        } else {
            throw new Error(response.data.message || 'Error al guardar el colaborador');
        }
    } catch (error) {
        console.error('Error al guardar colaborador:', error);
        ElMessage({
            message: error.response?.data?.message || error.message || 'Error al guardar el colaborador',
            type: 'error',
            duration: 5000
        });
    } finally {
        loadingForm.value = false;
    }
};

const obtenerColaboradores = async () => {
    loadingTable.value = true;
    try {
        const urlColaboradores = 'http://127.0.0.1:8000/api/colaborador/datos'
        const response = await axios.get(urlColaboradores);

        const datos = response.data.result || response.data;
        if (!datos) {
            throw new Error('No hay datos disponibles');
        }

        colaboradores.value = datos.map(col => ({
            id: col.id,
            nombre_completo: `${col.nombres} ${col.apellidos}`,
            numero_documento: col.identificacion?.numero_documento,
            cargo_nombre: col.cargo?.nombre_cargo || '-',
            celular: col.celular,
            email: col.email
        }));

        // Limpiar el formulario y los selectores en cascada
        if (refForm.value) {
            // Resetear formulario base
            refForm.value.resetForm();

            // Limpiar selectores en cascada
            handlePaisChange('');
            handleDepartamentoChange('');

            // Forzar la limpieza de los campos problemáticos
            refForm.value.form.pais = '';
            refForm.value.form.departamento = '';
            refForm.value.form.ciudad = '';
            refForm.value.form.ciudadResidencia = '';
            refForm.value.form.direccion = '';
            refForm.value.form.telefonoFijo = '';

            // Limpiar las referencias de datos
            departamentos.value = [];
            ciudades.value = [];
        }

        mostrarFormulario.value = false;
        editandoFormulario.value = false;

    } catch (error) {
        console.error('Error detallado:', error);
        ElMessage({
            message: 'Error al cargar los colaboradores: ' + (error.response?.data?.message || error.message),
            type: 'error',
            duration: 5000
        });
    } finally {
        loadingTable.value = false;
    }
}

const getColaboradorById = async (id: number) => {
    loadingForm.value = true;
    try {
        const urlColaboradorById = `http://127.0.0.1:8000/api/colaborador/dataById/${id}`
        const response = await axios.get(urlColaboradorById);
        const data = response.data;

        // Obtener el ID del departamento
        const departamentoId = data.ciudad_nacimiento?.id_departamentos;

        // Cargar todos los departamentos
        const urlTodosDepartamentos = 'http://127.0.0.1:8000/api/departamento/datos';
        const responseTodos = await axios.get(urlTodosDepartamentos);
        const todosLosDepartamentos = responseTodos.data.result || responseTodos.data;

        // Buscar el departamento y su país
        const depEncontrado = todosLosDepartamentos.find(d => Number(d.id) === Number(departamentoId));
        const paisId = depEncontrado?.id_pais;

        // Cargar datos en cascada
        if (paisId) {
            await getDepartamento(paisId);
            await getCiudad(departamentoId);
        }

        const formData = {
            id: data.id,
            nombres: data.nombres,
            apellidos: data.apellidos,
            tipoDocumento: data.identificacion?.tipo_documento_id,
            numeroDocumento: data.identificacion?.numero_documento,
            date: data.fecha_nacimiento,
            pais: paisId,
            departamento: departamentoId,
            ciudad: data.ciudad_nacimiento_id,
            ciudadResidencia: data.ciudad_residencia_id,
            direccion: data.direccion,
            telefonoFijo: data.telefono_fijo,
            celular: data.celular,
            email: data.email,
            cargo: data.id_cargos,
            programa: data.id_programas,
            centro_costo: data.id_centro_costo
        };

        // Actualizar las referencias reactivas
        paisSeleccionado.value = paisId;
        departamentoSeleccionado.value = departamentoId;

        // Establecer los datos en el formulario
        await nextTick();
        if (refForm.value) {
            refForm.value.setFormData(formData);
        }

    } catch (error) {
        console.error('Error completo:', error);
        ElMessage.error('Error al cargar los datos del colaborador');
    } finally {
        loadingForm.value = false;
    }
}

const actualizarColaborador = async () => {
    loadingForm.value = true;
    try {
        if (!refForm.value) {
            ElMessage.error('Error: Formulario no inicializado');
            return;
        }

        const formData = refForm.value.form;

        if (!formData || !formData.id) {
            ElMessage.error('Error: Datos del formulario incompletos');
            return;
        }

        // Formatear la fecha correctamente
        const formatearFecha = (fecha) => {
            if (!fecha) return null;
            const date = new Date(fecha);
            return date.toISOString().split('T')[0]; // Retorna YYYY-MM-DD
        };

        const urlActualizar = `http://127.0.0.1:8000/api/colaborador/actualizar/${formData.id}`;

        const datosActualizados = {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            tipo_documento_id: Number(formData.tipoDocumento),
            numero_documento: formData.numeroDocumento,
            fecha_nacimiento: formatearFecha(formData.date), // Formatear la fecha
            ciudad_nacimiento_id: Number(formData.ciudad),
            ciudad_residencia_id: Number(formData.ciudadResidencia),
            direccion: formData.direccion,
            telefono_fijo: formData.telefonoFijo,
            celular: formData.celular,
            email: formData.email,
            id_cargos: Number(formData.cargo),
            id_programas: Number(formData.programa),
            id_centro_costo: Number(formData.centro_costo)
        };

        const response = await axios.put(urlActualizar, datosActualizados);

        if (response.data) {
            ElMessage.success('Colaborador actualizado exitosamente');
            await obtenerColaboradores();
            mostrarFormulario.value = false;
            editandoFormulario.value = false;
        }
    } catch (error) {
        console.error('Error al actualizar:', error);
        if (error.response?.status === 422) {
            console.log('Errores de validación:', error.response.data.errors);
            ElMessage.error('Error de validación en los datos');
        } else {
            ElMessage.error('Error al actualizar el colaborador');
        }
    } finally {
        loadingForm.value = false;
    }
};

const eliminarColaborador = async (id: number) => {
    try {
        const result = await ElMessageBox.confirm(
            "¿Estás seguro de querer eliminar este colaborador?",
            "Confirmación",
            {
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                type: "warning",
            }
        );

        if (result) {
            const urlEliminar = `http://127.0.0.1:8000/api/colaborador/borrar/${id}`;
            const response = await axios.delete(urlEliminar);

            if (response.data && response.data.message) {
                await obtenerColaboradores();
                ElMessage({
                    type: "success",
                    message: response.data.message,
                });
            }
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        ElMessage({
            type: "error",
            message: error.response?.data?.message || "Error al eliminar el colaborador",
        });
    }
};



const limpiarFormulario = () => {
    if (refForm.value) {
        refForm.value.limpiarFormulario();
    }
    mostrarFormulario.value = false;
    editandoFormulario.value = false;
}

const formatearFecha = (fecha: string | Date): string | null => {
    if (!fecha) return null;
    try {
        const date = new Date(fecha);
        if (isNaN(date.getTime())) return null;
        return date.toISOString().split('T')[0];
    } catch {
        return null;
    }
};

onMounted(() => {
    getPais()
    getTipoDocumento()
    getCiudadResidencia()
    getCargos()
    getProgramas()
    getCentroCosto()
    obtenerColaboradores()
})



</script>


<style scoped>
.table-container {
    width: 100%;
    overflow-x: auto;
    padding: 0 1rem;
    display: flex;
    justify-content: center;
}

.el-table {
    text-align: center;
    width: 100%;
    height: 100%;
    max-width: 1200px;
    overflow-x: auto;
    margin: 0 auto;
}
</style>