<template>

    <el-container v-show="isVisible" class="form-container">
        <el-row :gutter="5" class="form-container__row">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="form-container_title-col">
                <h2 class="titulo">{{ props.titulo }}</h2>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="form-container_button-group">
                <el-button class="form-container_button-cancel" @click="volver">Cancelar</el-button>
                <el-button class="form-container_button-save" type="primary" @click="guardar">
                    {{ titleButton }}
                </el-button>
            </el-col>
        </el-row>
        <el-main class="form-container__main">
            <slot name="slotForm"></slot>
        </el-main>
    </el-container>


</template>

<script setup lang="ts">
import { computed } from 'vue'


const props = defineProps({
    titulo: { type: String, required: true },
    isOpen: { type: Boolean, required: true },
    isEdit: { type: Boolean, default: false }
})

const titleButton = computed(() => (props.isEdit ? 'Actualizar' : 'Guardar'))

const isVisible = computed(() => props.isOpen)

const $emit = defineEmits(['update:isOpen', 'save', 'update', 'cancel'])

const volver = () => {
    $emit('update:isOpen', false)
    $emit('cancel')
}
const guardar = () => {
    if (props.isEdit) {
        console.log("Vamos a actualizar!")
        $emit('update')
    } else {
        $emit('save')
        console.log("Vamos a guardar!")
    }
}



</script>

<style scoped>
.form-container {
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    right: 5px;
    width: 100%;
    z-index: 90;
    background-color: #f5f7fa;
    display: flex;
    flex-direction: column;
    height: calc(100vh + 42%);
    background: linear-gradient(to right, #f5f7fa, #e4e7eb);
    
}

.form-container__row {
    display: flex;
    align-items: center;
    padding: 10px;
    color: #2c3e50; /* Color de texto principal */
}

.form-container_button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.form-container_button-cancel {
    background-color: #ffffff;
    border-color: #95a5a6;
    color: #7f8c8d;
}

.form-container_button-cancel:hover {
    background-color: #f8f9fa;
    border-color: #7f8c8d;
    color: #2c3e50;
}

.form-container_button-save {
    background-color: #3498db;
    border-color: #3498db;
    color: #ffffff;
}

.form-container_button-save:hover {
    background-color: #2980b9;
    border-color: #2980b9;
    color: #ffffff;
}

.form-container__row {
    display: flex;
    align-items: center;
    padding: 10px;
}

.form-container_button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.form-container_button-cancel {
    background-color: #ffffff;
    border-color: #636262;
    color: #636262;
}

.form-container_button-cancel:hover {
    background-color: #f0f0f0;
    border-color: #4a4949;
    color: #4a4949;
}

.form-container_button-save {
    background-color: #636262;
    border-color: #636262;
    color: #fff;
}

.form-container_button-save:hover {
    background-color: #4a4949;
    border-color: #4a4949;
    color: #fff;
}
</style>