import { findReservationById } from "../repositories/reservation.repository";

export async function getReservationUseCase(id: string) {
  return findReservationById(id);
}
