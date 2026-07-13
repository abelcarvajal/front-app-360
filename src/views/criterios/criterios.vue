<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :title="'Criterios'" :titleButton="'Nueva categoría'" :abrir="abrirNuevaCategoria" />

            <el-table v-loading="loadingTable" element-loading-text="Cargando..." :data="categorias" row-key="id">
                <el-table-column type="expand">
                    <template #default="{ row: categoriaRow }">
                        <div class="items-panel">
                            <div class="items-panel__header">
                                <span class="items-panel__titulo">Ítems de evaluación</span>
                                <el-button type="primary" size="small" :icon="Plus"
                                    @click="abrirNuevoItem(categoriaRow)">
                                    Nuevo ítem
                                </el-button>
                            </div>

                            <el-table v-if="categoriaRow.items?.length" :data="categoriaRow.items" size="small">
                                <el-table-column prop="nombre" label="Nombre" min-width="180" />
                                <el-table-column prop="descripcion" label="Descripción" min-width="260" />
                                <el-table-column label="Estado" width="140">
                                    <template #default="{ row: itemRow }">
                                        <el-switch v-model="itemRow.activo" active-text="Activo"
                                            inactive-text="Inactivo"
                                            @change="(valor) => cambiarEstadoItem(itemRow, valor as boolean)" />
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="Opciones" width="90">
                                    <template #default="{ row: itemRow }">
                                        <el-button plain type="primary" :icon="Edit"
                                            @click="editarItem(categoriaRow, itemRow)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <el-empty v-else description="Esta categoría todavía no tiene ítems" :image-size="60" />
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="categoria" label="Categoría" min-width="200" />
                <el-table-column prop="descripcion" label="Descripción" min-width="280" />
                <el-table-column label="Ítems" width="90">
                    <template #default="{ row }">{{ row.items?.length || 0 }}</template>
                </el-table-column>
                <el-table-column fixed="right" label="Opciones" width="150">
                    <template #default="{ row }">
                        <el-button plain type="primary" :icon="Edit" @click="editarCategoria(row)"></el-button>
                        <el-button plain type="danger" :icon="Delete" @click="eliminarCategoria(row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog v-model="dialogCategoriaVisible"
                :title="editandoCategoria ? 'Editar categoría' : 'Nueva categoría'" width="500px">
                <el-form :model="categoriaForm" :rules="categoriaRules" ref="categoriaFormRef" label-position="top">
                    <el-form-item label="Categoría" prop="categoria">
                        <el-input v-model="categoriaForm.categoria" placeholder="Ej: Competencias Generales" />
                    </el-form-item>
                    <el-form-item label="Descripción" prop="descripcion">
                        <el-input v-model="categoriaForm.descripcion" type="textarea" autosize
                            placeholder="Descripción de la categoría" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="dialogCategoriaVisible = false">Cancelar</el-button>
                    <el-button type="primary" :loading="loadingCategoriaForm" @click="guardarCategoria">
                        {{ editandoCategoria ? 'Actualizar' : 'Guardar' }}
                    </el-button>
                </template>
            </el-dialog>

            <el-drawer v-model="drawerItemVisible" :title="editandoItem ? 'Editar ítem' : 'Nuevo ítem'" size="480px">
                <formCriterios ref="refFormItem" :loading="loadingItemForm" />
                <template #footer>
                    <el-button @click="drawerItemVisible = false">Cancelar</el-button>
                    <el-button type="primary" :loading="loadingItemForm" @click="guardarItem">
                        {{ editandoItem ? 'Actualizar' : 'Guardar' }}
                    </el-button>
                </template>
            </el-drawer>
        </template>
    </LayoutMain>
</template>

<script lang="ts" setup>
import LayoutMain from "../../components/LayoutMain.vue";
import Header from "../../components/Header.vue";
import formCriterios from "./components/formCriterios.vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import api, { ENDPOINTS } from "@/config/api";

interface Nivel {
    nivel: number;
    descripcion: string;
}

interface Item {
    id: number;
    nombre: string;
    descripcion: string;
    id_categorias_criterios: number;
    activo: boolean;
    niveles: Nivel[];
}

interface Categoria {
    id: number;
    categoria: string;
    descripcion: string;
    items: Item[];
}

const loadingTable = ref(false);
const loadingCategoriaForm = ref(false);
const loadingItemForm = ref(false);
const categorias = ref<Categoria[]>([]);

const mostrarError = (error: any, mensajePorDefecto: string) => {
    const errores = error?.response?.data?.errors;
    if (errores) {
        Object.values(errores).flat().forEach((mensaje) => ElMessage.error(String(mensaje)));
    } else {
        ElMessage.error(error?.response?.data?.message || mensajePorDefecto);
    }
};

const obtenerCategorias = async () => {
    loadingTable.value = true;
    try {
        const response = await api.get(ENDPOINTS.CATEGORIAS_DATOS);
        categorias.value = response.data.result ?? [];
    } catch (error) {
        ElMessage.error("Error al cargar las categorías");
        categorias.value = [];
    } finally {
        loadingTable.value = false;
    }
};

