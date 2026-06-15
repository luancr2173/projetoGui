const express = require('express');
const cors = require('cors');
const atendimentosRoutes = require('./routes/atendimentosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/atendimentos', atendimentosRoutes);

app.use((req, res, next) => {
  const error = new Error('Rota não encontrada.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Erro interno no servidor.';

  res.status(statusCode).json({
    ok: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV !== 'production' && statusCode === 500 ? { stack: err.stack } : {})
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/api/atendimentos`);
  });
}

module.exports = app;