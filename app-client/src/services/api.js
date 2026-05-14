// Importa a função router para redirecionamento em caso de 401
import { router } from "../app.js";

const API_BASE_URL = "/v1"; // Usar o proxy do Vite

const DEBUG_MODE = import.meta.env.VITE_DEBUG === "true";

if (DEBUG_MODE) {
  console.log("Conectando na API em:", API_BASE_URL);
}

const api = {
  _globalErrorHandler: null, // Para o handler de erro global
  _isRedirecting: false, // Previne loop de redirecionamento

  async request(endpoint, options = {}) {
    try {
      let token = localStorage.getItem("token");
      
      // Saneamento: evita enviar tokens corrompidos ou strings de erro
      if (token === "null" || token === "undefined" || !token) {
        token = null;
      }

      const headers = {
        ...options.headers,
      };

      // Não define Content-Type se for FormData (o browser faz isso automaticamente com o boundary)
      if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: options.signal, // Adiciona suporte a AbortSignal
      });

      // Interceptor de resposta para token expirado (401)
      if (response.status === 401) {
        const path = window.location.pathname;
        const hasUser = !!localStorage.getItem("user");
        const isLoginPage = path.includes("login");
        const isPublicPage = isLoginPage || path.includes("landing") || (path === "/" && !hasUser);
        
        if (!isPublicPage && !api._isRedirecting) {
          api._isRedirecting = true;
          api.auth.logout(); // Limpa o token e o usuário do localStorage
          window.history.pushState({}, "", "/login"); // Redireciona sem a barra final para maior compatibilidade
          if (typeof router === 'function') router(); // Força a re-renderização da rota
          // Pequeno delay para resetar a flag após a mudança de rota
          setTimeout(() => { api._isRedirecting = false; }, 2000);
        }
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!response.ok) {
        const error = await response.json();
        let errorMessage = "Erro na requisição";

        if (error.detail) {
          if (Array.isArray(error.detail)) {
            errorMessage = error.detail
              .map((err) => `${err.loc[1] || "campo"}: ${err.msg}`)
              .join(" | ");
          } else {
            errorMessage =
              typeof error.detail === "string"
                ? error.detail
                : JSON.stringify(error.detail);
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (err) {
      if (DEBUG_MODE) {
        console.error(`Falha na chamada API [${endpoint}]:`, err);
      }
      // Melhora a mensagem para erros de conexão (Servidor Offline)
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        err.message =
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
      }
      if (api._globalErrorHandler) {
        api._globalErrorHandler(err, endpoint);
      }
      throw err;
    }
  },

  auth: {
    async login(email, password) {
      const data = await api.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    },
    async register(userData) {
      return api.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    async deleteAccount() {
      return api.request("/auth/me", {
        method: "DELETE"
      });
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // TODO: Se o backend gerencia refresh tokens ou sessões,
      // considere chamar um endpoint de logout aqui para invalidar o token no servidor.
      // Ex: api.request("/auth/logout", { method: "POST" }).catch(e => console.error("Erro ao fazer logout no backend:", e));
    },
  },

  users: {
    getById: (id) => api.request(`/users/${id}`),
    update: (id, userData) =>
      api.request(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
  },

  media: {
    async upload(bucket, file) { // Removida barra final
      const formData = new FormData();
      formData.append("file", file);
      return api.request(`/media/upload/${bucket}`, {
        method: "POST",
        body: formData,
      });
    },
  },

  ongs: {
    getAll: () => api.request("/ongs"), // Já estava sem barra
    getById: (id) => api.request(`/ongs/${id}`),
    getRequestsWithInterests: (id) =>
      api.request(`/ongs/${id}/requests-with-interests`),
    create: (ongData) =>
      api.request("/ongs", {
        method: "POST",
        body: JSON.stringify(ongData),
      }),
  },

  requests: {
    getAll: () => api.request("/help-requests"),
    getById: (id) => api.request(`/help-requests/${id}`),
    create: (requestData) =>
      api.request("/help-requests", {
        method: "POST",
        body: JSON.stringify(requestData),
      }),
    update: (id, requestData) =>
      api.request(`/help-requests/${id}`, {
        method: "PUT",
        body: JSON.stringify(requestData),
      }),
    delete: (id) => api.request(`/help-requests/${id}`, { method: "DELETE" }),
  },

  interests: {
    create: (
      interestData
    ) =>
      api.request("/interests", {
        method: "POST",
        body: JSON.stringify(interestData),
      }),
    getByUser: (userId) => api.request(`/interests/user/${userId}`),
    getByRequest: (requestId) => api.request(`/interests/request/${requestId}`),
    confirm: (interestId) =>
      api.request(`/interests/confirm/${interestId}`, {
        method: "PUT",
      }),
  },

  notifications: {
    getByUser: (userId) => api.request(`/notifications/${userId}`),
    markAsRead: (
      notificationId, // Sem barra final, conforme backend
    ) =>
      api.request(`/notifications/${notificationId}/read`, {
        method: "PUT",
      }),
  },
};

// Adiciona a função getAddressByCep diretamente ao objeto api
api.getAddressByCep = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error("Erro ao buscar CEP no ViaCEP.");
    }
    const data = await response.json();
    if (data.erro) {
      throw new Error("CEP não encontrado.");
    }
    return data;
  } catch (error) {
    console.error("Erro ao consultar ViaCEP:", error);
    throw error;
  }
};

// Adiciona método para definir um handler de erro global
api.setGlobalErrorHandler = (handler) => {
  api._globalErrorHandler = handler;
};

export default api;
