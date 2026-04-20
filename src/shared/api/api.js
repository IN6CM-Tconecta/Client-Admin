import axios from "axios";
import { useAuthStore } from "../../features/auth/authStore.js";

/*
    api.js: Este archivo contiene la configuración de las instancias de axios 
    para autenticación y administración, así como la lógica para manejar la 
    renovación de tokens de acceso cuando expiran.
*/

//? Que es axios: Es una biblioteca de JavaScript que permite hacer solicitudes HTTP y gestionar las respuestas de manera sencilla.

// Instancia de axios para autenticación
const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Instancia de axios para administración
const axiosAdmin = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Configuración de interceptores para manejar tokens de autenticación
axiosAuth.interceptors.request.use((config) => {
    config._axiosClient = "auth";
    //? useAuthStore es un hook personalizado que se utiliza para acceder al estado de autenticación en la aplicación. Permite obtener el token de autenticación almacenado en el estado y agregarlo a las solicitudes HTTP realizadas con axiosAuth.
    const token = useAuthStore.getState().token;

    //* Si el token existe, se agrega al encabezado de autorización de la solicitud HTTP. Esto permite que el servidor reconozca al usuario autenticado y le otorgue acceso a los recursos protegidos.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Configuración de interceptores para la administración (igual funcionalidad para enviar token)
axiosAdmin.interceptors.request.use((config) => {
    config._axiosClient = "admin";
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Configuración de documentación de axios
let _isRefreshing = false;
let failedQueue = [];

function _processQueue(_error, token = null) {
    failedQueue.forEach(({ resolve, reject }) =>
        _error ? reject(_error) : resolve(token),
    );
    failedQueue = [];
}

const handleRefreshToken = async function (_error) {
    const _original = _error.config;
    if (!_original || _original._retry) {
        // Ya se reintentó o no hay config
        return Promise.reject(_error);
    }
    const status = _error.response?.status;
    const errorCode = _error.response?.data?.error;
    const requestUrl = _original.url || "";
    const isRefreshEndpoint = requestUrl.includes("/auth/refresh");
    const shouldAttemptRefresh =
        !isRefreshEndpoint &&
        // La mayoría de casos es 401 (TokenExpiredError)
        status === 401;

    // Algunos servicios pueden responder 403 con `error: TOKEN_EXPIRED`
    const shouldAttemptRefreshFrom403 =
        !isRefreshEndpoint && status === 403 && errorCode === "TOKEN_EXPIRED";

    const shouldRefresh = shouldAttemptRefresh || shouldAttemptRefreshFrom403;

    if (shouldRefresh) {
        const retryClient =
            _original._axiosClient === "admin" ? axiosAdmin : axiosAuth;
        if (_isRefreshing) {
            // Si ya hay un refresh en curso, encola la petición
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    _original.headers["Authorization"] = "Bearer " + token;
                    return retryClient(_original);
                })
                .catch((err) => Promise.reject(err));
        }
        _original._retry = true;
        _isRefreshing = true;
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
            useAuthStore.getState().logout();
            return Promise.reject(_error);
        }
        try {
            const response = await axiosAuth.post("/auth/refresh", { refreshToken });
            const {
                accessToken,
                refreshToken: newRefreshToken,
                expiresIn,
                userDetails,
            } = response.data;
            useAuthStore.setState({
                token: accessToken,
                refreshToken: newRefreshToken,
                expiresAt: expiresIn,
                user: userDetails || useAuthStore.getState().user,
                isAuthenticated: true,
            });
            _processQueue(null, accessToken);
            _original.headers["Authorization"] = "Bearer " + accessToken;
            return retryClient(_original);
        } catch (err) {
            _processQueue(err, null);
            useAuthStore.getState().logout();
            return Promise.reject(err);
        } finally {
            _isRefreshing = false;
        }
    }
    return Promise.reject(_error);
};

axiosAuth.interceptors.response.use((res) => res, handleRefreshToken);

axiosAdmin.interceptors.response.use((res) => res, handleRefreshToken);

// ================= EXPORT AXIOS =================
export { axiosAuth, axiosAdmin };
export { handleRefreshToken };
