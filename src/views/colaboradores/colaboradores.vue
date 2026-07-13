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
import Header from '../../components/Header.vue';
import formColaboradores from './components/formColaboradores.vue';
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import Formulario from '../../components/Formulario.vue';
import { ref, onMounted, nextTick } from 'vue';
import api, { ENDPOINTS } from '../../config/api'; // ✅ Solo api y ENDPOINTS

const svg = `
    <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
    " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`;

const loadingForm = ref(false); 0
const loadingTable = ref(false);

const mostrarFormulario = ref(false);
const editandoFormulario = ref(false);

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

const tipoDocumento = ref<any[]>([]);
const paises = ref<Pais[]>([]);
const departamentos = ref<Departamento[]>([]);
const ciudades = ref<Ciudad[]>([]);
const ciudadResidencia = ref<any[]>([]);
const paisSeleccionado = ref<number | null>(null);
const departamentoSeleccionado = ref<number | null>(null);
const cargos = ref<any[]>([]);
const programas = ref<any[]>([]);
const centro_costo = ref<any[]>([]);
const refForm = ref<InstanceType<typeof formColaboradores> | null>(null);
const colaboradores = ref<Colaborador[]>([]);

const abrirFormulario = () => {
    mostrarFormulario.value = true;
    editandoFormulario.value = false;
};

const editarFormulario = async (row: number) => {
    loadingForm.value = true;
    try {
        await getColaboradorById(row);
        mostrarFormulario.value = true;
        editandoFormulario.value = true;
    } catch (error) {
        console.error('Error al editar:', error);
        ElMessage.error('Error al cargar el formulario de edición');
    } finally {
        loadingForm.value = false;
    }
};

// === Funciones para obtener datos ===

const getTipoDocumento = async () => {
    try {
        const response = await api.get(ENDPOINTS.TIPODOC_DATOS);
        tipoDocumento.value = response.data.result;
    } catch (error) {
        ElMessage.error('Error al obtener tipos de documento');
        console.error(error);
    }
};

const getPais = async () => {
    try {
        const response = await api.get(ENDPOINTS.PAIS_DATOS);
        paises.value = response.data.result;
    } catch (error) {
        ElMessage.error('Error al obtener países');
        console.error(error);
    }
};

const getDepartamento = async (idPais: number) => {
    if (!idPais) return;
    try {
        const response = await api.get(ENDPOINTS.DEPARTAMENTO_DATOS(idPais));
        if (Array.isArray(response.data.result)) {
            departamentos.value = response.data.result.sort((a, b) =>
                a.nombre_departamento.localeCompare(b.nombre_departamento)
            );
        } else {
            console.error('La respuesta no contiene un array:', response.data);
            departamentos.value = [];
        }
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        departamentos.value = [];
        ElMessage.error('Error al cargar departamentos');
    }
};

const getCiudad = async (idDepartamento: number) => {
    if (!idDepartamento) return;
    try {
        const response = await api.get(ENDPOINTS.MUNICIPIO_DATOS(idDepartamento));
        if (Array.isArray(response.data.result)) {
            ciudades.value = response.data.result.sort((a, b) =>
                a.nombre_municipio.localeCompare(b.nombre_municipio)
            );
        } else {
            ciudades.value = [];
        }
    } catch (error) {
        console.error('Error al obtener ciudades:', error);
        ciudades.value = [];
        ElMessage.error('Error al cargar ciudades');
    }
};

const getCiudadResidencia = async () => {
    try {
        const response = await api.get(ENDPOINTS.MUNICIPIO_RESIDENCIA);
        ciudadResidencia.value = response.data.result || response.data;
    } catch (error) {
        console.error('Error al obtener ciudad de residencia:', error);
        ciudadResidencia.value = [];
        ElMessage.error('Error al cargar ciudad de residencia');
    }
};

const getCargos = async () => {
    try {
        const response = await api.get(ENDPOINTS.CARGOS_DATOS);
        cargos.value = response.data.result;
    } catch (error) {
        console.error('Error al obtener cargos:', error);
        cargos.value = [];
        ElMessage.error('Error al cargar cargos');
    }
};

