// Transport data (Vehicles, Drivers) — replace with API queries when the backend is ready.

export type VehicleType = 'Bus' | 'Minibus' | 'Van' | 'Car';
export type VehicleStatus = 'Available' | 'In Maintenance' | 'Inactive';
export type DriverStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Vehicle {
  id: string;
  plate: string;
  type: VehicleType;
  model: string;
  capacity: number;
  driver: string;
  route: string;
  insuranceExpiry: string;
  status: VehicleStatus;
}

export interface Driver {
  id: string;
  fullname: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  experience: number;
  route: string;
  vehicle: string;
  status: DriverStatus;
}

export const vehicleTypes: VehicleType[] = ['Bus', 'Minibus', 'Van', 'Car'];
export const vehicleStatuses: VehicleStatus[] = ['Available', 'In Maintenance', 'Inactive'];
export const driverStatuses: DriverStatus[] = ['Active', 'On Leave', 'Inactive'];
export const transportRoutes = [
  'North Route',
  'South Route',
  'East Route',
  'West Route',
  'Downtown Loop',
];

export const vehicleData: Vehicle[] = [
  { id: 'v1', plate: 'SN-2041-DK', type: 'Bus', model: 'Toyota Coaster 2021', capacity: 30, driver: 'Ibrahima Fall', route: 'North Route', insuranceExpiry: '2026-11-30', status: 'Available' },
  { id: 'v2', plate: 'SN-1178-TR', type: 'Bus', model: 'Hyundai County 2020', capacity: 28, driver: 'Mariama Diallo', route: 'South Route', insuranceExpiry: '2026-10-12', status: 'Available' },
  { id: 'v3', plate: 'SN-3390-BL', type: 'Minibus', model: 'Mercedes Sprinter 2019', capacity: 16, driver: 'Oumar Kane', route: 'East Route', insuranceExpiry: '2027-01-22', status: 'Available' },
  { id: 'v4', plate: 'SN-5527-QS', type: 'Van', model: 'Ford Transit 2022', capacity: 12, driver: 'Fatou Ndiaye', route: 'West Route', insuranceExpiry: '2026-12-05', status: 'In Maintenance' },
  { id: 'v5', plate: 'SN-8814-HG', type: 'Bus', model: 'Ashok Leyland 2018', capacity: 32, driver: 'Moussa Ba', route: 'Downtown Loop', insuranceExpiry: '2026-10-28', status: 'Available' },
  { id: 'v6', plate: 'SN-2265-PM', type: 'Minibus', model: 'Toyota Hiace 2021', capacity: 14, driver: 'Aissatou Sow', route: 'North Route', insuranceExpiry: '2027-03-15', status: 'Available' },
  { id: 'v7', plate: 'SN-7043-XZ', type: 'Van', model: 'Renault Trafic 2020', capacity: 10, driver: 'Cheikh Diop', route: 'South Route', insuranceExpiry: '2026-11-08', status: 'Available' },
  { id: 'v8', plate: 'SN-6612-KD', type: 'Car', model: 'Toyota Corolla 2023', capacity: 4, driver: 'Awa Sarr', route: 'East Route', insuranceExpiry: '2027-06-01', status: 'Inactive' },
  { id: 'v9', plate: 'SN-9925-JW', type: 'Bus', model: 'Yutong ZK6122 2019', capacity: 35, driver: 'Abdoulaye Sene', route: 'West Route', insuranceExpiry: '2026-10-19', status: 'Available' },
  { id: 'v10', plate: 'SN-4478-VN', type: 'Minibus', model: 'Nissan Urvan 2020', capacity: 15, driver: 'Khady Niasse', route: 'Downtown Loop', insuranceExpiry: '2026-12-21', status: 'In Maintenance' },
  { id: 'v11', plate: 'SN-3156-AC', type: 'Van', model: 'Peugeot Expert 2022', capacity: 9, driver: 'Samba Camara', route: 'North Route', insuranceExpiry: '2027-02-11', status: 'Available' },
  { id: 'v12', plate: 'SN-5089-LM', type: 'Car', model: 'Kia Rio 2021', capacity: 4, driver: 'Ndeye Gueye', route: 'South Route', insuranceExpiry: '2026-11-02', status: 'Available' },
];

