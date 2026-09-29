'use client';

import React from 'react';
import { Armchair, Bus, CircleCheckBig, Wrench } from 'lucide-react';
import ResourceSection from '@/components/template/resource-section';
import OverviewGrid from '@/components/cards/overview-grid';
import VehicleForm from '@/components/forms/vehicle-form';
import { vehiclesColumns, vehiclesSearchKeys } from '@/lib/transport-columns';
import {
  countByStatus,
  transportRoutes,
  uniqueCount,
  vehicleData,
  Vehicle,
} from '@/lib/transport-data';
import useIntlTranslations from '@/hooks/use-intl-translations';

const VehiclesSection = () => {
  const { g } = useIntlTranslations();

  return (
    <ResourceSection<Vehicle>
      title={g('Vehicles')}
      description={g('Manage the school fleet')}
      data={vehicleData}
      columns={vehiclesColumns}
      searchKeys={vehiclesSearchKeys}
      searchPlaceholder={`${g('Search')} ${g('Vehicle')}...`}
      actionTarget="Vehicle"
      createForm={(onCreate) => <VehicleForm onCreate={onCreate} />}
      renderOverview={(rows) => {
        const available = countByStatus(rows, 'Available');
        const inMaintenance = countByStatus(rows, 'In Maintenance');
        const active = rows.length - countByStatus(rows, 'Inactive');

        return (
          <OverviewGrid
            overviewData={[
              {
                icon: Bus,
                title: `${g('Total')} ${g('Vehicles')}`,
                currentValue: `${rows.length}`,
                pastValue: `${active} ${g('Active')}`,
              },
              {
                icon: CircleCheckBig,
                title: g('Available'),
                currentValue: `${available}`,
                pastValue: `${available} / ${rows.length} ${g('Vehicles')}`,
              },
              {
                icon: Wrench,
                title: g('In Maintenance'),
                currentValue: `${inMaintenance}`,
                pastValue: `${inMaintenance} / ${rows.length} ${g('Vehicles')}`,
              },
              {
                icon: Armchair,
                title: `${g('Total')} ${g('Seats')}`,
                currentValue: `${rows.reduce((total, vehicle) => total + vehicle.capacity, 0)}`,
                pastValue: `${uniqueCount(rows, 'route')} ${g('Routes')}`,
              },
            ]}
          />
        );
      }}
    />
  );
};

export default VehiclesSection;
