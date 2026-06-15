# Painel de Atendimentos Jurídicos

Este projeto implementa um painel interno para consulta, análise e exportação de atendimentos jurídicos com uma API REST baseada em arquivo JSON mock e uma interface React com métricas, gráficos e tabela interativa.

## 1. Visão Geral

- Back-end: Node.js + Express
- Front-end: React + Vite + Material-UI (MUI)
- Visualização: Recharts
- Exportação: jsPDF + jsPDF AutoTable
- Dados: arquivo mock JSON em backend/data/atendimentos.json

## 2. Requisitos

Antes de iniciar, verifique se o ambiente possui:

- Node.js 18+
- npm 9+
- Git

## 3. Como executar o Back-end

1. Entre na pasta do back-end:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```

4. O servidor ficará disponível em:
   ```text
   http://localhost:3000/api/atendimentos
   ```

5. Para iniciar em modo produção:
   ```bash
   npm start
   ```

## 4. Como executar o Front-end

1. Entre na pasta do front-end:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação:
   ```bash
   npm run dev
   ```

4. Abra o endereço exibido pelo Vite, normalmente:
   ```text
   http://localhost:5173
   ```

5. Para gerar a build de produção:
   ```bash
   npm run build
   ```

## 5. Dependências utilizadas e justificativa técnica

### Back-end
- express: framework principal para criação da API REST e rotas.
- cors: permite que o front-end em outra porta/host consuma a API.
- nodemon: facilita o desenvolvimento com reinicialização automática do servidor.

### Front-end
- react e react-dom: base do painel interativo.
- vite: ferramenta rápida de build e desenvolvimento.
- @mui/material: biblioteca de componentes UI pronta, usada para tabela, botões, cards, inputs e layout responsivo.
- axios: cliente HTTP para consumir a API REST de forma simples e confiável.
- recharts: biblioteca de gráficos para KPIs, pizza e linha.
- jspdf e jspdf-autotable: geração de relatórios PDF estruturados com tabela.

## 6. Decisões técnicas tomadas

1. Paginação no servidor
   - A paginação é feita no back-end para evitar carregar a base inteira no navegador e manter a resposta leve.
   - Isso também garante que os filtros e a busca sejam aplicados antes da paginação.

2. Arquivo JSON como fonte principal
   - A aplicação utiliza o arquivo mock atendimentos.json como base de dados, conforme requisito do teste técnico.
   - Isso evita dependência de banco de dados e facilita a execução local.

3. UI modular e responsiva
   - O dashboard foi separado em um componente específico para manter a lógica de métricas e gráficos organizada.
   - A tela principal concentra a tabela, busca e exportação para manter a navegação clara.

4. Tratamento de erros padronizado
   - O back-end agora retorna respostas JSON consistentes com status HTTP apropriados para falhas e rotas inexistentes.

## 7. Funcionalidades principais

- Busca textual em tempo real por cliente, advogado e área jurídica.
- Dashboard com métricas de total, concluídos, cancelados e receita estimada.
- Gráficos de status e evolução mensal.
- Tabela de atendimentos com paginação.
- Exportação em CSV e PDF.

## 8. Limitações conhecidas

- Os dados são baseados em um arquivo JSON estático, portanto não há persistência real em banco de dados.
- A geração de receita é estimada com base nos dados do mock e pode ser ajustada para regras reais de negócio.
- O cálculo mensal usa a data de agendamento convertida a partir de timestamps em milissegundos.

## 9. Melhorias futuras

- Adicionar autenticação e autorização para uso interno.
- Implementar filtros avançados por status, advogado e período.
- Persistir alterações de status e observações no arquivo mock ou em uma API real.
- Melhorar o layout para dashboards com mais métricas e comparativos.
- Adicionar testes automatizados de API e interface.
