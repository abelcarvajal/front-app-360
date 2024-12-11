<template>
    <div v-loading="loading"
         element-loading-text="Loading..."
         :element-loading-spinner="$attrs['element-loading-spinner']"
         :element-loading-svg-view-box="$attrs['element-loading-svg-view-box']"
         :element-loading-background="$attrs['element-loading-background']">
        <el-form ref="formRef" :model="form" label-width="auto" style="max-width: 100%">
            <h4>Datos personales</h4>
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="nombres" label="Nombres" :rules="formRules.nombres">
                        <el-input v-model="form.nombres" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="apellidos" label="Apellidos" :rules="formRules.apellidos">
                        <el-input v-model="form.apellidos" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item prop="tipoDocumento" label="Tipo de documento"  :rules="formRules.tipoDocumento">
                        <el-select v-model="form.tipoDocumento" placeholder="Seleccione el tipo de documento">
                            <el-option 
                            v-for="tipo in tipoDocumento" 
                            :key="tipo.id"
                            :label="tipo.tipo_documento" 
                            :value="tipo.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <span></span>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="numeroDocumento" label="Número de documento" :rules="formRules.numeroDocumento">
                        <el-input v-model="form.numeroDocumento" />
                    </el-form-item>

                </el-col>
            </el-row>

            <el-form-item prop="date" label="Fecha de nacimiento" :rules="formRules.date">
                <el-col :span="11">
                    <el-date-picker v-model="form.date" type="date" placeholder="Seleccione la fecha de nacimiento"
                        style="width: 100%" />
                </el-col>
            </el-form-item>

            <el-form-item label="Lugar de nacimiento" :rules="formRules.lugar">
                <el-col :span="7">
                    <el-select 
                    v-model="form.pais" 
                    placeholder="País" 
                    filterable
                    clearable
                    @change="(value) => {
                        emit('update:paisSeleccionado', value);
                        form.departamento = null;
                        form.ciudad = null;
                    }">
                        <el-option 
                        v-for="pais in paises" 
                        :key="pais.id" 
                        :label="pais.nombre_pais" 
                        :value="pais.id" />
                    </el-select>
                </el-col>
                <el-col :span="1">
                    <span></span>
                </el-col>

                <el-col :span="7">
                    <el-select 
                    v-model="form.departamento" 
                    placeholder="Departamento"
                    filterable
                    clearable
                    :disabled="!form.pais"
                    @change="(value) => {
                        emit('update:departamentosSeleccionado', value);
                        form.ciudad = null;
                    }">
                        <el-option 
                        v-for="departamento in departamentos" 
                        :key="departamento.id"
                        :label="departamento.nombre_departamento" 
                        :value="departamento.id" />
                    </el-select>
                </el-col>
                <el-col :span="1">
                    <span></span>
                </el-col>

                <el-col :span="8">
                    <el-select 
                    v-model="form.ciudad" 
                    placeholder="Ciudad"
                    filterable
                    @change="(value) => emit('update:ciudadesSeleccionado', value)">
                        <el-option 
                        v-for="ciudad in ciudades" 
                        :key="ciudad.id"
                        :label="ciudad.nombre_municipio" 
                        :value="ciudad.id" />
                    </el-select>
                </el-col>

            </el-form-item>

            <el-divider />

            <el-row>
                <h3>Datos de contacto</h3>
            </el-row>

        

            <el-row>
                <el-col :span="6">
                    <el-form-item label="Dirección de residencia" prop="lugarResidencia" >
                        <el-select 
                        v-model="form.ciudadResidencia" 
                        placeholder="Ciudad"
                        filterable
                        @change="(value) => emit('update:ciudadResidenciaSeleccionado', value)">
                        <el-option 
                            v-for="ciudad in ciudadResidencia" 
                            :key="ciudad.id"
                            :label="ciudad.nombre_municipio" 
                            :value="ciudad.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="1">
                    <span></span>
                </el-col>
                <el-col :span="12">
                    <el-form-item>
                        <el-input v-model="form.direccion" placeholder="Calle 20 Sur # 10 - 20 Esperanza" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="Teléfono fijo">
                        <el-input v-model="form.telefonoFijo" placeholder="Número fijo" />
                    </el-form-item>
                </el-col>
                <el-col :span="1">
                    <span></span>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="celular" label="Celular" :rules="formRules.celular">
                        <el-input v-model="form.celular" placeholder="Número celular" />
                    </el-form-item>
                </el-col>
                <el-col :span="1">
                    <span></span>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="email" label="Correo Electrónico" :rules="formRules.email"
                        placeholder="correo@midominio.com">
                        <el-input v-model="form.email" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item prop="cargo" label="Cargo" :rules="formRules.cargo">
                        <el-select v-model="form.cargo" placeholder="Seleccione el cargo">
                            <el-option 
                            v-for="cargo in cargos" 
                            :key="cargo.id"
                            :label="cargo.nombre_cargo" 
                            :value="cargo.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="programa" label="Programa" :rules="formRules.programa">
                        <el-select v-model="form.programa" placeholder="Seleccione el programa">
                            <el-option 
                            v-for="programa in programas" 
                            :key="programa.id"
                            :label="programa.nombre_programa" 
                            :value="programa.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="centro_costo" label="Centro de Costo" :rules="formRules.centro_costo">
                        <el-select v-model="form.centro_costo" placeholder="Seleccione el centro de costo">
                            <el-option 
                            v-for="centro_costo in centro_costo" 
                            :key="centro_costo.id"
                            :label="centro_costo.nombre_centro_costo" 
                            :value="centro_costo.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>



        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'

