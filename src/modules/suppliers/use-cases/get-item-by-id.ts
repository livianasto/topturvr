import { findItemById } from "../repositories/item.repository";

export async function getItemById(id: string) {
  return findItemById(id);
}