export const driverData: Driver[] = [
  { id: 'd1', fullname: 'Ibrahima Fall', phone: '+221 77 412 88 30', licenseNumber: 'SN-2019-4471', licenseExpiry: '2027-04-18', experience: 9, route: 'North Route', vehicle: 'SN-2041-DK', status: 'Active' },
  { id: 'd2', fullname: 'Mariama Diallo', phone: '+221 76 335 21 09', licenseNumber: 'SN-2018-2210', licenseExpiry: '2026-12-03', experience: 7, route: 'South Route', vehicle: 'SN-1178-TR', status: 'Active' },
  { id: 'd3', fullname: 'Oumar Kane', phone: '+221 78 904 55 12', licenseNumber: 'SN-2020-7783', licenseExpiry: '2028-01-27', experience: 12, route: 'East Route', vehicle: 'SN-3390-BL', status: 'Active' },
  { id: 'd4', fullname: 'Fatou Ndiaye', phone: '+221 77 128 63 47', licenseNumber: 'SN-2021-3390', licenseExpiry: '2027-07-09', experience: 5, route: 'West Route', vehicle: 'SN-5527-QS', status: 'On Leave' },
  { id: 'd5', fullname: 'Moussa Ba', phone: '+221 70 552 14 66', licenseNumber: 'SN-2017-1148', licenseExpiry: '2026-10-30', experience: 8, route: 'Downtown Loop', vehicle: 'SN-8814-HG', status: 'Active' },
  { id: 'd6', fullname: 'Aissatou Sow', phone: '+221 76 841 92 05', licenseNumber: 'SN-2019-6604', licenseExpiry: '2027-09-14', experience: 6, route: 'North Route', vehicle: 'SN-2265-PM', status: 'Active' },
  { id: 'd7', fullname: 'Cheikh Diop', phone: '+221 77 209 74 81', licenseNumber: 'SN-2016-8827', licenseExpiry: '2026-11-21', experience: 11, route: 'South Route', vehicle: 'SN-7043-XZ', status: 'Active' },
  { id: 'd8', fullname: 'Awa Sarr', phone: '+221 78 463 30 17', licenseNumber: 'SN-2022-5512', licenseExpiry: '2029-02-06', experience: 4, route: 'East Route', vehicle: 'SN-6612-KD', status: 'Inactive' },
  { id: 'd9', fullname: 'Abdoulaye Sene', phone: '+221 77 617 45 28', licenseNumber: 'SN-2018-9931', licenseExpiry: '2027-05-23', experience: 10, route: 'West Route', vehicle: 'SN-9925-JW', status: 'Active' },
  { id: 'd10', fullname: 'Khady Niasse', phone: '+221 70 774 86 52', licenseNumber: 'SN-2020-4408', licenseExpiry: '2026-10-15', experience: 3, route: 'Downtown Loop', vehicle: 'SN-4478-VN', status: 'On Leave' },
  { id: 'd11', fullname: 'Samba Camara', phone: '+221 76 250 19 74', licenseNumber: 'SN-2019-7716', licenseExpiry: '2028-03-08', experience: 7, route: 'North Route', vehicle: 'SN-3156-AC', status: 'Active' },
  { id: 'd12', fullname: 'Ndeye Gueye', phone: '+221 77 983 60 21', licenseNumber: 'SN-2021-2205', licenseExpiry: '2027-11-19', experience: 14, route: 'South Route', vehicle: 'SN-5089-LM', status: 'Active' },
];

export const countByStatus = <T extends { status: string }>(rows: T[], status: string): number =>
  rows.filter((row) => row.status === status).length;

export const uniqueCount = <T,>(rows: T[], key: keyof T): number =>
  new Set(rows.map((row) => String(row[key]))).size;
