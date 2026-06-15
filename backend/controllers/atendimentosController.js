const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/atendimentos.json');
let atendimentos = [];

try {
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const parsedData = JSON.parse(rawData);

  atendimentos = parsedData.map((item) => ({
    ...item,
    Valor: item.Status === 'Realizado' || item.Status === 'Concluído'
      ? Math.floor(Math.random() * 500) + 100
      : 0,
  }));
} catch (error) {
  console.error('Erro ao ler a base de dados:', error);
}

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

exports.getAtendimentos = (req, res, next) => {
  try {
    const pageParam = Number.parseInt(req.query.page, 10);
    const limitParam = Number.parseInt(req.query.limit, 10);

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10;

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    let resultados = atendimentos;

    if (search) {
      const termo = normalizeText(search);
      resultados = resultados.filter((item) => {
        const cliente = normalizeText(item['Nome do assistido']);
        const advogado = normalizeText(item['Responsável pelo agendamento']);
        const area = normalizeText(item['Organização'] || item['Serviço']);
        const status = normalizeText(item.Status);

        return cliente.includes(termo)
          || advogado.includes(termo)
          || area.includes(termo)
          || status.includes(termo);
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = resultados.slice(startIndex, endIndex);

    res.status(200).json({
      ok: true,
      total: resultados.length,
      page,
      limit,
      totalPages: Math.ceil(resultados.length / limit),
      data: paginatedResults,
      allFilteredDataForDashboard: resultados,
    });
  } catch (error) {
    error.status = error.status || 500;
    next(error);
  }
};