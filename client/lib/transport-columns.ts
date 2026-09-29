import { ResourceColumn } from '@/components/tables/resource-table';
import { Driver, Vehicle } from './transport-data';

export const vehiclesColumns: ResourceColumn<Vehicle>[] = [
  { key: 'plate', header: 'Plate Number', className: 'font-medium' },
  { key: 'type', header: 'Type' },
  { key: 'model', header: 'Model' },
  { key: 'capacity', header: 'Capacity' },
  { key: 'driver', header: 'Driver' },
  { key: 'route', header: 'Route' },
  { key: 'insuranceExpiry', header: 'Insurance Expiry', type: 'date' },
  { key: 'status', header: 'Status', type: 'status' },
];

export const vehiclesSearchKeys = ['plate', 'type', 'model', 'driver', 'route', 'status'] as const;

export const driversColumns: ResourceColumn<Driver>[] = [
  { key: 'fullname', header: 'Full Name', className: 'font-medium' },
  { key: 'phone', header: 'Phone' },
  { key: 'licenseNumber', header: 'License Number' },
  { key: 'licenseExpiry', header: 'License Expiry', type: 'date' },
  { key: 'experience', header: 'Years' },
  { key: 'route', header: 'Route' },
  { key: 'vehicle', header: 'Vehicle' },
  { key: 'status', header: 'Status', type: 'status' },
];

export const driversSearchKeys = [
  'fullname',
  'phone',
  'licenseNumber',
  'route',
  'vehicle',
  'status',
] as const;
