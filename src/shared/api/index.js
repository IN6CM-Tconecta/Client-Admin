/*
    index.js: Este archivo centraliza todas las exportaciones de la carpeta api. 
    Aquí se exportan las funciones y configuraciones relacionadas con la autenticación,
*/

export * from './auth';
export * from './admin';
export {axiosAuth, axiosAdmin, handleRefreshToken} from './axios';
export * from './api.js';