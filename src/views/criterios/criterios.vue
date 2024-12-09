<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :title="'Criterios'" :titleButton="'Nuevo Criterio'" :abrir="abrirFormulario" />

            <Formulario titulo="Gestion de criterios de evaluación" v-model:is-open="mostrarFormulario"
                :is-edit="editandoFormulario" @save="guardarDatos" @update="actualizarCriterio"
                @cancel="obtenerCriterios">
                <template #slotForm>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <formCriterios
                        v-model:is-open="mostrarFormulario"
                        ref="refForm"
                        data-value="dataCriterio" 
                        :loading="loadingForm"
                        :element-loading-spinner="svg"
                        element-loading-svg-view-box="-10, -10, 50, 50"
                        element-loading-background="rgba(122, 122, 122, 0.8)"
                        />
                    </el-col>
                </template>
            </Formulario>

            <el-table 
            v-loading="loadingTable"
            element-loading-text="Loading..."
            :element-loading-spinner="svg"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            :data="criterios">
                <el-table-column fixed prop="categoria" label="Categoría Criterio" width="150" />
                <el-table-column prop="descripcion" label="Descripción" width="200" />
                <el-table-column prop="criterio1" label="Criterio 1" width="200" />
                <el-table-column prop="criterio2" label="Criterio 2" width="200" />
                <el-table-column prop="criterio3" label="Criterio 3" width="200" />
                <el-table-column prop="criterio4" label="Criterio 4" width="200" />
                <el-table-column prop="criterio5" label="Criterio 5" width="200" />
                <el-table-column fixed="right" label="Opciones" min-width="150">
                    <template #default="scope">
                        <el-button plain type="primary" :icon="Edit"
                            @click="editarFormulario(scope.row.id)"></el-button>
                        <el-button plain type="danger" :icon="Delete"
                            @click="eliminarCriterio(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </LayoutMain>
</template>

<script lang="ts" setup>
import LayoutMain from "../../components/LayoutMain.vue";
import Header from "../../components/Header.vue";
import formCriterios from "./components/formCriterios.vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import Formulario from "../../components/Formulario.vue";
import { reactive, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";

const loadingTable = ref(false)
const loadingForm = ref(false)
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

const mostrarFormulario = ref(false);
const editandoFormulario = ref(false);
const refForm = ref();
const criterios = ref<CriterioMapped[]>([]);
const dataCriterio = ref();

const abrirFormulario = () => {
    mostrarFormulario.value = true;
    editandoFormulario.value = false;
};

const editarFormulario = async (row: number) => {
    loadingForm.value = true;
    try {
        await getDataById(row);
        mostrarFormulario.value = true;
        editandoFormulario.value = true;
    } catch (error) {
        ElMessage.error("Error al editar el criterio");
    } finally {
        loadingForm.value = false;
    }
};

const guardarDatos = async () => {
    const validacion = await refForm.value.validarForm();

    if (validacion) {
        await crearCriterio();
    }
};

const crearCriterio = async () => {
    loadingForm.value = true;
    try {
        const urlCatCrit = "http://127.0.0.1:8000/api/categorias/guardar";

        const dataCatCrit = {
            categoria: refForm.value.form.categoria,
            descripcion: refForm.value.form.descripcion,
        };

        for (let i = 1; i <= 5; i++) {
            dataCatCrit[`criterio${i}`] = refForm.value.form[`criterio${i}`];
        }

        await axios.post(urlCatCrit, dataCatCrit);
        refForm.value?.limpiarFormulario();
        ElMessage.success("Criterio creado correctamente");
        await obtenerCriterios();
    } catch (error) {
        console.error(error);
        ElMessage.error("Error al crear el criterio");
    } finally {
        loadingForm.value = false;
    }
};

const getDataById = async (id: number) => {
    loadingForm.value = true;
    try {
        const urlCatCrit = `http://127.0.0.1:8000/api/categorias/dataById/${id}`;
        const response = await axios.get(urlCatCrit);
        const data = response.data.result;

        const formData = {
            id: data.id,
            categoria: data.categoria,
            descripcion: data.descripcion,
        };

        for (let i = 1; i <= 5; i++) {
            formData[`criterio${i}`] = data.criterios?.[i - 1]?.criterio || "";
        }

        refForm.value.cargarDatos(formData);
    } catch (error) {
        ElMessage.error("Error al cargar los datos del criterio");
    } finally {
        loadingForm.value = false;
    }
};

const actualizarCriterio = async () => {
    loadingForm.value = true;
    try {
        const validacion = await refForm.value.validarForm();
        if (!validacion) {
            return;
        }

        const urlActualizar = `http://127.0.0.1:8000/api/categorias/actualizar/${refForm.value.form.id}`;
        const formData = {
            categoria: refForm.value.form.categoria,
            descripcion: refForm.value.form.descripcion,
            criterio1: refForm.value.form.criterio1 || "",
            criterio2: refForm.value.form.criterio2 || "",
            criterio3: refForm.value.form.criterio3 || "",
            criterio4: refForm.value.form.criterio4 || "",
            criterio5: refForm.value.form.criterio5 || "",
        };

        await axios.put(urlActualizar, formData);
        ElMessage.success("Criterio actualizado correctamente");
        mostrarFormulario.value = false;
        await obtenerCriterios();
        limpiarFormulario();
    } catch (error) {
        ElMessage.error("Error al actualizar el criterio");
    } finally {
        loadingForm.value = false;
    }
};

const obtenerCriterios = async () => {
    loadingTable.value = true;
    try {
        const urlCatCrit = "http://127.0.0.1:8000/api/categorias/datos";
        const response = await axios.get<{
            status: string;
            message: string;
            result: CategoriaResponse[];
        }>(urlCatCrit);
        
        const datos = Array.isArray(response.data.result)
            ? response.data.result
            : [response.data.result];

        criterios.value = datos.map((item: CategoriaResponse) => {
            const mappedItem: CriterioMapped = { ...item };
            for (let i = 0; i < 5; i++) {
                mappedItem[`criterio${i + 1}`] = item.criterios?.[i]?.criterio || "";
            }
            return mappedItem;
        });

        if (refForm.value) {
            refForm.value.resetForm();
        }
        mostrarFormulario.value = false;
        editandoFormulario.value = false;

    } catch (error) {
        console.error("Error al obtener criterios:", error);
        ElMessage.error("Error al cargar los criterios");
        criterios.value = [];
    } finally {
        loadingTable.value = false;
    }
};

const eliminarCriterio = async (id: number) => {
    ElMessageBox.confirm(
        "¿Estás seguro de querer eliminar este criterio?",
        "Confirmación",
        {
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            type: "warning",
        }
    )
        .then(async () => {
            const urlCatCrit = "http://127.0.0.1:8000/api/categorias/borrar/";
            await axios.delete(urlCatCrit + id);
            await obtenerCriterios();
            ElMessage({
                type: "success",
                message: "Criterio eliminado correctamente",
            });
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "Eliminación cancelada",
            });
        });
};

const limpiarFormulario = () => {
    refForm.value?.limpiarFormulario();
    mostrarFormulario.value = false;
    editandoFormulario.value = false;
    dataCriterio.value = undefined;
};

onMounted(() => {
    obtenerCriterios();
});

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
.el-table {
    text-align: center;
    width: 100%;
    height: 100%;
}
</style>
