# ADR 018 – Médicos sem Login Próprio: Integração com ClinicalAccess

## Status
Definido

## Contexto
O sistema Clinix possui três tipos de acesso separados: PatientAccess (pacientes), ClinicalAccess (equipe clínica), e ClinixAccess (equipe interna BPO).

Para médicos, a equipe decidiu não criar um tipo de acesso separado, mas sim integrar o médico como um perfil especializado dentro do modelo de ClinicalAccess. Isso foi necessário porque:
- Médicos precisam de dados específicos (CRM, especialidades)
- Médicos atuam dentro de uma clínica (contexto de ClinicalAccess)
- Permissões de médicos devem derivar do acesso clínico (não de um login próprio)
- Evita duplicação de credenciais (email, senha)

## Decisão

### Estrutura de Relacionamentos
- **ClinicalAccess**: Entidade de acesso da equipe clínica
  - Contém: email, password_hash, role, vínculo com Clinic e Person
  - Possibilita múltiplos acessos para a mesma Person em diferentes Clinics (via unique constraint `(clinic_id, person_id)`)

- **Doctor**: Entidade de dados clínicos
  - FK obrigatória `clinical_access_id` com `unique=True`
  - Relacionamento 1:1 com ClinicalAccess
  - Contém dados clínicos: CRM, is_active
  - NÃO contém credenciais de login

- **Relacionamentos de Doctor**:
  - 1:1 com ClinicalAccess (para obter credenciais e permissões)
  - 1:1 com DoctorScheduleConfig (configuração de agenda)
  - 1:N com DoctorScheduleSlot (slots de agenda)
  - N:M com MedicalSpecialty via DoctorSpecialty
  - 1:N com MedicalAppointment

### Regras de Negócio Implementadas
1. Médico sempre depende de ClinicalAccess para autenticação
2. Um ClinicalAccess com role apropriado pode ter no máximo um Doctor vinculado
3. Permissões de médico derivam do role em ClinicalAccess
4. Médico é sempre vinculado a uma clínica (via ClinicalAccess)

## Consequências

### Positivas
- Redução de duplicação (email/senha gerenciados em ClinicalAccess)
- Alinhamento com modelo de acessos separados (não cria novo tipo)
- Permissões centralizadas via role em ClinicalAccess
- Médico herda status de ativação de ClinicalAccess
- Auditoria simplificada (uma fonte de verdade para credenciais)

### Negativas
- Médicos dependem de ClinicalAccess existir (não há como criar Doctor órfão)
- Requer validação adicional ao desativar ClinicalAccess (cascata para Doctor)
- Não há login direto como "médico" (login é como membro da clínica)

### Operacionais
- Ao criar médico, deve-se criar ClinicalAccess com role apropriado (ex: "MEDICO")
- Desativação de ClinicalAccess deve desativar Doctor associado
- Promotions/demotions dentro da clínica requerem mudança de role em ClinicalAccess, não em Doctor

## Fluxo de Criação
1. Pessoa é registrada em `Person`
2. ClinicalAccess é criada para a Pessoa na Clinic com role="MEDICO"
3. Doctor é criado com FK para ClinicalAccess
4. Dados clínicos (CRM, especialidades) são adicionados a Doctor

## Rastreabilidade de Código
- `Doctor`: `backend/app/models/doctor.py`
- `ClinicalAccess`: `backend/app/models/clinical_access.py`
- `MedicalAppointment`: inclui `clinical_access_id` para rastrear quem registrou a consulta
