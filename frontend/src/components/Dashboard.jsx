import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const mesesDoAno = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const agruparPorMes = (dados) => {
  const acumulado = dados.reduce((acc, item) => {
    const timestamp = Number(item['Data do agendamento']);
    if (!Number.isFinite(timestamp)) return acc;

    const data = new Date(timestamp);
    const mesIndex = data.getMonth();
    const ano = data.getFullYear();
    const chave = `${ano}-${String(mesIndex + 1).padStart(2, '0')}`;

    if (!acc[chave]) {
      acc[chave] = {
        mes: mesesDoAno[mesIndex],
        ano,
        quantidade: 0,
      };
    }

    acc[chave].quantidade += 1;
    return acc;
  }, {});

  return Object.values(acumulado)
    .map((item) => ({
      mes: `${item.mes} ${item.ano}`,
      quantidade: item.quantidade,
    }))
    .sort((a, b) => {
      const [mesA, anoA] = a.mes.split(' ');
      const [mesB, anoB] = b.mes.split(' ');

      return Number(anoA) - Number(anoB) || mesesDoAno.indexOf(mesA) - mesesDoAno.indexOf(mesB);
    });
};

export default function Dashboard({ dados }) {
  if (!dados || dados.length === 0) return null;

  const total = dados.length;
  const concluidos = dados.filter((item) => item.Status === 'Realizado' || item.Status === 'Concluído').length;
  const cancelados = dados.filter((item) => item.Status === 'Cancelado' || item.Status === 'Falta').length;
  const receitaTotal = dados.reduce((acc, curr) => acc + (curr.Valor || 0), 0);

  const statusCount = dados.reduce((acc, curr) => {
    const status = curr.Status || 'Sem Status';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const dadosPizza = Object.keys(statusCount).map((key) => ({
    name: key,
    value: statusCount[key],
  }));

  const CORES = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#7b1fa2'];

  const kpiCards = [
    {
      label: 'Total de Atendimentos',
      value: total,
      color: '#1976d2',
      accent: 'Total',
    },
    {
      label: 'Concluídos',
      value: concluidos,
      color: '#2e7d32',
      accent: 'Concluídos',
    },
    {
      label: 'Cancelados',
      value: cancelados,
      color: '#d32f2f',
      accent: 'Cancelados',
    },
    {
      label: 'Receita Total (Estimada)',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaTotal),
      color: '#7b1fa2',
      accent: 'Receita',
    },
  ];

  const dadosLinha = agruparPorMes(dados);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Visão Geral
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiCards.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                borderRadius: 3,
                borderTop: `4px solid ${item.color}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  <Chip label={item.accent} size="small" sx={{ bgcolor: `${item.color}14`, color: item.color, fontWeight: 600 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: item.color }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

<Grid container spacing={3} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: 380, p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Distribuição por Status
            </Typography>
            <ResponsiveContainer width="100%" height="88%">
              <PieChart>
                <Pie
                  data={dadosPizza}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  labelLine={false}
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: 380, p: 2, borderRadius: 3, width: '40vw' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Evolução Mensal
            </Typography>
            <ResponsiveContainer width="100%" height="88%">
              <LineChart
                data={dadosLinha}
                margin={{ top: 15, right: 30, left: 20, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tickMargin={8} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="quantidade" stroke="#8884d8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}