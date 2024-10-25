<template>
    <LayoutMain>
        <template #slotLayout>
            <Header :title="'Colaboradores'" :titleButton="'Nuevo Colaborador'">
            </Header>
            
            <FormColaborador>

                <template #slotForm>
                    <formColaboradores />
                </template>

            </FormColaborador>

            <div>
                <el-table :data="tableData" style="width: 100%" height="100%">
                    <el-table-column fixed prop="name" label="Nombre" width="250" />
                    <el-table-column prop="did" label="Did" width="100" />
                    <el-table-column prop="cargo" label="Cargo" width="100" />
                    <el-table-column prop="state" label="Departamento" width="150" />
                    <el-table-column prop="city" label="Ciudad" width="150" />
                    <el-table-column prop="address" label="Dirección" width="200" />
                    <el-table-column prop="phone" label="Teléfono" width="100" />
                    <el-table-column prop="email" label="Email" width="100" />
                    <el-table-column fixed="right" label="Opciones" min-width="120">
                        <template #default>
                            <el-button link type="primary" size="small" :icon="Edit"></el-button>
                            <el-button link type="danger" :icon="Delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </LayoutMain>
</template>


<script lang="ts" setup>
import LayoutMain from '../../components/LayoutMain.vue';
import Header from '../../components/Header.vue'
import formColaboradores from './components/formColaboradores.vue';
import {Delete, Edit} from"@element-plus/icons-vue"
import FormColaborador from '../../components/FormColaborador.vue';


const tableData = [
    {
        name: '2016-05-03',
        did: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        cargo: 'CA 90036',
        phone: '55555555',
        email: 'user@mail.com',
    },
    {
        name: '2016-05-02',
        did: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        cargo: 'CA 90036',
        phone: '55555555',
        email: 'user@mail.com',
    },
    {
        name: '2016-05-04',
        did: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        cargo: 'CA 90036',
        phone: '55555555',
        email: 'user@mail.com',
    },
    {
        name: '2016-05-01',
        did: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        cargo: 'CA 90036',
        phone: '55555555',
        email: 'user@mail.com',
    },
    {
        name: '2016-05-08',
        did: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        cargo: 'CA 90036',
        phone: '55555555',
        email: 'user@mail.com',
    },
    {
        name: '2016-05-06',
        did: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        cargo: 'CA 90036',
        phone: '55555555',
        email: 'user@mail.com',
    },
    {
        name: '2016-05-07',
        did: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        cargo: 'CA 90036',
        phone: '55555555',
        email: 'user@mail.com',
    },
]

</script>


<style scoped></style>