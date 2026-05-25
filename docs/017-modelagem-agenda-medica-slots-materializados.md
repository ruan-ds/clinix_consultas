# ADR 017 – Modelagem de Agenda Médica com Slots Materializados

## Status
Definido

## Contexto
O sistema Clinix precisa gerenciar agendamentos de consultas médicas de forma eficiente, garantindo disponibilidade clara e evitando conflitos de horários.

A equipe optou por uma abordagem de materialização de slots em vez de cálculo dinâmico de disponibilidade, baseada na necessidade de:
- Ter visibilidade clara e pré-definida de slots disponíveis
- Evitar cálculos em tempo de execução
- Permitir bloqueio de horários específicos (férias, manutenção, etc.)
- Facilitar tratamento de cancelamentos com regras específicas

## Decisão

### Estrutura de Dados
- **DoctorScheduleConfig**: Define a configuração de agenda para cada médico (1:1 com Doctor)
  - Inclui: dias da semana, horário inicial, horário final, duração do slot, meses a gerar

- **DoctorScheduleSlot**: Tabela materializada de slots de agenda
  - Gerados a partir da configuração
  - Cada slot possui:
    - `start_datetime` e `end_datetime` (horários específicos)
    - `status` (AVAILABLE, BOOKED, BLOCKED, CANCELED, COMPLETED)
  - Índice composto em `(doctor_id, start_datetime)` para queries eficientes

- **MedicalAppointment**: Registro de consulta agendada
  - Relacionamento 1:1 obrigatório com DoctorScheduleSlot
  - Slot com `unique=True` em appointment garante que um slot possui no máximo uma consulta

### Regras de Negócio Implementadas
1. Um slot = no máximo uma consulta
2. Cancelamento com mais de 48h antes do horário: slot volta para AVAILABLE
3. Cancelamento com menos de 48h antes do horário: slot é CANCELED
4. Slots podem ser bloqueados manualmente (BLOCKED) para impedimento de agendamento

## Consequências

### Positivas
- Visibilidade 100% clara de disponibilidade antes de exibir ao paciente
- Queries otimizadas com índice composto em `(doctor_id, start_datetime)`
- Flexibilidade para bloquear horários (férias, manutenção, etc.)
- Regras de cancelamento claramente implementadas no modelo
- Fácil rastreamento de histórico de slots (COMPLETED, CANCELED, etc.)

### Negativas
- Requer job/cron para gerar slots com antecedência (configurado via `months_ahead`)
- Consumo maior de espaço em banco de dados (N slots por médico)
- Limpeza de slots antigos deve ser implementada

### Operacionais
- Cada médico requer configuração inicial (dias, horários, duração)
- Necessário gerar slots com periodicidade (meses_ahead controla janela de geração)
- Mudanças em horário de médico requerem regeneração de slots futuros

## Rastreabilidade de Código
- `DoctorScheduleConfig`: `backend/app/models/doctor_schedule_config.py`
- `DoctorScheduleSlot`: `backend/app/models/doctor_schedule_slot.py`
- `MedicalAppointment`: `backend/app/models/medical_appointment.py`
