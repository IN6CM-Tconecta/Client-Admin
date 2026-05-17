import { axiosAdmin } from "./api";

// Buses
export const getBuses = async (params) => await axiosAdmin.get("/buses", { params });
export const createBus = async (data) => await axiosAdmin.post("/buses", data);
// Estaciones
export const getStations = async (params) => await axiosAdmin.get("/stations", { params });
export const createStation = async (data) => await axiosAdmin.post("/stations", data);
// Rutas
export const getRoutes = async (params) => await axiosAdmin.get("/routes", { params });
export const createRoute = async (data) => await axiosAdmin.post("/routes", data);
// Alertas
export const getAlerts = async () => await axiosAdmin.get("/alerts");
export const createAlert = async (data) => await axiosAdmin.post("/alerts", data);
export const resolveAlert = async (id) => await axiosAdmin.put(`/alerts/${id}/status`, { status: 'RESOLVED' });
// Usuarios
//export const getUsers = async (params) => await axiosAdmin.get("/users", { params });
//export const createUser = async (data) => await axiosAdmin.post("/users", data);