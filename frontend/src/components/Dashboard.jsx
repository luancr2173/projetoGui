import { Card, CardContent, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const dadosLinha = agruparPorMes(dados);

  return (
    <div style={{ marginBottom: '40px' }}>
      <Typography variant="h5" gutterBottom>Visão Geral</Typography>

      <Grid container spacing={3} style={{ marginBottom: '30px' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}><CardContent>
            <Typography color="textSecondary" gutterBottom>Total de Atendimentos</Typography>
            <Typography variant="h4">{total}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}><CardContent>
            <Typography color="textSecondary" gutterBottom>Concluídos</Typography>
            <Typography variant="h4" color="success.main">{concluidos}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}><CardContent>
            <Typography color="textSecondary" gutterBottom>Cancelados</Typography>
            <Typography variant="h4" color="error.main">{cancelados}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}><CardContent>
            <Typography color="textSecondary" gutterBottom>Receita Total (Estimada)</Typography>
            <Typography variant="h4" color="primary.main">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaTotal)}
            </Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} style={{ height: '350px', padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Distribuição por Status</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={dadosPizza} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} style={{ height: '350px', padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Evolução Mensal</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={dadosLinha}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="quantidade" stroke="#8884d8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}