# Painel de Atendimentos Jurídicos - Full Stack

Aplicação full stack para consulta, análise, busca, paginação e exportação de atendimentos jurídicos, com API REST baseada em JSON mock e interface moderna em React.

## Visão Geral

Este projeto foi desenvolvido para simular um painel interno de atendimento jurídico, reunindo:

- Back-end em Node.js + Express
- Front-end em React + Vite + Material-UI
- Dashboard com KPIs, gráficos e tabela de agendamentos
- Busca com debounce para reduzir requisições excessivas
- Paginação e filtros aplicados no servidor
- Exportação em CSV e PDF

---

## Requisitos

Antes de iniciar, confirme que o ambiente possui:

- Node.js 18+
- npm 9+
- Git

---

## Back-end

### Instalação

1. Entre na pasta do back-end:

   ```bash
   cd backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

### Execução

1. Inicie o servidor:

   ```bash
   npm start
   ```

2. O endpoint principal ficará disponível em:

   ```text
   http://localhost:3000/api/atendimentos
   ```

3. Para desenvolvimento com reinicialização automática:

   ```bash
   npm run dev
   ```

---

## Front-end

### Instalação

1. Entre na pasta do front-end:

   ```bash
   cd frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

### Execução

1. Inicie o servidor de desenvolvimento do Vite:

   ```bash
   npm run dev
   ```

2. Abra a URL exibida pelo terminal, normalmente:

   ```text
   http://localhost:5173
   ```

3. Para gerar a build de produção:

   ```bash
   npm run build
   ```

---

## Dependências Utilizadas e Justificativa Técnica

### Back-end

- express
  - Framework principal para criação da API REST e definição das rotas.

- cors
  - Permite que o front-end, rodando em outra porta, consuma a API com compatibilidade entre ambientes.

### Front-end

- @mui/material
  - Biblioteca de componentes UI utilizada para cards, tabela, botões, inputs e layout responsivo.

- axios
  - Cliente HTTP usado para consumir a API REST com simplicidade e confiabilidade.

- recharts
  - Biblioteca responsável pelos gráficos de distribuição por status e evolução mensal.

- jspdf
  - Geração do arquivo PDF para exportação do relatório.

- jspdf-autotable
  - Criação de tabelas estruturadas no PDF exportado.

---

## Decisões Técnicas Tomadas

### 1. Paginação e filtros no servidor

A paginação e a filtragem de atendimentos foram implementadas no back-end em vez de carregar todos os registros na memória do navegador.

Essa decisão foi adotada porque:

- reduz o volume de dados trafegado para o front-end;
- melhora a performance e o tempo de resposta;
- garante consistência entre os dados da tabela, dos gráficos e dos filtros aplicados;
- mantém o projeto mais preparado para crescer com mais registros.

### 2. Debounce de 500ms na busca

A busca textual foi implementada com debounce de 500 ms para evitar que a aplicação dispare uma chamada à API a cada tecla digitada.

Isso melhora a experiência do usuário porque:

- reduz requisições desnecessárias;
- evita travamentos e lentidão na interface;
- torna a busca mais fluida e profissional.

### 3. Dados estáticos com arquivo JSON mock

Os atendimentos são lidos do arquivo JSON mock localizado em `backend/data/atendimentos.json`, conforme requisito do teste técnico.

Essa abordagem foi escolhida para:

- facilitar a execução local;
- manter o projeto independente de banco de dados;
- permitir demonstração rápida da aplicação.

---

## Limitações Conhecidas

- Os dados são estáticos e vêm de um arquivo JSON mock.
- Não existe persistência real em banco de dados no momento.
- A aplicação ainda não possui autenticação e autorização para uso em ambiente corporativo.

---

## Melhorias Futuras

Algumas melhorias planejadas para evolução do projeto:

- Integrar um banco de dados real, como PostgreSQL ou MySQL.
- Adicionar autenticação com JWT para controle de acesso.
- Implementar filtros avançados por período, status e advogado.
- Criar testes automatizados para front-end e back-end.
- Expandir os relatórios e métricas para análise mais aprofundada dos atendimentos.

---

## Estrutura do Projeto

```text
backend/
  controllers/
  data/
  routes/
  index.js

frontend/
  src/
    components/
    services/
  index.html
```

---

## Observações Finais

Este projeto foi organizado para demonstrar um painel interno funcional, com arquitetura simples, manutenção facilitada e boas práticas de desenvolvimento.
