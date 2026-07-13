<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">
        <el-menu-item index="0">
            <img src="../assets/logo.png" style="width: 100px" alt="Element logo" />
        </el-menu-item>
        <el-sub-menu index="1">
            <template #title>Evalucion 360</template>
            <el-menu-item index="1-1">Perfil</el-menu-item>
            <el-menu-item index="1-2">Cerrar sesion</el-menu-item>
        </el-sub-menu>
        
    </el-menu>
    
</template>

<script lang="ts" setup>
//import DarkModeToogle from './DarkModeToogle.vue';
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}
</style>