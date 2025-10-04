export interface Table {
  id: string;
  section_id: string;
  name: string;
  status: number;
  seats: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  accepts_reservations: boolean;
}

export interface Section {
  id: string;
  branch_id: string;
  name: string;
  name_localized: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tables: Table[];
}

export interface ReservationTimes {
  saturday?: string[][];
  sunday?: string[][];
  monday?: string[][];
  tuesday?: string[][];
  wednesday?: string[][];
  thursday?: string[][];
  friday?: string[][];
}

export interface Branch {
  id: string;
  name: string;
  name_localized: string | null;
  reference: string;
  type: number;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  opening_from: string;
  opening_to: string;
  inventory_end_of_day_time: string;
  receipt_header: string | null;
  receipt_footer: string | null;
  settings: any;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  receives_online_orders: boolean;
  accepts_reservations: boolean;
  reservation_duration: number;
  reservation_times: ReservationTimes;
  address: string | null;
  sections?: Section[];
}

export interface BranchesResponse {
  data: Branch[];
}

export interface UpdateBranchPayload {
  accepts_reservations?: boolean;
  reservation_duration?: number;
  reservation_times?: ReservationTimes;
}

export interface TableOption {
  id: string;
  label: string;
  sectionId: string;
}

export type DayOfWeek =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];
