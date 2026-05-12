/**
 * PADRÃO SINGLETON + OBSERVER
 * Gerencia o estado global de busca e notifica os componentes interessados (Mapa, Lista, etc)
 */
class SearchManager {
    constructor() {
        if (SearchManager.instance) {
            return SearchManager.instance;
        }

        this.query = '';
        this.category = 'Todos';
        this.observers = []; // Lista de funções que querem ser notificadas
        
        SearchManager.instance = this;
    }

    // Padrão Observer: Adiciona um interessado
    subscribe(callback) {
        this.observers.push(callback);
    }

    // Notifica todos os observers sobre a mudança
    notify() {
        this.observers.forEach(callback => callback({
            query: this.query,
            category: this.category
        }));
    }

    setSearch(query, category = 'Todos') {
        this.query = query;
        this.category = category;
        this.notify();
    }

    getFilters() {
        return { query: this.query, category: this.category };
    }
}

const instance = new SearchManager();
Object.freeze(instance);
export default instance;
