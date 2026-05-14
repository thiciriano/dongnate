// app-client/src/services/requestStrategies.js
// Define diferentes formas de buscar e filtrar pedidos de ajuda.

// A interface (conceitual) para as estratégias de busca.
// Em JavaScript, isso é geralmente um contrato implícito.
// class RequestFetchingStrategy {
//     async fetchRequests(apiClient) {
//         throw new Error("fetchRequests method must be implemented by concrete strategies.");
//     }
// }

/**
 * Estratégia para buscar os pedidos mais recentes.
 */
export class LatestRequestsStrategy {
  async fetchRequests(apiClient) {
    // Idealmente, o backend teria um endpoint como /v1/help-requests/latest?limit=3
    // Para demonstração, buscamos todos e filtramos no cliente.
    const allRequests = await apiClient.requests.getAll();
    return allRequests.slice(0, 3); // Retorna os 3 pedidos mais recentes
  }
}

/**
 * Estratégia para buscar os pedidos mais urgentes.
 */
export class UrgentRequestsStrategy {
  async fetchRequests(apiClient) {
    // Idealmente, o backend teria um endpoint como /v1/help-requests/urgent?limit=3
    const allRequests = await apiClient.requests.getAll();
    // Filtra por urgência 'media' ou 'alta' e pega os 3 primeiros.
    // Adapte a lógica de urgência conforme a necessidade do seu backend.
    return allRequests
      .filter((req) => req.urgency === "media" || req.urgency === "alta")
      .slice(0, 3);
  }
}

/**
 * Estratégia para buscar e filtrar pedidos com base em termos de busca e categoria.
 */
export class SearchRequestsStrategy {
  constructor(query = "", category = "Todos") {
    this.query = query.toLowerCase();
    this.category = category;
  }

  async fetchRequests(apiClient) {
    const allRequests = await apiClient.requests.getAll();
    const q = this.query.trim();
    return allRequests.filter((req) => {
      const matchQuery =
        !q ||
        (req.title && req.title.toLowerCase().includes(q)) ||
        (req.description && req.description.toLowerCase().includes(q));
      const matchCat =
        this.category === "Todos" || req.category === this.category;
      return matchQuery && matchCat;
    });
  }
}
