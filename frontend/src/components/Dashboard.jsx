import { Card, CardContent, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ dados }) {
  if (!dados || dados.length === 0) return null;

  // 1. Cálculo dos KPIs
  const total = dados.length;
  const concluidos = dados.filter(item => item.Status === 'Realizado' || item.Status === 'Concluído').length;
  const cancelados = dados.filter(item => item.Status === 'Cancelado' || item.Status === 'Falta').length;
  const receitaTotal = dados.reduce((acc, curr) => acc + (curr.Valor || 0), 0);

  // 2. Preparação de Dados para o Gráfico de Pizza (Status)
  const statusCount = dados.reduce((acc, curr) => {
    const status = curr.Status || 'Sem Status';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const dadosPizza = Object.keys(statusCount).map(key => ({
    name: key,
    value: statusCount[key]
  }));
  const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // 3. Preparação de Dados para o Gráfico de Linha (Evolução Mensal)
  const mesesCount = dados.reduce((acc, curr) => {
    if (curr['Data do agendamento']) {
      // Extrai o mês e ano (ex: 2026-06) dependendo do formato do seu excel. 
      // Assumindo formato DD/MM/YYYY ou similar, pegamos uma substring
      const dataStr = String(curr['Data do agendamento']); 
      const mes = dataStr.substring(3, 10); // Ajuste fino pode ser necessário dependendo da string exata
      acc[mes] = (acc[mes] || 0) + 1;
    }
    return acc;
  }, {});

  const dadosLinha = Object.keys(mesesCount).map(key => ({
    mes: key,
    quantidade: mesesCount[key]
  })).sort((a, b) => a.mes.localeCompare(b.mes)); // Ordena por data

  return (
    <div style={{ marginBottom: '40px' }}>
      <Typography variant="h5" gutterBottom>Visão Geral</Typography>
      
      {/* Cards de KPI */}
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

      {/* Gráficos */}
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