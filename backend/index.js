const express = require('express');
const cors = require('cors');
const atendimentosRoutes = require('./routes/atendimentosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Essencial para o Front-end conseguir consumir a API
app.use(express.json());

// Rotas
app.use('/api/atendimentos', atendimentosRoutes);

// Rota de fallback para 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

// Inicialização
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/api/atendimentos`);
});