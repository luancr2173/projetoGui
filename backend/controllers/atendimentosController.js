const fs = require('fs');
const path = require('path');

// Carrega os dados na memória ao iniciar o servidor
const dataPath = path.join(__dirname, '../data/atendimentos.json');
let atendimentos = [];

try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    
    atendimentos = parsedData.map(item => ({
        ...item,
        'Valor': item.Status === 'Realizado' || item.Status === 'Concluído' ? Math.floor(Math.random() * 500) + 100 : 0
    }));
} catch (error) {
    console.error('Erro ao ler a base de dados:', error);
}

exports.getAtendimentos = (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        
        let resultados = atendimentos;

        if (search) {
            const termo = search.toLowerCase();
            resultados = resultados.filter(item => {
                const cliente = (item['Nome do assistido'] || '').toLowerCase();
                const advogado = (item['Responsável pelo agendamento'] || '').toLowerCase();
                const servico = (item['Serviço'] || '').toLowerCase();
                
                return cliente.includes(termo) || advogado.includes(termo) || servico.includes(termo);
            });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedResults = resultados.slice(startIndex, endIndex);

        res.status(200).json({
            total: resultados.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(resultados.length / limit),
            data: paginatedResults,
            allFilteredDataForDashboard: resultados 
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor ao buscar atendimentos.' });
    }
};