import axios from "axios";


axios.interceptors.response.use(
    success => {
        return success.data;
    },
    error => {
        console.log(error);
    });

let baseUrl = '';

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${baseUrl}${url}`,
        data: params
    });
};

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${baseUrl}${url}`,
        params: params
    });
};