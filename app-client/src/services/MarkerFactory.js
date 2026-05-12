/**
 * PADRÃO FACTORY (FABRIC)
 * Gera marcadores profissionais para o mapa com base nos dados reais do banco
 */
export class MarkerFactory {
    static createMarker(type, data) {
        const popupStyles = `
            font-family: 'DM Sans', sans-serif;
            min-width: 220px;
            padding: 10px;
        `;

        if (type === 'ONG') {
            return {
                id: data.id,
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude),
                color: '#1A6B3C', // DN_Green
                popupHtml: `
                    <div style="${popupStyles}">
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                             <div style="width: 10px; height: 10px; background: #1A6B3C; border-radius: 50%; border: 2px solid #E8F5EE;"></div>
                             <p style="color: #1A6B3C; font-weight: 800; font-size: 10px; text-transform: uppercase; margin: 0; letter-spacing: 1px;">ONG Parceira</p>
                        </div>
                        <h4 style="font-weight: 900; color: #0D361E; margin: 0 0 6px 0; font-size: 18px; line-height: 1.2;">${data.organization_name}</h4>
                        <p style="font-size: 12px; color: #4B5563; margin-bottom: 12px; line-height: 1.5; font-style: italic;">
                            ${data.description ? data.description.substring(0, 100) + '...' : 'Transformando realidades através da doação.'}
                        </p>
                        <div style="border-top: 1px solid #E8F5EE; padding-top: 10px; display: flex; align-items: center; gap: 6px;">
                            <svg xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px; color: #D97706;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span style="font-size: 11px; color: #1A6B3C; font-weight: 700; text-transform: uppercase;">${data.city || 'Cidade Confirmada'}</span>
                        </div>
                    </div>
                `
            };
        }

        if (type === 'REQUEST') {
            const isCritical = data.urgency === 'alta' || data.urgency === 'urgente';
            const urgencyColor = isCritical ? '#DC2626' : '#D97706';
            const urgencyLabel = isCritical ? 'CRÍTICO' : 'URGENTE';
            
            return {
                id: data.id,
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude),
                color: urgencyColor,
                popupHtml: `
                    <div style="${popupStyles}">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="background: #E8F5EE; color: #1A6B3C; font-size: 9px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">${data.category}</span>
                            <span style="color: ${urgencyColor}; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">${urgencyLabel}</span>
                        </div>
                        <h4 style="font-weight: 900; color: #0D361E; margin-bottom: 6px; font-size: 16px; line-height: 1.3;">${data.title}</h4>
                        <p style="font-size: 12px; color: #4B5563; margin-bottom: 16px; line-height: 1.4;">${data.description.substring(0, 70)}...</p>
                        <a href="/request-detail/${data.id}" data-link style="display: block; text-align: center; background: ${urgencyColor}; color: white; padding: 12px; border-radius: 14px; font-weight: 800; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px ${urgencyColor}44;">AJUDAR AGORA</a>
                    </div>
                `
            };
        }
    }
}
