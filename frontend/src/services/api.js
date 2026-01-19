import axios from "axios";

const api = axios.create({ baseURL: '/api' });

api.interceptors.response.use(
    r => r,
    async err => {
        if(err.response.status == 401) {
            const refresh = localStorage.getItem('refresh');
            if(!refresh) return location.href = '/';

            try {
                const r = await api.post('/auth/refresh', {refresh});
                localStorage.setItem('access', r.data.access);
                err.config.headers.Authorization = 'Bearer ' + r.data.access;
                return api(err.config);
            } catch {
                localStorage.clear();
                location.href = '/'
            }
        }
        throw err;
    }
)

export default api;