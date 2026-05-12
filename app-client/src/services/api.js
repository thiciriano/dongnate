const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/v1';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            ...options.headers,
        };

        // Não define Content-Type se for FormData (o browser faz isso automaticamente com o boundary)
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const error = await response.json();
                let errorMessage = 'Erro na requisição';
                
                if (error.detail) {
                    if (Array.isArray(error.detail)) {
                        errorMessage = error.detail.map(err => `${err.loc[1] || 'campo'}: ${err.msg}`).join(' | ');
                    } else {
                        errorMessage = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
                    }
                }
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (err) {
            console.error(`Falha na chamada API [${endpoint}]:`, err);
            throw err;
        }
    },

    auth: {
        async login(email, password) {
            const data = await api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        },
        async register(userData) {
            return api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
        },
        async deleteAccount(userId) {
            return api.request(`/auth/me?user_id=${userId}`, {
                method: 'DELETE'
            });
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    users: {
        getById: (id) => api.request(`/users/${id}`),
        update: (id, userData) => api.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        })
    },

    media: {
        async upload(bucket, file) {
            const formData = new FormData();
            formData.append('file', file);
            return api.request(`/media/upload/${bucket}`, {
                method: 'POST',
                body: formData
            });
        }
    },

    ongs: {
        getAll: () => api.request('/ongs'),
        getById: (id) => api.request(`/ongs/${id}`),
        getRequestsWithInterests: (id) => api.request(`/ongs/${id}/requests-with-interests`),
        create: (ongData) => api.request('/ongs', {
            method: 'POST',
            body: JSON.stringify(ongData),
        })
    },

    requests: {
        getAll: () => api.request('/help-requests'),
        getById: (id) => api.request(`/help-requests/${id}`),
        create: (requestData) => api.request('/help-requests', {
            method: 'POST',
            body: JSON.stringify(requestData),
        }),
        update: (id, requestData) => api.request(`/help-requests/${id}`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
        }),
        delete: (id) => api.request(`/help-requests/${id}`, { method: 'DELETE' })
    },

    interests: {
        create: (interestData) => api.request('/interests', {
            method: 'POST',
            body: JSON.stringify(interestData),
        }),
        getByUser: (userId) => api.request(`/interests/user/${userId}`),
        getByRequest: (requestId) => api.request(`/interests/request/${requestId}`),
        confirm: (interestId) => api.request(`/interests/confirm/${interestId}`, {
            method: 'PUT'
        })
    },

    notifications: {
        getByUser: (userId) => api.request(`/notifications/${userId}`),
        markAsRead: (notificationId) => api.request(`/notifications/${notificationId}/read`, {
            method: 'PUT'
        })
    }
};

export default api;