const getProgramas = async () => {
    try {
        const response = await api.get(ENDPOINTS.PROGRAMAS_DATOS);
        programas.value = response.data.result;
    } catch (error) {
        console.error('Error al obtener programas:', error);
        programas.value = [];
        ElMessage.error('Error al cargar programas');
    }
};

const getCentroCosto = async () => {
    try {
        const response = await api.get(ENDPOINTS.CENTRO_COSTO_DATOS);
        centro_costo.value = response.data.result;
    } catch (error) {
        console.error('Error al obtener centro de costo:', error);
        centro_costo.value = [];
        ElMessage.error('Error al cargar centro de costo');
    }
};

// === Manejadores de cambios en selectores ===

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
};

const handleDepartamentoChange = async (nuevoDepartamentoId: number | string) => {
    if (!nuevoDepartamentoId) {
        ciudades.value = [];
        return;
    }
    departamentoSeleccionado.value = Number(nuevoDepartamentoId);
    await getCiudad(Number(nuevoDepartamentoId));
};

// === Guardar colaborador ===

const guardarColaborador = async () => {
    loadingForm.value = true;
    try {
        if (!refForm.value) {
            ElMessage.error('Error: Formulario no inicializado');
            return;
        }

        await nextTick();
        const validacion = await refForm.value.validarForm();
        if (!validacion) {
            ElMessage.warning('Por favor, complete todos los campos requeridos');
            return;
        }

        const fechaNacimiento = formatearFecha(refForm.value.form.date);
        if (!fechaNacimiento) {
            ElMessage.error('La fecha de nacimiento no es válida');
            return;
        }

        const formData = {
            nombres: refForm.value.form.nombres,
            apellidos: refForm.value.form.apellidos,
            tipo_documento_id: Number(refForm.value.form.tipoDocumento),
            numero_documento: refForm.value.form.numeroDocumento,
            fecha_nacimiento: fechaNacimiento,
            ciudad_nacimiento_id: Number(refForm.value.form.ciudad),
            ciudad_residencia_id: Number(refForm.value.form.ciudadResidencia),
            direccion: refForm.value.form.direccion,
            telefono_fijo: refForm.value.form.telefonoFijo || null,
            celular: refForm.value.form.celular,
            email: refForm.value.form.email,
            id_cargos: Number(refForm.value.form.cargo),
            id_programas: Number(refForm.value.form.programa),
            id_centro_costo: Number(refForm.value.form.centro_costo)
        };

        const response = await api.post(ENDPOINTS.COLABORADOR_GUARDAR, formData);

        if (response.data && (response.data.status === 'success' || response.status === 200)) {
            ElMessage.success('Colaborador guardado exitosamente');
            limpiarFormulario();
            await obtenerColaboradores();
            mostrarFormulario.value = false;
            editandoFormulario.value = false;
        } else {
            throw new Error(response.data.message || 'Error al guardar el colaborador');
        }
    } catch (error: any) {
        console.error('Error al guardar colaborador:', error);
        ElMessage.error(error.response?.data?.message || error.message || 'Error al guardar el colaborador');
    } finally {
        loadingForm.value = false;
    }
};

// === Obtener colaboradores ===

const obtenerColaboradores = async () => {
    loadingTable.value = true;
    try {
        const response = await api.get(ENDPOINTS.COLABORADOR_DATOS);
        const datos = response.data.result || response.data;
        if (!datos) throw new Error('No hay datos disponibles');

        colaboradores.value = datos.map((col: any) => ({
            id: col.id,
            nombre_completo: `${col.nombres} ${col.apellidos}`,
            numero_documento: col.identificacion?.numero_documento,
            cargo_nombre: col.cargo?.nombre_cargo || '-',
            celular: col.celular,
            email: col.email
        }));

        if (refForm.value) {
            refForm.value.resetForm();
            handlePaisChange('');
            handleDepartamentoChange('');
            refForm.value.form.pais = '';
            refForm.value.form.departamento = '';
            refForm.value.form.ciudad = '';
            refForm.value.form.ciudadResidencia = '';
            refForm.value.form.direccion = '';
            refForm.value.form.telefonoFijo = '';
            departamentos.value = [];
            ciudades.value = [];
        }

        mostrarFormulario.value = false;
        editandoFormulario.value = false;
    } catch (error: any) {
        console.error('Error al cargar colaboradores:', error);
        ElMessage.error('Error al cargar los colaboradores: ' + (error.response?.data?.message || error.message));
    } finally {
        loadingTable.value = false;
    }
};

