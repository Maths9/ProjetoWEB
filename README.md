# ✨ Nexa Clínica — Sistema Integrado de Gestão Clínica & Estética

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791.svg)](https://www.postgresql.org/)
[![Flyway](https://img.shields.io/badge/Flyway-Migrations-red.svg)](https://flywaydb.org/)

O **Nexa Clínica** é uma plataforma web completa desenvolvida para clínicas de estética, dermatologia, fisioterapia dermatofuncional e bem-estar. O sistema centraliza a recepção, a sala de atendimento e a gestão executiva com controle de agendamentos, clientes, financeiro, histórico clínico, inventário e controle de acesso baseado em papéis (**RBAC**).

---

## 🏛️ Arquitetura do Projeto

O projeto foi desenhado com desacoplamento rigoroso entre **Backend (API REST)** e **Frontend (SPA)**:

```text
ProjetoWEB/
├── backend/
│   └── nexa-clinica-api/       # API Spring Boot 3 (Java 21 + Maven)
│       ├── pom.xml
│       └── src/
│           ├── main/
│           │   ├── java/com/nexaclinica/api/
│           │   │   ├── config/         # Configurações de CORS, Segurança e Swagger
│           │   │   ├── controller/     # Controladores REST (/api/v1/...)
│           │   │   ├── dto/            # Records de entrada e saída
│           │   │   ├── entity/         # Entidades JPA e Enums de domínio
│           │   │   ├── repository/     # Interfaces Spring Data JPA
│           │   │   └── service/        # Regras de negócio e transações
│           │   └── resources/
│           │       ├── application.yml # Configuração de Datasource e Flyway
│           │       └── db/migration/   # Versionamento de Banco (V1 a V5)
├── src/                        # SPA React + Tailwind CSS
│   ├── assets/                 # Recursos visuais e logos
│   ├── context/                # Context API (AuthContext com RBAC)
│   ├── pages/                  # Páginas (Dashboard, Clientes, Agenda, etc.)
│   └── main.jsx
├── package.json                # Dependências Node.js
├── tailwind.config.js          # Paleta visual estética (rose/rosa suave)
└── vite.config.js
```

---

## 🚀 Funcionalidades & Módulos

### 1. 📊 Dashboard Executivo & Operacional
- **Métricas em tempo real:** Faturamento do mês recebido, despesas operacionais e lucro líquido.
- **Painel de Pacientes:** Total de cadastros, clientes em tratamento ativo e novas aquisições do mês.
- **Agenda do Dia:** Tabela dinâmica com os atendimentos programados para hoje, horários e status de presença.
- **Alertas de Inventário:** Indicador em tempo real de insumos que atingiram cota mínima de estoque.
- **Tratamentos em Alta:** Ranking dos procedimentos com maior adesão e percentual de sessões.

### 2. 👥 Gestão de Clientes & Prontuário
- **Cadastro Completo:** Nome, telefone/WhatsApp, e-mail, tipo (`ATIVO`, `POTENCIAL`, `INATIVO`) e notas clínicas.
- **Busca em Tempo Real:** Filtro rápido por nome, telefone ou e-mail.
- **Histórico de Atendimentos Integrado:**
  - Visualização de todas as sessões anteriores com valores, datas e observações.
  - Registro de novo atendimento diretamente pelo modal, com cálculo automático e **atualização em cascata do campo `Última Visita`**.
- **Exclusão Segura:** Exclusão com limpeza em cascata de agendamentos, receitas e histórico para garantir integridade referencial no PostgreSQL.

### 3. 📅 Agendamento & Calendário
- **Visualizações Múltiplas:** Alternador intuitivo entre visualização em **Lista Diária**, **Visão Semanal** e **Calendário**.
- **Navegação Temporal:** Seletor de data, botões de anterior/próximo e atalho rápido "Hoje".
- **Fluxo de Atendimento:** Botões de ação rápida para confirmar presença, remarcar/editar, cancelar ou **excluir agendamentos criados por engano**.
- **Selects Dinâmicos:** Associação direta com pacientes e catálogo de procedimentos cadastrados no banco.

### 4. 💰 Módulo Financeiro
- **Visão Tripla:** Abas segmentadas em **Receitas (Pagas)**, **Despesas** e **Contas Pendentes**.
- **Liquidação Instantânea:** Ação "Marcar como Pago" na aba de pendentes com transição imediata para as receitas.
- **Controle por Categoria:** Despesas categorizadas em *Produtos*, *Aluguel*, *Pessoal*, *Equipamentos* e *Outros*.
- **Múltiplos Meios de Pagamento:** Suporte a PIX, Cartão, Dinheiro, Boleto e Transferência Bancária.

### 5. 📦 Controle de Estoque & Insumos
- **Gestão de Produtos:** Cadastro de insumos corporais, faciais e descartáveis com cota mínima e preço de custo.
- **Barra Visual de Nível:** Indicador percentual de volume em relação ao estoque mínimo com badges de status (`OK`, `Atenção`, `Crítico`).
- **Movimentações Auditadas:** Registro de entradas e saídas de produtos com atualização atômica de saldo e bloqueio de saídas superiores ao estoque disponível.
- **Governança de Acesso:** Secretárias operam o estoque em modo de consulta, enquanto administradoras possuem permissão total.

### 6. 🔐 Usuários & Matriz de Permissões (RBAC)
- **Perfis de Acesso:** Separação estrita entre `ADMIN` (Administradora) e `SECRETARIA` (Secretária).
- **Gestão de Membros:** Criação, edição, exclusão e alternância instantânea entre status **Ativo** e **Inativo** (`PATCH /ativar`).
- **Proteção de Conta:** Validação de segurança que impede a administradora logada de excluir sua própria conta por engano.

### 7. 📄 Relatórios & Exportação
- **Performance de Procedimentos:** Sessões acumuladas, tempo médio de sala e faturamento consolidado por protocolo.
- **Exportação Multiformato:**
  - **Exportar CSV:** Gera arquivo compatível com Excel e Google Planilhas.
  - **Exportar PDF:** Gera documento formatado pronto para impressão via `jsPDF` e `html2canvas`.

---

## 🗄️ Modelagem de Dados & Migrations (Flyway)

O banco de dados relacional é gerenciado pelo **Flyway**, garantindo que o esquema seja construído e populado automaticamente:

| Migration | Conteúdo |
|---|---|
| [`V1__create_tables.sql`](file:///C:/Users/devil/OneDrive/Documentos/ProjetoWEB/backend/nexa-clinica-api/src/main/resources/db/migration/V1__create_tables.sql) | DDL de todas as tabelas (`usuarios`, `clientes`, `procedimentos`, `agendamentos`, `receitas`, `despesas`, `produtos`, `movimentacoes_estoque`, `historicos_cliente`) e índices. |
| [`V2__seed_procedimentos.sql`](file:///C:/Users/devil/OneDrive/Documentos/ProjetoWEB/backend/nexa-clinica-api/src/main/resources/db/migration/V2__seed_procedimentos.sql) | Carga inicial dos 8 procedimentos estéticos padrão da clínica. |
| [`V3__seed_produtos.sql`](file:///C:/Users/devil/OneDrive/Documentos/ProjetoWEB/backend/nexa-clinica-api/src/main/resources/db/migration/V3__seed_produtos.sql) | Carga de produtos e insumos com cotas mínimas de inventário. |
| [`V4__seed_clientes_e_historicos.sql`](file:///C:/Users/devil/OneDrive/Documentos/ProjetoWEB/backend/nexa-clinica-api/src/main/resources/db/migration/V4__seed_clientes_e_historicos.sql) | Clientes de demonstração e seus respectivos históricos de atendimento. |
| [`V5__seed_usuarios.sql`](file:///C:/Users/devil/OneDrive/Documentos/ProjetoWEB/backend/nexa-clinica-api/src/main/resources/db/migration/V5__seed_usuarios.sql) | Credenciais iniciais da Administradora e Secretárias. |

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21 (LTS)**
- **Spring Boot 3.3.4**
- **Spring Data JPA & Hibernate 6**
- **Spring Web**
- **Spring Validation**
- **PostgreSQL Driver**
- **Flyway Database Migration**
- **Lombok**
- **SpringDoc OpenAPI 2.6.0 (Swagger UI)**

### Frontend
- **React 18**
- **Vite 6**
- **Tailwind CSS**
- **Lucide React** (Ícones modernos)
- **jsPDF & html2canvas** (Exportação de relatórios em PDF)

---

## ⚡ Como Executar a Aplicação

### Pré-requisitos
- **Java JDK 21** instalado.
- **PostgreSQL 15+** instalado e rodando na porta `5432` com uma base criada chamada `nexa_clinica`.
- **Node.js 18+** e **npm**.

---

### 1. Configurar o Banco de Dados
No PostgreSQL (via pgAdmin ou psql), crie o banco de dados:
```sql
CREATE DATABASE nexa_clinica;
```

Confira as credenciais no arquivo `backend/nexa-clinica-api/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/nexa_clinica
    username: postgres
    password: sua_senha_aqui
```

---

### 2. Executar o Backend (Spring Boot)

#### Pelo IntelliJ IDEA:
1. Abra a pasta `backend/nexa-clinica-api` como um projeto Maven.
2. Execute a classe principal:
   `src/main/java/com/nexaclinica/api/NexaClinicaApplication.java` (botão **Run ▶️**).
3. O Flyway executará as migrations automaticamente.

#### Pelo Terminal:
```bash
cd backend/nexa-clinica-api
mvn spring-boot:run
```

A API estará disponível em: **`http://localhost:8080`**  
Documentação Swagger: **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

---

### 3. Executar o Frontend (React / Vite)

No terminal da raiz do projeto (`ProjetoWEB`):
```bash
# 1. Instalar as dependências (caso não tenha instalado)
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse no navegador: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Credenciais Padrão para Acesso

O banco já vem com contas pré-configuradas para demonstração imediata:

| Perfil | Nome | E-mail | Senha | Nível de Permissão |
|---|---|---|---|---|
| **Administradora** | Clarissa Rocha | `clarissa@clinica.com.br` | `admin123` | Acesso Irrestrito (Financeiro, DRE, Usuários, Exclusões) |
| **Secretária** | Mariana Costa | `mariana@clinica.com.br` | `secretaria123` | Recepção, Agenda, Clientes e Estoque em modo leitura |
| **Secretária** | Camila Silva | `camila@clinica.com.br` | `secretaria123` | Recepção, Agenda e Clientes |

*(A tela de login possui botões de atalho **"Acesso Rápido"** que preenchem as credenciais com um único clique).*

---

## 📄 Licença & Autoria

Desenvolvido para gestão clínica e estética moderna.  
Distribuído sob a licença MIT. Sinta-se livre para customizar e expandir!
