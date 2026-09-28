import React from 'react';
import { getTranslations } from 'next-intl/server';
import PageTemplate, { OverviewSection } from '@/components/template/page-template';
import ResourceTable from '@/components/tables/resource-table';
import { inventoryColumns, inventorySearchKeys } from '@/lib/resources-columns';
import { InventoryItem, inventoryData } from '@/lib/resources-data';
import { AlertTriangle, Boxes, DollarSign, PackageX } from 'lucide-react';

export default async function InventoryPage() {
  const g = await getTranslations('global');

  const totalUnits = inventoryData.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = inventoryData.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const lowStock = inventoryData.filter((item) => item.status === 'Low Stock').length;
  const outOfStock = inventoryData.filter((item) => item.status === 'Out of Stock').length;

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: Boxes,
            title: `${g('Total')} ${g('Items')}`,
            currentValue: `${inventoryData.length}`,
            pastValue: `${totalUnits} ${g('Quantity')}`,
          },
          {
            icon: DollarSign,
            title: `${g('Total')} ${g('Value')}`,
            currentValue: `$${totalValue.toLocaleString()}`,
            pastValue: `${g('total inventory value')}`,
          },
          {
            icon: AlertTriangle,
            title: `${g('Low Stock')}`,
            currentValue: `${lowStock}`,
            pastValue: `${g('below min. stock')}`,
          },
          {
            icon: PackageX,
            title: `${g('Out of Stock')}`,
            currentValue: `${outOfStock}`,
            pastValue: `${g('Items')}`,
          },
        ]}
      />

      <ResourceTable<InventoryItem>
        columns={inventoryColumns}
        data={inventoryData}
        searchKeys={inventorySearchKeys}
        searchPlaceholder={`${g('Search')} ${g('Item')}...`}
      />
    </PageTemplate>
  );
}
