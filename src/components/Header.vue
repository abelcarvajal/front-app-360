<template>
    <div class="container">
        <div class="container__header">
            <h2>Módulo de {{ title }}</h2>
            <el-row>
                <el-button type="primary" @click="abrir" class="padded-button">{{ titleButton }}</el-button>
            </el-row>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: { type: String, required: true },
    titleButton: { type: String, required: true },
    abrir: {
        type: Function,
        required: true
    }

})
</script>


<style scoped>
.container{
    margin-bottom: 10px;
}
.container__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgb(100, 100, 100);
    color: #a5a5a5;
}
.padded-button{
    margin-left: 10px;
    padding: 10px;
    background-color: #7e7e7e;
    border-color: #7e7e7e;
    color: #fff;
}

</style>