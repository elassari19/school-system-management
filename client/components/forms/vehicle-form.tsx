'use client';

import React from 'react';
import toast from 'react-hot-toast';
import ResourceForm, { NO_SELECTION, ResourceField } from '@/components/forms/resource-form';
import { vehicleFormSchema, VehicleFormType } from '@/lib/zod-schema';
import {
  driverData,
  transportRoutes,
  vehicleStatuses,
  vehicleTypes,
  Vehicle,
} from '@/lib/transport-data';
import useIntlTranslations from '@/hooks/use-intl-translations';

interface Props {
  onCreate?: (vehicle: Vehicle) => void;
}

export default function VehicleForm({ onCreate }: Props) {
  const { g } = useIntlTranslations();

  const fields: ResourceField<VehicleFormType>[] = [
    {
      name: 'plate',
      label: g('Plate Number'),
      placeholder: 'SN-2041-DK',
    },
    {
      name: 'type',
      label: g('Type'),
      type: 'select',
      options: vehicleTypes.map((type) => ({ value: type, label: g(type) })),
    },
    {
      name: 'model',
      label: g('Model'),
      placeholder: 'Toyota Coaster 2021',
    },
    {
      name: 'capacity',
      label: g('Capacity'),
      type: 'number',
      placeholder: '30',
    },
    {
      name: 'driver',
      label: g('Driver'),
      type: 'select',
      options: [
        { value: NO_SELECTION, label: g('Unassigned') },
        ...driverData.map((driver) => ({ value: driver.fullname, label: driver.fullname })),
      ],
    },
    {
      name: 'route',
      label: g('Route'),
      type: 'select',
      options: transportRoutes.map((route) => ({ value: route, label: g(route) })),
    },
    {
      name: 'insuranceExpiry',
      label: g('Insurance Expiry'),
      type: 'date',
    },
    {
      name: 'status',
      label: g('Status'),
      type: 'select',
      options: vehicleStatuses.map((status) => ({ value: status, label: g(status) })),
    },
  ];

  const handleSubmit = (values: VehicleFormType) => {
    const vehicle: Vehicle = {
      id: `v-${Date.now()}`,
      plate: values.plate.trim(),
      type: values.type,
      model: values.model.trim(),
      capacity: Number(values.capacity),
      driver: values.driver === NO_SELECTION ? '' : values.driver,
      route: values.route,
      insuranceExpiry: values.insuranceExpiry,
      status: values.status,
    };

    onCreate?.(vehicle);
    toast.success(`${g('Vehicle')} ${vehicle.plate} ${g('created successfully')}`);
  };

  return (
    <ResourceForm<VehicleFormType>
      schema={vehicleFormSchema}
      fields={fields}
      defaultValues={{
        plate: '',
        type: 'Bus',
        model: '',
        capacity: '',
        driver: NO_SELECTION,
        route: transportRoutes[0],
        insuranceExpiry: '',
        status: 'Available',
      }}
      submitLabel={`${g('Add')} ${g('Vehicle')}`}
      onSubmit={handleSubmit}
    />
  );
}
