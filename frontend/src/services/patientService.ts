import { api } from "./api";

export type FeedValidation = {
  patient: {
    id: number;
    person_id: number;
    email: string;
    is_active: boolean;
    person_name: string;
  };
  has_upcoming_appointments: boolean;
  next_appointment: object | null;
};

export async function validateFeed(): Promise<FeedValidation> {
  const response = await api.get("/patient/feed/validate");
  return response.data;
}