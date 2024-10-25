<script setup>
import NavBar from "./NavBarr.vue";
import SideBarMenu from "./SideBarMenu.vue";
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <NavBar/>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <SideBarMenu/>
                </el-aside>
                <el-container>
                    <el-main>
                        <slot name="slotLayout"></slot>
                    </el-main>
                    
                </el-container>
            </el-container>
            <el-container>
                    <el-footer>Footer</el-footer>
                </el-container>
        </el-container>
    </div>
</template>

<style>
#common-layout{
    max-width: 100%;
    margin: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    display: flex;
}
.el-header{
padding: 0;

}
.el-container{
    display: flex;
}
</style>
