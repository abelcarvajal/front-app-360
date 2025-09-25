// src/config/api.js
import axios from 'axios';

// 🔧 URL base de API Laravel
// 👉 Cámbiarla en producción cuando despliegue (ej: 'https://tuapp.com/api')
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 🌐 Cliente HTTP reutilizable
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos de tiempo máximo por petición
  headers: {
    'Content-Type': 'application/json',
    // Si usas autenticación más adelante, puedes añadir tokens aquí
  },
});

// 📍 Endpoints de la API (solo rutas relativas)
export const ENDPOINTS = {
  // === Tipos de evaluación ===
  TIPOS_DATOS: '/tipos/datos',

  // === Evaluación ===
  EVALUACION_GUARDAR: '/evaluacion/guardar',
  EVALUACION_DATOS: '/evaluacion/datos',

  // === Detalle de evaluación ===
  DETALLE_GUARDAR: '/detalle/guardar',

  // === Categorías / Criterios ===
  CATEGORIAS_DATOS: '/categorias/datos',
  CATEGORIAS_GUARDAR: '/categorias/guardar',
  CATEGORIA_POR_ID: (id) => `/categorias/dataById/${id}`,
  CATEGORIA_ACTUALIZAR: (id) => `/categorias/actualizar/${id}`,
  CATEGORIA_BORRAR: '/categorias/borrar',

  // === Colaboradores y datos asociados ===
    TIPODOC_DATOS: '/tipodoc/datos',
    PAIS_DATOS: '/pais/datos',
    DEPARTAMENTO_DATOS: (idPais) => `/departamento/datos/${idPais}`,
    MUNICIPIO_DATOS: (idDepartamento) => `/municipio/datos/${idDepartamento}`,
    MUNICIPIO_RESIDENCIA: '/municipio/datos/2878', // Ciudad fija de residencia
    CARGOS_DATOS: '/cargos/datos',
    CENTRO_COSTO_DATOS: '/centro_costo/datos',
    COLABORADOR_GUARDAR: '/colaborador/guardar',
    COLABORADOR_DATOS: '/colaborador/datos',
    COLABORADOR_DATABYID: (id) => `/colaborador/dataById/${id}`,
    PROGRAMAS_DATOS: '/programa/datos',
    COLABORADOR_ACTUALIZAR: (id) => `/colaborador/actualizar/${id}`,
    COLABORADOR_BORRAR: (id) => `/colaborador/borrar/${id}`,
};