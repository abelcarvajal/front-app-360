<template>
    <el-menu :default-active="$route.path" router class="el-menu-vertical-demo">
        <el-menu-item index="/colaboradores">
            <el-icon>
                <UserFilled />
            </el-icon>
            <template #title>Colaboradores</template>
        </el-menu-item>
        <el-menu-item index="cargos">
            <el-icon><icon-menu /></el-icon>
            <template #title>Cargos</template>
        </el-menu-item>
        <el-menu-item index="/criterios">
            <el-icon>
                <document />
            </el-icon>
            <template #title>Gestión de Criterios</template>
        </el-menu-item>
        <el-menu-item index="4">
            <el-icon>
                <setting />
            </el-icon>
            <template #title>Navigator Four</template>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
//import { ref } from "vue";
import {
    Document,
    Menu as IconMenu,
    Setting,
    UserFilled,
} from "@element-plus/icons-vue";

// const isCollapse = ref(true);
// const handleOpen = (key: string, keyPath: string[]) => {
//     console.log(key, keyPath);
// };
// const handleClose = (key: string, keyPath: string[]) => {
//     console.log(key, keyPath);
// };
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>
