<script setup>
import NavBar from "./NavBarr.vue";
import SideBarMenu from "./SideBarMenu.vue";

</script>

<template>

    <el-container style="height: 100vh;">
        <el-header>
            <NavBar />
        </el-header>
        <el-container>
            <el-aside width="200px">
                <SideBarMenu />
            </el-aside>
            <el-container>
                <el-main class="main-content">
                    <slot name="slotLayout"></slot>
                </el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
    </el-container>

</template>

<style>
.el-header {
    padding: 0;
    background-color: #333;
}

.el-aside {
    background-color: #333;
    width: 200px;
    height: 100%;
}

.el-menu {
    height: 100%;
}

.el-container {
    background-color: #333;
}

.el-container:first-child {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.el-main {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #fff;
}

.main-content {
    position: relative;
    height: 100%;
}

.el-footer {
    padding: 5px;
    background-color: #333;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
    color: #fff;
    flex-shrink: 0;
}
</style>
