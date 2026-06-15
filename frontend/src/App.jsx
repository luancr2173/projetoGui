import { useState, useEffect } from 'react';
import api from './services/api';
import Dashboard from './components/Dashboard';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';

function App() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [dadosDashboard, setDadosDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro(null);
      const response = await api.get(`/atendimentos?search=${busca}&limit=100`);
      
      setAtendimentos(response.data.data);
      setDadosDashboard(response.data.allFilteredDataForDashboard);
    } catch (err) {
      setErro('Falha ao carregar os dados. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca]);

  return (
    <Container maxWidth="lg" style={{ marginTop: '40px', marginBottom: '40px' }}>
      <Typography variant="h3" component="h1" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
        Painel Jurídico
      </Typography>
      
      {erro && <Alert severity="error" style={{ marginBottom: '20px' }}>{erro}</Alert>}
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* O componente de Dashboard recebendo todos os dados para calcular as métricas */}
          <Dashboard dados={dadosDashboard} />
          
          {/* Aqui entrará a Tabela e os botões de Exportação no próximo passo */}
        </>
      )}
    </Container>
  );
}

export default App;