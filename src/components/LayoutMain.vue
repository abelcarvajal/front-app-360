<script setup>
import Footer from "./Footer.vue";
import NavBar from "./NavBarr.vue";
import SideBarMenu from "./SideBarMenu.vue";

</script>

<template>
    <el-container class="layout-container">
        <el-header class="fixed-header">
            <NavBar />
        </el-header>
        <el-container class="main-container">
            <el-aside width="200px" class="fixed-sidebar">
                <SideBarMenu />
            </el-aside>
            <el-container class="content-container">
                <el-main class="scrollable-main">
                    <slot name="slotLayout"></slot>
                </el-main>
                <el-footer class="fixed-footer">
                    <Footer />
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<style>
.layout-container {
    height: 100vh;
    overflow: hidden;
}

.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 0;
    background-color: #333;
    height: 60px;
}

.main-container {
    margin-top: 60px;
    height: calc(100vh - 60px);
}

.fixed-sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    bottom: 120px;
    background-color: #333;
    width: 200px !important;
    overflow-y: auto;
    z-index: 1000;
}

.content-container {
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
    position: relative;
    z-index: 900;
}

.scrollable-main {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #fff;
    margin-bottom: 120px;
}

.fixed-footer {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0;
    background-color: #333;
    height: 120px;
    z-index: 999;
}

.el-menu {
    height: 100%;
    border-right: none;
}

.main-content {
    position: relative;
    height: 100%;
}
</style>
