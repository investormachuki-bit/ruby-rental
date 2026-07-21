import { getLease } from "./getLease";

export async function getLeaseById(leaseId: string) {
  return getLease(leaseId);
}