const formRef = ref()

// Inicializar el formulario con valores por defecto
const form = reactive({
    id: '',
    nombres: '',
    apellidos: '',
    tipoDocumento: '',
    numeroDocumento: '',
    date: '',
    pais: '',
    departamento: '',
    ciudad: '',
    ciudadResidencia: '',
    direccion: '',
    telefonoFijo: '',
    celular: '',
    email: '',
    cargo: '',
    programa: '',
    centro_costo: ''
});

const props = defineProps({
    tipoDocumento: {
        type: Array,
        required: true
    },
    paises: {
        type: Array,
        required: true
    },
    departamentos: {
        type: Array,
        required: true,
        default: () => []
    },
    ciudades: {
        type: Array,
        required: true,
        default: () => []
    },
    ciudadResidencia: {
        type: Array,
        required: true,
        default: () => []
    },
    cargos: {
        type: Array,
        required: true,
        default: () => []
    },
    programas: {
        type: Array,
        required: true,
        default: () => []
    },
        centro_costo: {
        type: Array,
        required: true,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'update:paisSeleccionado',
    'update:departamentosSeleccionado',
    'update:ciudadResidenciaSeleccionado',
])

//Reglas de validación del formulario
const formRules = reactive({
    nombres: [
        {
            required: true,
            message: 'Este campo no puede quedar vacío',
            trigger: 'blur'
        }
    ],
    apellidos: [
        {
            required: true,
            message: 'Este campo no puede quedar vacío',
            trigger: 'blur'
        }
    ],
    tipoDocumento: [
        {
            required: true,
            message: 'Elija una opción',
            trigger: ['blur', 'change']
        }
    ],
    numeroDocumento: [
        {
            required: true,
            message: 'Campo obligatorio',
            trigger: 'blur'
        }
    ],
    date: [
        {
            required: true,
            message: 'La fecha de nacimiento es obligatoria',
            trigger: 'change'
        },
        {
            validator: (rule, value, callback) => {
                if (!value) {
                    callback(new Error('La fecha es requerida'));
                    return;
                }
                const fecha = new Date(value);
                if (isNaN(fecha.getTime())) {
                    callback(new Error('Fecha inválida'));
                    return;
                }
                // Validar que la fecha no sea futura
                if (fecha > new Date()) {
                    callback(new Error('La fecha no puede ser futura'));
                    return;
                }
                // Validar edad mínima (por ejemplo, 18 años)
                const edad = new Date().getFullYear() - fecha.getFullYear();
                if (edad < 18) {
                    callback(new Error('La edad mínima es 18 años'));
                    return;
                }
                callback();
            },
            trigger: 'change'
        }
    ],
    lugar: [
        {
            required: true,
            message: 'Debe seleccionar país, departamento y ciudad',
            trigger: ['blur', 'change']
        }
    ],
    lugarResidencia: [
        {
            required: true,
            message: 'Debe seleccionar una ciudad',
            trigger: ['blur', 'change']
        }
    ],
    direccion: [
        {
            required: true,
            message: 'Campo requerido',
            trigger: ['blur']
        }
    ],
    celular: [
        {
            required: true,
            message: 'Campo requerido',
            trigger: ['blur', 'change']
        },
        {
            required: true,
            pattern: /^\d{10}$/,
            message: 'Debe ingresar un número celular válido',
            trigger: ['blur', 'change']
        },

    ],
    cargo: [
        {
            required: true,
            message: 'Campo requerido',
            trigger: ['blur', 'change']
        }
    ],
    programa: [
        {
            required: true,
            message: 'Campo requerido',
            trigger: ['blur', 'change']
        }
    ],
    centroCosto: [
        {
            required: true,
            message: 'Campo requerido',
            trigger: ['blur', 'change']
        }
    ],
    email: [
        {
            required: true,
            message: 'El correo electrónico es obligatorio',
            trigger: 'blur'
        },
        {
            required: true,
            type: 'email',
            message: 'Ingrese un correo electrónico válido',
            trigger: ['blur', 'change']
        },
        {
            required: true,
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            message: 'El formato del correo electrónico no es válido',
            trigger: ['blur', 'change']
        },
        {
            required: true,
            min: 5,
            max: 254,
            message: 'El correo debe tener entre 5 y 254 caracteres',
            trigger: ['blur', 'change']
        },

    ]
})

const ruleFormRef = ref()

const validarForm = async () => {
    if (!formRef.value) return false;
    
    try {
        await formRef.value.validate();
        return true;
    } catch (error) {
        return false;
    }
};

const limpiarFormulario = () => {
    if (ruleFormRef.value) {
        ruleFormRef.value.resetFields();
        // También resetear manualmente el objeto form
        form = {
            id: '',
            nombres: '',
            apellidos: '',
            tipoDocumento: '',
            numeroDocumento: '',
            date: '',
            pais: '',
            departamento: '',
            ciudad: '',
            ciudadResidencia: '',
            direccion: '',
            telefonoFijo: '',
            celular: '',
            email: '',
            cargo: '',
            programa: '',
            centro_costo: ''
        };
    }
};

const setFormData = (data) => {
    Object.keys(data).forEach(key => {
        if (key in form) {
            form[key] = data[key];
        }
    });
};

const resetForm = () => {
    if (ruleFormRef.value) {
        // Resetear el formulario de Element Plus
        ruleFormRef.value.resetFields();
        
        // Resetear todos los campos manualmente
        form.value = {
            nombres: '',
            apellidos: '',
            tipoDocumento: '',
            numeroDocumento: '',
            date: '',
            pais: '',
            departamento: '',
            ciudad: '',
            ciudadResidencia: '',
            direccion: '',
            telefonoFijo: '',
            celular: '',
            email: '',
            cargo: '',
            programa: '',
            centro_costo: ''
        };

        // Emitir eventos para limpiar los selectores en cascada
        emit('update:paisSeleccionado', '');
        emit('update:departamentosSeleccionado', '');
    }
};

// También podríamos necesitar limpiar las opciones de los selectores
const limpiarSelectoresCascada = () => {
    if (props.onPaisChange) {
        props.onPaisChange('');
    }
    if (props.onDepartamentoChange) {
        props.onDepartamentoChange('');
    }
};

defineExpose({
    validarForm,
    setFormData,
    limpiarFormulario,
    resetForm,
    form,
    limpiarSelectoresCascada
});

</script>

<style scoped></style>