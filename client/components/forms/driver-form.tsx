'use client';

import React from 'react';
import toast from 'react-hot-toast';
import ResourceForm, { NO_SELECTION, ResourceField } from '@/components/forms/resource-form';
import { driverFormSchema, DriverFormType } from '@/lib/zod-schema';
import { driverStatuses, transportRoutes, vehicleData, Driver } from '@/lib/transport-data';
import useIntlTranslations from '@/hooks/use-intl-translations';

interface Props {
  onCreate?: (driver: Driver) => void;
}

export default function DriverForm({ onCreate }: Props) {
  const { g } = useIntlTranslations();

  const fields: ResourceField<DriverFormType>[] = [
    {
      name: 'fullname',
      label: g('Full Name'),
      placeholder: 'Ibrahima Fall',
    },
    {
      name: 'phone',
      label: g('Phone'),
      type: 'tel',
      placeholder: '+221 77 412 88 30',
    },
    {
      name: 'licenseNumber',
      label: g('License Number'),
      placeholder: 'SN-2019-4471',
    },
    {
      name: 'licenseExpiry',
      label: g('License Expiry'),
      type: 'date',
    },
    {
      name: 'experience',
      label: `${g('Experience')} (${g('Years')})`,
      type: 'number',
      placeholder: '8',
    },
    {
      name: 'route',
      label: g('Route'),
      type: 'select',
      options: transportRoutes.map((route) => ({ value: route, label: g(route) })),
    },
    {
      name: 'vehicle',
      label: g('Vehicle'),
      type: 'select',
      options: [
        { value: NO_SELECTION, label: g('Unassigned') },
        ...vehicleData.map((vehicle) => ({ value: vehicle.plate, label: vehicle.plate })),
      ],
    },
    {
      name: 'status',
      label: g('Status'),
      type: 'select',
      options: driverStatuses.map((status) => ({ value: status, label: g(status) })),
    },
  ];

  const handleSubmit = (values: DriverFormType) => {
    const driver: Driver = {
      id: `d-${Date.now()}`,
      fullname: values.fullname.trim(),
      phone: values.phone.trim(),
      licenseNumber: values.licenseNumber.trim(),
      licenseExpiry: values.licenseExpiry,
      experience: Number(values.experience),
      route: values.route,
      vehicle: values.vehicle === NO_SELECTION ? '' : values.vehicle,
      status: values.status,
    };

    onCreate?.(driver);
    toast.success(`${g('Driver')} ${driver.fullname} ${g('created successfully')}`);
  };

  return (
    <ResourceForm<DriverFormType>
      schema={driverFormSchema}
      fields={fields}
      defaultValues={{
        fullname: '',
        phone: '',
        licenseNumber: '',
        licenseExpiry: '',
        experience: '',
        route: transportRoutes[0],
        vehicle: NO_SELECTION,
        status: 'Active',
      }}
      submitLabel={`${g('Add')} ${g('Driver')}`}
      onSubmit={handleSubmit}
    />
  );
}
