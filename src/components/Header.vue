<template>
    <div class="row">
        <div class="col">    
            <h2>Módulo de {{title}}</h2>
        </div>
        <div class="col">
            <el-button type="primary">{{ titleButton }}</el-button>
        </div>
</div>
</template>

<script setup>
defineProps({
    title: String,
    titleButton: String,

})
</script>


<style scoped>
    .row{
        display: flex;
        align-items: center;
        padding-inline: 3rem;
        justify-content: space-between;
    }
</style>