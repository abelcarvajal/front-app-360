// src/config/api.js
import axios from 'axios';

// URL base de API Laravel
// Cámbiarla en producción cuando despliegue (ej: 'https://tuapp.com/api')

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para agregar el token de autenticación a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: maneja 401 globalmente (token inválido o expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Endpoints de la API (solo rutas relativas)
export const ENDPOINTS = {

  // === Autenticación ===
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  AUTH_CAMBIAR_PASSWORD: '/auth/cambiar-password',

  // === Tipos de evaluación ===
  TIPOS_DATOS: '/tipos/datos',

  // === Evaluación ===
  EVALUACION_GUARDAR: '/evaluacion/guardar',
  EVALUACION_DATOS: '/evaluacion/datos',

  // === Detalle de evaluación ===
  DETALLE_GUARDAR: '/detalle/guardar',

  // === Categorías de criterios ===
  CATEGORIAS_DATOS: '/categorias/datos',
  CATEGORIAS_GUARDAR: '/categorias/guardar',
  CATEGORIA_POR_ID: (id) => `/categorias/dataById/${id}`,
  CATEGORIA_ACTUALIZAR: (id) => `/categorias/actualizar/${id}`,
  CATEGORIA_BORRAR: (id) => `/categorias/borrar/${id}`,

  // === Ítems de evaluación (nombre + descripción + 5 niveles cualitativos) ===
  ITEMS_DATOS: '/items/datos',
  ITEMS_GUARDAR: '/items/guardar',
  ITEMS_ACTUALIZAR: (id) => `/items/actualizar/${id}`,
  ITEMS_ESTADO: (id) => `/items/estado/${id}`,

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
}

export default api;