// --- Categorías ---
const dialogCategoriaVisible = ref(false);
const editandoCategoria = ref(false);
const categoriaFormRef = ref<FormInstance>();
const categoriaForm = ref({ id: null as number | null, categoria: '', descripcion: '' });

const categoriaRules: FormRules = {
    categoria: [{ required: true, message: 'La categoría es requerida', trigger: 'blur' }],
    descripcion: [{ required: true, message: 'La descripción es requerida', trigger: 'blur' }],
};

const abrirNuevaCategoria = () => {
    categoriaForm.value = { id: null, categoria: '', descripcion: '' };
    categoriaFormRef.value?.clearValidate();
    editandoCategoria.value = false;
    dialogCategoriaVisible.value = true;
};

const editarCategoria = (row: Categoria) => {
    categoriaForm.value = { id: row.id, categoria: row.categoria, descripcion: row.descripcion };
    editandoCategoria.value = true;
    dialogCategoriaVisible.value = true;
};

const guardarCategoria = async () => {
    if (!categoriaFormRef.value) return;
    try {
        await categoriaFormRef.value.validate();
    } catch {
        return;
    }

    loadingCategoriaForm.value = true;
    try {
        const payload = {
            categoria: categoriaForm.value.categoria.trim(),
            descripcion: categoriaForm.value.descripcion.trim(),
        };

        if (editandoCategoria.value && categoriaForm.value.id) {
            await api.put(ENDPOINTS.CATEGORIA_ACTUALIZAR(categoriaForm.value.id), payload);
            ElMessage.success("Categoría actualizada correctamente");
        } else {
            await api.post(ENDPOINTS.CATEGORIAS_GUARDAR, payload);
            ElMessage.success("Categoría creada correctamente");
        }

        dialogCategoriaVisible.value = false;
        await obtenerCategorias();
    } catch (error) {
        mostrarError(error, "Error al guardar la categoría");
    } finally {
        loadingCategoriaForm.value = false;
    }
};

const eliminarCategoria = (id: number) => {
    ElMessageBox.confirm(
        "¿Estás seguro de querer eliminar esta categoría? También se eliminarán sus ítems.",
        "Confirmación",
        { confirmButtonText: "Eliminar", cancelButtonText: "Cancelar", type: "warning" }
    )
        .then(async () => {
            try {
                await api.delete(ENDPOINTS.CATEGORIA_BORRAR(id));
                ElMessage.success("Categoría eliminada correctamente");
                await obtenerCategorias();
            } catch (error) {
                mostrarError(error, "Error al eliminar la categoría");
            }
        })
        .catch(() => {
            // Eliminación cancelada por el usuario
        });
};

// --- Ítems ---
const drawerItemVisible = ref(false);
const editandoItem = ref(false);
const refFormItem = ref();

const abrirNuevoItem = async (categoriaRow: Categoria) => {
    editandoItem.value = false;
    drawerItemVisible.value = true;
    await nextTick();
    refFormItem.value?.cargarDatos({ id_categorias_criterios: categoriaRow.id });
};

const editarItem = async (_categoriaRow: Categoria, itemRow: Item) => {
    editandoItem.value = true;
    drawerItemVisible.value = true;
    await nextTick();
    refFormItem.value?.cargarDatos(itemRow);
};

const guardarItem = async () => {
    const valido = await refFormItem.value?.validarForm();
    if (!valido) return;

    loadingItemForm.value = true;
    try {
        const form = refFormItem.value.form;
        const payload = {
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            id_categorias_criterios: form.id_categorias_criterios,
            niveles: form.niveles.map((n: Nivel) => ({ nivel: n.nivel, descripcion: n.descripcion.trim() })),
        };

        if (editandoItem.value && form.id) {
            await api.put(ENDPOINTS.ITEMS_ACTUALIZAR(form.id), payload);
            ElMessage.success("Ítem actualizado correctamente");
        } else {
            await api.post(ENDPOINTS.ITEMS_GUARDAR, payload);
            ElMessage.success("Ítem creado correctamente");
        }

        drawerItemVisible.value = false;
        await obtenerCategorias();
    } catch (error) {
        mostrarError(error, "Error al guardar el ítem");
    } finally {
        loadingItemForm.value = false;
    }
};

const cambiarEstadoItem = async (item: Item, activo: boolean) => {
    try {
        await api.patch(ENDPOINTS.ITEMS_ESTADO(item.id), { activo });
        ElMessage.success(`Ítem ${activo ? "activado" : "desactivado"} correctamente`);
    } catch (error) {
        item.activo = !activo;
        mostrarError(error, "Error al cambiar el estado del ítem");
    }
};

onMounted(() => {
    obtenerCategorias();
});
</script>

<style scoped>
.el-table {
    text-align: center;
    width: 100%;
}

.items-panel {
    padding: 10px 20px;
    background-color: #fafafa;
}

.items-panel__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.items-panel__titulo {
    font-weight: bold;
    color: #606266;
}
</style>
