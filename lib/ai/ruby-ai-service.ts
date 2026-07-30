export interface RubyAISummary {

  greeting: string;

  landlordName: string;

  totalProperties: number;

  totalUnits: number;

  occupiedUnits: number;

  vacantUnits: number;

  occupancyRate: number;

  activeLeases: number;

  outstandingRent: number;

  collectedThisMonth: number;

  invoicesDueToday: number;

  overdueInvoices: number;

  pendingMaintenance: number;

  pendingNotifications: number;

  expiringLeases: number;

  summary: string[];

}
