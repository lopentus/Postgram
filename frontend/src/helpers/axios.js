import axios from "axios";
import { getAccessToken, getRefreshToken, getUser } from "../hooks/user.actions";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const axiosService = axios.create(
    {
        baseURL: "http://localhost:8000/api",
        headers : {
            "Content-Type": "application/json",
        },
    }
);

axiosService.interceptors.request.use(async (config) => {
    /**
     * Retrieving the access token from the localstorage
     * and adding it to the headers of the request
     */
    config.headers.Authorization = `Bearer ${getAccessToken()}`;
    return config;
});

axiosService.interceptors.response.use(
    (res) => Promise.resolve(res),
    (err) => Promise.reject(err),
);

const refreshAuthLogic = async (failedRequest) => {
    return axios.post(
        "/api-auth/refresh/",
        {
            refresh: getRefreshToken(),
        },
        {
            baseURL: "http://localhost:8000",
        }
    ).then(
        (resp) => {
            const { access } = resp.data;
            failedRequest.response.config.headers["Authorization"] = "Bearer " + access;
            localStorage.setItem(
                "auth",
                JSON.stringify(
                    {
                        access,
                        refresh: getRefreshToken(),
                        user: getUser()
                    }
                )
            );
        }
    ).catch(() => {localStorage.removeItem("auth");});
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export function fetcher(url) {
    return axiosService.get(url).then((res) => res.data);
}

export default axiosService;
