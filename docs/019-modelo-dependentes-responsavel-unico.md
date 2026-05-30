# ADR 019 – Modelo de Dependentes com Responsável Único

## Status
Definido

## Contexto
O sistema Clinix precisa suportar agendamentos para dependentes (filhos, idosos, etc.) de pacientes registrados, mas com regras claras de responsabilidade e acesso.

A equipe decidiu implementar um modelo onde:
- Um dependente pertence a apenas um responsável (simplifica compliance e responsabilidade legal)
- Um responsável pode ter múltiplos dependentes
- Dependentes são registrados como Person + Patient e não começam com um registro em PatientAccess
- Existe separação clara entre dados do dependente e dados de responsabilidade

## Decisão

### Estrutura de Dados
- **Dependent**: Tabela de relacionamento que não herda de Entity/Person
  - FK `dependent_patient_id`: Patient do dependente (quem é dependente)
  - FK `guardian_patient_id`: Patient do responsável (quem cuida)
  - Relacionamento 1:1 entre dependente e seu responsável
  - Unique constraint: `(guardian_patient_id, dependent_patient_id)` previne duplicatas
  - **Não herda de Person porque é apenas um registro de responsabilidade, não uma pessoa em si**

- **Patient**: Herda de Person (via Entity)
  - Contém: is_active
  - Vínculo com Person é via foreign key
  - Relacionamento `dependent_links`: lista de dependentes para os quais é responsável
  - Relacionamento `guardian_links`: lista de responsáveis (sempre 0 ou 1 na prática)
  - Cada Patient pode ser tanto dependente quanto responsável

- **PatientAccess**: Herda de Person (via Entity)
  - Contém: email, password_hash, is_active
  - Vínculo com Person é via foreign key
  - Usado somente para pacientes com acesso ao sistema
  - Dependentes sem acesso não geram PatientAccess inicialmente

  **Nota arquitetural**: Dependentes são registrados como Person + Patient, mesmo quando não têm login. Dependentes sem acesso existem como pacientes para permitir agendamentos e histórico médico. A tabela Dependent relaciona dois registros de Patient, não é uma entidade de autenticação ou dados pessoais em si.

### Regras de Negócio Implementadas
1. Um dependente possui exatamente um responsável
2. Um responsável pode ter zero ou mais dependentes
3. Dependente é sempre um Patient registrado
4. Responsável é sempre um Patient
5. Um Patient pode ser simultaneamente responsável de alguns e dependente de outro

## Consequências

### Positivas
- Responsabilidade clara e unificada por dependente
- Facilita conformidade com leis de guarda e consentimento
- Dependentes possuem registro próprio no Patient, mesmo que não acessem diretamente (ex: bebês agendados sem conta de acesso)
- Histórico de consultas do dependente é separado e rastreável
- Possibilita agendamentos feitos pelo dependente (quando maior) ou pelo responsável
- Credenciais centralizadas no responsável simplificam acesso e gestão

### Negativas
- Mudança de responsável requer atualização no banco (não é automática)
- Se dependente fazer login, pode ser confundido com responsável
- Necessário validar regra de negócio (dependente ≠ responsável de si mesmo)

### Operacionais
- Ao criar agendamento para dependente, deve-se respeitar permissões de responsável
- Cancelamento de agendamento de dependente pode requerir validação de permissão
- Desativação de PatientAccess responsável pode deixar dependentes órfãos

## Fluxo de Criação de Dependente
1. Dependente é registrado como Person + Patient
   - Mesmo que seja um bebê ou incapaz de usar o sistema, o registro em Person/Patient é obrigatório
   - Se o dependente não tiver acesso, não gera email/senha; se o acesso for necessário depois, cria-se `PatientAccess` separado
2. Se dados pessoais (Person) não estão disponíveis inicialmente, podem ser adicionados posteriormente
3. Na tabela Dependent, cria-se FK vinculando Patient do dependente ao Patient do responsável
4. Dados de Person podem ser adicionados quando necessário (ex: quando o dependente completar maioridade ou tiver dados coletados)

## Alternativas Rejeitadas
- **Dependente como sub-tabela de PatientAccess**: Rejeitado porque dependente também precisa de login próprio
- **N:M entre PatientAccess e Dependent**: Rejeitado porque queremos responsabilidade clara (apenas 1)
- **Tabela de "tutelas"**: Rejeitado por complexidade desnecessária para MVP

## Rastreabilidade de Código
- `Dependent`: `backend/app/models/dependent.py`
- `Patient`: `backend/app/models/patient.py`
- `PatientAccess`: `backend/app/models/patient_access.py`