// === Obtener colaborador por ID ===

const getColaboradorById = async (id: number) => {
    loadingForm.value = true;
    try {
        const response = await api.get(ENDPOINTS.COLABORADOR_DATABYID(id));
        const data = response.data;

        const departamentoId = data.ciudad_nacimiento?.id_departamentos;
        const responseTodos = await api.get(ENDPOINTS.DEPARTAMENTO_DATOS);
        const todosLosDepartamentos = responseTodos.data.result || responseTodos.data;
        const depEncontrado = todosLosDepartamentos.find((d: any) => Number(d.id) === Number(departamentoId));
        const paisId = depEncontrado?.id_pais;

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

        paisSeleccionado.value = paisId;
        departamentoSeleccionado.value = departamentoId;

        await nextTick();
        if (refForm.value) {
            refForm.value.setFormData(formData);
        }
    } catch (error) {
        console.error('Error al cargar colaborador:', error);
        ElMessage.error('Error al cargar los datos del colaborador');
    } finally {
        loadingForm.value = false;
    }
};

// === Actualizar colaborador ===

const actualizarColaborador = async () => {
    loadingForm.value = true;
    try {
        if (!refForm.value?.form?.id) {
            ElMessage.error('Error: Datos del formulario incompletos');
            return;
        }

        const formData = refForm.value.form;
        const formatearFecha = (fecha: any) => {
            if (!fecha) return null;
            const date = new Date(fecha);
            return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
        };

        const datosActualizados = {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            tipo_documento_id: Number(formData.tipoDocumento),
            numero_documento: formData.numeroDocumento,
            fecha_nacimiento: formatearFecha(formData.date),
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

        const response = await api.put(ENDPOINTS.COLABORADOR_ACTUALIZAR(formData.id), datosActualizados);
        ElMessage.success('Colaborador actualizado exitosamente');
        await obtenerColaboradores();
        mostrarFormulario.value = false;
        editandoFormulario.value = false;
    } catch (error: any) {
        console.error('Error al actualizar:', error);
        if (error.response?.status === 422) {
            ElMessage.error('Error de validación en los datos');
        } else {
            ElMessage.error(error.response?.data?.message || 'Error al actualizar el colaborador');
        }
    } finally {
        loadingForm.value = false;
    }
};

// === Eliminar colaborador ===

const eliminarColaborador = async (id: number) => {
    try {
        await ElMessageBox.confirm(
            "¿Estás seguro de querer eliminar este colaborador?",
            "Confirmación",
            {
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                type: "warning",
            }
        );

        const response = await api.delete(ENDPOINTS.COLABORADOR_BORRAR(id));
        ElMessage.success(response.data.message || 'Colaborador eliminado');
        await obtenerColaboradores();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('Error al eliminar:', error);
            ElMessage.error(error.response?.data?.message || "Error al eliminar el colaborador");
        }
    }
};

// === Funciones auxiliares ===

const limpiarFormulario = () => {
    if (refForm.value) refForm.value.limpiarFormulario();
    mostrarFormulario.value = false;
    editandoFormulario.value = false;
};

const formatearFecha = (fecha: string | Date): string | null => {
    if (!fecha) return null;
    try {
        const date = new Date(fecha);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    } catch {
        return null;
    }
};

// === Inicialización ===

onMounted(() => {
    getPais();
    getTipoDocumento();
    getCiudadResidencia();
    getCargos();
    getProgramas();
    getCentroCosto();
    obtenerColaboradores();
});
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