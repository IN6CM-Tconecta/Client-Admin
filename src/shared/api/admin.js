import { axiosAdmin } from "./api";

const cleanParams = (params) => {
    const cleaned = {};
    Object.keys(params || {}).forEach((key) => {
        if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
            cleaned[key] = params[key];
        }
    });
    return cleaned;
};

// ROADS (Rutas)
export const getRoads = async (params = {}) => {
    const { data } = await axiosAdmin.get("/roads", { params: cleanParams(params) });
    return data;
};

export const getAllRoads = async (params = {}) => {
    const { data } = await axiosAdmin.get("/roads/all", { params: cleanParams(params) });
    return data;
};

export const getRoadById = async (id) => {
    const { data } = await axiosAdmin.get(`/roads/${id}`);
    return data;
};

export const createRoad = async (roadData) => {
    const { data } = await axiosAdmin.post("/roads", roadData);
    return data;
};

export const updateRoad = async (id, roadData) => {
    const { data } = await axiosAdmin.put(`/roads/${id}`, roadData);
    return data;
};

export const changeRoadStatus = async (id, status) => {
    const { data } = await axiosAdmin.put(`/roads/${id}/status`, { status });
    return data;
};

// STATIONS (Estaciones)
export const getStations = async (params = {}) => {
    const { data } = await axiosAdmin.get("/stations", { params: cleanParams(params) });
    return data;
};

export const getAllStations = async (params = {}) => {
    const { data } = await axiosAdmin.get("/stations/all", { params: cleanParams(params) });
    return data;
};

export const getStationById = async (id) => {
    const { data } = await axiosAdmin.get(`/stations/${id}`);
    return data;
};

export const createStation = async (stationData) => {
    const { data } = await axiosAdmin.post("/stations", stationData);
    return data;
};

export const updateStation = async (id, stationData) => {
    const { data } = await axiosAdmin.put(`/stations/${id}`, stationData);
    return data;
};

export const changeStationStatus = async (id, status) => {
    const { data } = await axiosAdmin.put(`/stations/${id}/status`, { status });
    return data;
};

// ALERTS (Alertas)
export const getAlerts = async () => {
    const { data } = await axiosAdmin.get("/alerts");
    return data;
};

export const createAlert = async (alertData) => {
    const { data } = await axiosAdmin.post("/alerts", alertData);
    return data;
};

export const resolveAlert = async (id, status = "RESOLVED") => {
    const { data } = await axiosAdmin.put(`/alerts/${id}/status`, { status });
    return data;
};
