'use client';

import React from 'react';
import { Award, CalendarOff, UserCheck, Users } from 'lucide-react';
import ResourceSection from '@/components/template/resource-section';
import OverviewGrid from '@/components/cards/overview-grid';
import DriverForm from '@/components/forms/driver-form';
import { driversColumns, driversSearchKeys } from '@/lib/transport-columns';
import { countByStatus, driverData, Driver } from '@/lib/transport-data';
import useIntlTranslations from '@/hooks/use-intl-translations';

const DriversSection = () => {
  const { g } = useIntlTranslations();

  return (
    <ResourceSection<Driver>
      title={g('Drivers')}
      description={g('Manage the drivers team')}
      data={driverData}
      columns={driversColumns}
      searchKeys={driversSearchKeys}
      searchPlaceholder={`${g('Search')} ${g('Driver')}...`}
      actionTarget="Driver"
      createForm={(onCreate) => <DriverForm onCreate={onCreate} />}
      renderOverview={(rows) => {
        const active = countByStatus(rows, 'Active');
        const onLeave = countByStatus(rows, 'On Leave');
        const assigned = rows.filter((driver) => driver.vehicle).length;
        const totalYears = rows.reduce((total, driver) => total + driver.experience, 0);
        const averageExperience = rows.length ? Math.round(totalYears / rows.length) : 0;

        return (
          <OverviewGrid
            overviewData={[
              {
                icon: Users,
                title: `${g('Total')} ${g('Drivers')}`,
                currentValue: `${rows.length}`,
                pastValue: `${assigned} ${g('Vehicles')}`,
              },
              {
                icon: UserCheck,
                title: g('Active'),
                currentValue: `${active}`,
                pastValue: `${active} / ${rows.length} ${g('Drivers')}`,
              },
              {
                icon: CalendarOff,
                title: g('On Leave'),
                currentValue: `${onLeave}`,
                pastValue: `${onLeave} / ${rows.length} ${g('Drivers')}`,
              },
              {
                icon: Award,
                title: `${g('Average')} ${g('Experience')}`,
                currentValue: `${averageExperience} ${g('Years')}`,
                pastValue: g('per driver'),
              },
            ]}
          />
        );
      }}
    />
  );
};

export default DriversSection;
