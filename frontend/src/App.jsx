import { useEffect, useMemo, useState } from 'react';
import api from './services/api';
import Dashboard from './components/Dashboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

const formatarData = (timestamp) => {
  if (!timestamp) return '—';

  const data = new Date(Number(timestamp));
  return Number.isNaN(data.getTime())
    ? '—'
    : data.toLocaleDateString('pt-BR');
};

function App() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [dadosDashboard, setDadosDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro(null);

      const response = await api.get('/atendimentos', {
        params: {
          search: busca,
          page: page + 1,
          limit: rowsPerPage,
        },
      });

      setAtendimentos(response.data.data || []);
      setDadosDashboard(response.data.allFilteredDataForDashboard || []);
      setTotalRegistros(response.data.total || 0);
    } catch (err) {
      setErro('Falha ao carregar os dados. Verifique se o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca, page, rowsPerPage]);

  const handleBuscaChange = (event) => {
    setBusca(event.target.value);
    setPage(0);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dadosExportacao = useMemo(() => {
    return dadosDashboard.length > 0 ? dadosDashboard : atendimentos;
  }, [dadosDashboard, atendimentos]);

  const exportarCSV = () => {
    const linhas = [
      ['Cliente', 'Data', 'Hora', 'Advogado', 'Área Jurídica', 'Status'],
      ...dadosExportacao.map((item) => [
        item['Nome do assistido'] || '',
        formatarData(item['Data do agendamento']),
        `${item['Hora início'] || ''} - ${item['Hora fim'] || ''}`,
        item['Responsável pelo agendamento'] || '',
        item['Organização'] || item['Serviço'] || '',
        item.Status || '',
      ]),
    ];

    const csv = '\uFEFF' + linhas
      .map((linha) => linha.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'atendimentos-judiciais.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.text('Relatório de Atendimentos Jurídicos', 14, 16);
    doc.autoTable({
      startY: 24,
      head: [['Cliente', 'Data', 'Hora', 'Advogado', 'Área Jurídica', 'Status']],
      body: dadosExportacao.map((item) => [
        item['Nome do assistido'] || '',
        formatarData(item['Data do agendamento']),
        `${item['Hora início'] || ''} - ${item['Hora fim'] || ''}`,
        item['Responsável pelo agendamento'] || '',
        item['Organização'] || item['Serviço'] || '',
        item.Status || '',
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [25, 118, 210] },
    });

    doc.save('atendimentos-judiciais.pdf');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
        Painel Jurídico
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Dashboard operacional com métricas, gráficos e tabela de agendamentos jurídicos.
      </Typography>

      {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Dashboard dados={dadosDashboard} />

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom>Agendamentos</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pesquise por cliente, advogado ou área jurídica e navegue pelos registros.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="outlined" onClick={exportarCSV}>Exportar CSV</Button>
                <Button variant="contained" onClick={exportarPDF}>Exportar PDF</Button>
              </Stack>
            </Stack>

            <TextField
              fullWidth
              label="Buscar por cliente, advogado ou área jurídica"
              value={busca}
              onChange={handleBuscaChange}
              sx={{ mt: 3, mb: 2 }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Advogado</TableCell>
                    <TableCell>Área Jurídica</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {atendimentos.length > 0 ? (
                    atendimentos.map((item) => (
                      <TableRow key={item['Código do agendamento']} hover>
                        <TableCell>{item['Nome do assistido'] || '—'}</TableCell>
                        <TableCell>{formatarData(item['Data do agendamento'])}</TableCell>
                        <TableCell>{`${item['Hora início'] || ''} - ${item['Hora fim'] || ''}`}</TableCell>
                        <TableCell>{item['Responsável pelo agendamento'] || '—'}</TableCell>
                        <TableCell>{item['Organização'] || item['Serviço'] || '—'}</TableCell>
                        <TableCell>{item.Status || '—'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">Nenhum atendimento encontrado.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalRegistros}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        </>
      )}
    </Container>
  );
}

export default App;