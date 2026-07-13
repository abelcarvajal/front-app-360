<template>
    <el-menu :default-active="$route.path" router class="el-menu-vertical-demo">
        <el-sub-menu index="1">
            <template #title>
                <el-icon>
                    <Setting />
                </el-icon>
                <span>Administración</span>
            </template>
            <el-menu-item index="/colaboradores">Colaboradores</el-menu-item>
            <el-menu-item index="cargos">Cargos</el-menu-item>
            <el-menu-item index="/criterios">Gestión de Criterios</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="2">   
            <template #title>
                <el-icon><EditPen /></el-icon>
                <span>Evaluación 360</span>
            </template>
            <el-menu-item index="/autoevaluacion">Autoevaluación</el-menu-item>
            <el-menu-item index="/evaluacion">Evaluación</el-menu-item>
            <el-menu-item index="/lideres">Evaluación equipo</el-menu-item>
        </el-sub-menu>
        
    </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
    Document,
    EditPen,
    Menu as IconMenu,
    Setting,
    UserFilled,
} from "@element-plus/icons-vue";

</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>
