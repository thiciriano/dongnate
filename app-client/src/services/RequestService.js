import api from "./api.js";
import { LatestRequestsStrategy } from "./requestStrategies.js";

class RequestService {
  /**
   * @param {object} strategy - Instância de uma RequestFetchingStrategy.
   */
  constructor(strategy = new LatestRequestsStrategy()) {
    this.strategy = strategy;
  }

  /**
   * @param {object} strategy - Instância de uma RequestFetchingStrategy.
   */
  setFetchingStrategy(strategy) {
    this.strategy = strategy;
  }

  /**
   * @returns {Promise<Array>}
   */
  async getRequests() {
    if (!this.strategy) {
      throw new Error("Nenhuma estratégia de busca de pedidos foi definida.");
    }
    return this.strategy.fetchRequests(api);
  }
}

export default RequestService;
