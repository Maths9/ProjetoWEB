## **1\. Cadastro e gerenciamento de clientes**

**RF01 – Cadastro de clientes**

* Cadastrar nome, telefone, e-mail e outras informações relevantes.  
* Identificar se o contato é cliente atual ou potencial cliente.  
* Editar e excluir cadastros.

**RF02 – Histórico do cliente**

* Registrar tratamentos/procedimentos realizados.  
* Consultar histórico de atendimentos.  
* Registrar observações e preferências do cliente.

**RF03 – Busca de clientes**

* Pesquisar clientes por nome, telefone ou e-mail.  
* Filtrar clientes ativos, inativos e potenciais.

## **2\. Agendamento**

Embora a clínica entrevistada já possua uma ferramenta própria para agendamento e tenha informado que **não possui problemas nessa área**, o sistema pode integrar esse módulo para centralizar a gestão.

**RF04 – Gerenciamento de agenda**

* Cadastrar horários disponíveis.  
* Visualizar agenda diária, semanal e mensal.  
* Criar, alterar e cancelar agendamentos.

**RF05 – Integração com atendimento**

* Permitir que o chatbot consulte horários disponíveis.  
* Encaminhar o cliente para o agendamento.

**RF06 – Lembretes**

* Enviar lembrete automático antes do procedimento.  
* Notificar a clínica sobre novos agendamentos.

O próprio documento apresenta como possibilidade um chatbot capaz de marcar horários, verificar a agenda e enviar lembretes.

# **Controle financeiro**

Como atualmente não existe uma ferramenta específica para esse controle, esse seria um dos módulos administrativos importantes.

**RF11 – Registro de receitas**

* Registrar pagamentos recebidos.  
* Associar pagamento ao cliente e procedimento.  
* Registrar forma de pagamento.

**RF12 – Registro de despesas**

* Cadastrar despesas da clínica.  
* Categorizar despesas.  
* Registrar data e valor.

**RF13 – Controle de pagamentos pendentes**

* Identificar pagamentos em aberto.  
* Registrar pagamentos realizados.  
* Exibir valores pendentes.

**RF14 – Relatórios financeiros**

* Exibir receitas e despesas.  
* Calcular lucro/período.  
* Identificar procedimentos mais rentáveis.  
* Gerar relatórios mensais.

Isso também se relaciona à ideia apresentada na entrevista de uma planilha/sistema que mostre automaticamente qual tratamento gerou mais lucro.

---

# **5\. Controle de estoque**

**RF15 – Cadastro de produtos**

* Cadastrar produtos utilizados pela clínica.  
* Informar quantidade disponível.  
* Registrar preço/custo.  
* Definir estoque mínimo.

**RF16 – Movimentação de estoque**

* Registrar entrada de produtos.  
* Registrar saída de produtos.  
* Atualizar automaticamente a quantidade disponível.

**RF17 – Alertas de estoque**

* Identificar produtos abaixo do estoque mínimo.  
* Emitir alerta para reposição.  
* Exibir produtos que precisam ser comprados.

Esse requisito está diretamente relacionado ao cenário apresentado no documento de um sistema que avise quando um produto, como o gel redutor, estiver com estoque baixo.

---

# **6\. Dashboard / Painel administrativo**

**RF18 – Dashboard da clínica**

Ao entrar no sistema, a proprietária ou funcionária poderia visualizar:

* quantidade de clientes;  
* novos clientes;  
* potenciais clientes;  
* agendamentos do dia;  
* faturamento;  
* despesas;  
* lucro;  
* pagamentos pendentes;  
* produtos com estoque baixo;  
* quantidade de atendimentos;  
* taxa de conversão de potenciais clientes em clientes.

Esse painel seria especialmente útil porque permitiria transformar os dados do sistema em informações para tomada de decisão.

---

# **7\. Usuários e permissões**

**RF19 – Cadastro de funcionários**

* Cadastrar funcionários.  
* Definir função/perfil.  
* Ativar ou desativar usuários.

**RF20 – Controle de acesso**

* Administrador/proprietária possui acesso completo.  
* Funcionários possuem acesso apenas aos módulos necessários.  
* Restringir informações financeiras conforme o perfil.

---

# **8\. Relatórios**

**RF21 – Relatórios gerenciais**

O sistema poderia gerar relatórios de:

* faturamento;  
* despesas;  
* lucro;  
* estoque;  
* clientes;  
* novos clientes;  
* clientes recorrentes;  
* procedimentos realizados;  
* conversão de leads;  
* desempenho do atendimento automático.

A ideia de identificar clientes que mais retornam e os tratamentos mais lucrativos já aparece como uma das possibilidades levantadas na entrevista.

---

## **Requisitos não funcionais**

Além dos requisitos funcionais, eu colocaria alguns **RNFs** importantes:

| Código | Requisito | Descrição |
| ----- | ----- | ----- |
| RNF01 | **Segurança** | Proteger os dados dos clientes e funcionários. |
| RNF02 | **Privacidade** | Restringir o acesso às informações conforme o perfil do usuário. |
| RNF03 | **Usabilidade** | Interface simples e intuitiva, considerando que a gestora possui pouca familiaridade com tecnologia. |
| RNF04 | **Disponibilidade** | O sistema deve estar disponível para acesso durante o funcionamento da clínica. |
| RNF05 | **Desempenho** | As páginas e consultas devem carregar rapidamente. |
| RNF06 | **Responsividade** | O sistema deve funcionar adequadamente em computador, tablet e celular. |
| RNF07 | **Escalabilidade** | A arquitetura deve permitir que o sistema seja adaptado para outras clínicas. |
| RNF08 | **Integração** | O sistema deve possibilitar integração com WhatsApp e Instagram. |
| RNF09 | **Confiabilidade** | Os dados financeiros, de estoque, clientes e agendamentos devem ser armazenados de forma consistente. |
| RNF10 | **Manutenibilidade** | O sistema deve permitir futuras alterações e inclusão de novos módulos. |

### **Uma divisão mais enxuta para o projeto**

Se vocês precisarem transformar isso em uma lista de requisitos para um **projeto acadêmico de desenvolvimento web**, eu recomendaria priorizar estes **12 requisitos funcionais**:

1. **RF01 – Cadastro de clientes**  
2. **RF02 – Gerenciamento do histórico de clientes**  
3. **RF03 – Gerenciamento de agendamentos**  
4. **RF04 – Cadastro e gerenciamento de serviços**  
5. **RF05 – Chatbot de atendimento**  
6. **RF06 – Captação e cadastro de potenciais clientes**  
7. **RF07 – Encaminhamento do chatbot para funcionário**  
8. **RF08 – Controle financeiro**  
9. **RF09 – Controle de estoque**  
10. **RF10 – Alertas de estoque e pagamentos**  
11. **RF11 – Dashboard gerencial**  
12. **RF12 – Geração de relatórios**

**Prioridade do sistema:** eu colocaria o **chatbot \+ captação de clientes** como prioridade máxima, porque esse foi o problema mais urgente identificado na entrevista. A própria gestora apontou a automatização do WhatsApp como a principal necessidade, devido à dependência de uma funcionária para fazer a ligação entre a clínica e os novos clientes.

Depois viriam **financeiro e estoque**, que atualmente não possuem nenhuma ferramenta estruturada.

Se esse sistema for virar **UML/Engenharia de Software**, essa lista já pode ser transformada em **atores \+ casos de uso \+ requisitos funcionais e não funcionais**, inclusive separando o que será feito pela **secretária, administradora, cliente e chatbot**.

