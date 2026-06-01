from sqlalchemy.orm import Session
from app.models.medical_appointment import MedicalAppointment

def get_appointment_history_service(db: Session, patient_id: int):
    appointments = (
        db.query(MedicalAppointment)
        .filter(MedicalAppointment.patient_id == patient_id)
        .order_by(MedicalAppointment.created_at.desc())
        .all()
    )

    history = []
    for appt in appointments:
        doctor_name = "Médico não identificado"
        if appt.doctor and appt.doctor.clinical_access and appt.doctor.clinical_access.person:
            doctor_name = appt.doctor.clinical_access.person.name

        clinic_name = appt.clinic.trade_name if appt.clinic else "Clínica não identificada"

        address_str = "Endereço não disponível"
        if appt.clinic and appt.clinic.address:
            addr = appt.clinic.address
            address_str = f"{addr.street}, {addr.number} - {addr.neighborhood}"

        specialty = appt.service.name if appt.service else "Consulta Geral"

        history.append({
            "id": appt.id,
            "doctor_name": doctor_name,
            "clinic_name": clinic_name,
            "address": address_str,
            "status": appt.status,
            "date": appt.created_at,
            "specialty": specialty
        })
    
    return history
