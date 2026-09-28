import React from 'react';
import { getTranslations } from 'next-intl/server';
import PageTemplate, { OverviewSection } from '@/components/template/page-template';
import ResourceTable from '@/components/tables/resource-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  libraryColumns,
  librarySearchKeys,
  eLearningColumns,
  eLearningSearchKeys,
  inventoryColumns,
  inventorySearchKeys,
} from '@/lib/resources-columns';
import {
  ELearningCourse,
  InventoryItem,
  LibraryBook,
  eLearningData,
  inventoryData,
  libraryData,
} from '@/lib/resources-data';
import { AlertTriangle, BookMarked, Boxes, GraduationCap, Library, PackageX } from 'lucide-react';

export default async function ResourcesPage() {
  const g = await getTranslations('global');

  const totalCopies = libraryData.reduce((acc, book) => acc + book.copies, 0);
  const totalLent = libraryData.reduce((acc, book) => acc + (book.copies - book.available), 0);
  const overdueBooks = libraryData.filter((book) => book.status === 'Overdue').length;

  const totalEnrolled = eLearningData.reduce((acc, course) => acc + course.enrolled, 0);
  const publishedCourses = eLearningData.filter((course) => course.status === 'Published').length;
  const avgCompletion = Math.round(
    eLearningData
      .filter((course) => course.enrolled > 0)
      .reduce((acc, course) => acc + course.completion, 0) /
      Math.max(1, eLearningData.filter((course) => course.enrolled > 0).length)
  );

  const inventoryValue = inventoryData.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const lowStockItems = inventoryData.filter((item) => item.status === 'Low Stock').length;
  const outOfStockItems = inventoryData.filter((item) => item.status === 'Out of Stock').length;

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: Library,
            title: `${g('Total')} ${g('Books')}`,
            currentValue: `${libraryData.length}`,
            pastValue: `${totalCopies} ${g('Copies')} ${g('in catalog')}`,
          },
          {
            icon: BookMarked,
            title: `${g('Total')} ${g('Courses')}`,
            currentValue: `${eLearningData.length}`,
            pastValue: `${totalEnrolled} ${g('active enrollments')}`,
          },
          {
            icon: Boxes,
            title: `${g('Total')} ${g('Items')}`,
            currentValue: `${inventoryData.length}`,
            pastValue: `$${inventoryValue.toLocaleString()} ${g('total inventory value')}`,
          },
          {
            icon: AlertTriangle,
            title: `${g('Low Stock')}`,
            currentValue: `${lowStockItems + outOfStockItems}`,
            pastValue: `${g('below min. stock')}`,
          },
        ]}
      />

      <div className="gradient flex flex-wrap items-center gap-2 px-4 py-3 text-sm">
        <Library className="h-5 w-5 text-secondary" />
        <span className="font-medium">{g('Resources')}</span>
        <Badge variant="secondary">
          {totalLent} {g('Books')} {g('on loan now')}
        </Badge>
        <Badge variant="outline">
          {publishedCourses} / {eLearningData.length} {g('Courses')} {g('Published')}
        </Badge>
        <Badge variant="outline">
          {avgCompletion}% {g('avg. completion')}
        </Badge>
        {outOfStockItems > 0 && (
          <Badge variant="destructive">
            <PackageX className="me-1 h-3.5 w-3.5" />
            {outOfStockItems} {g('Items')} {g('Out of Stock')}
          </Badge>
        )}
        {overdueBooks > 0 && (
          <Badge variant="destructive">
            <AlertTriangle className="me-1 h-3.5 w-3.5" />
            {overdueBooks} {g('Books')} {g('Overdue')}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="library" className="flex flex-col gap-4">
        <TabsList className="self-start">
          <TabsTrigger value="library" className="gap-2">
            <BookMarked className="h-4 w-4" />
            {g('Library')}
            <span className="text-xs text-secondary">{libraryData.length}</span>
          </TabsTrigger>
          <TabsTrigger value="e-learning" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            {g('E-Learning')}
            <span className="text-xs text-secondary">{eLearningData.length}</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Boxes className="h-4 w-4" />
            {g('Inventory')}
            <span className="text-xs text-secondary">{inventoryData.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <ResourceTable<LibraryBook>
            columns={libraryColumns}
            data={libraryData}
            searchKeys={librarySearchKeys}
            searchPlaceholder={`${g('Search')} ${g('Book')}...`}
          />
        </TabsContent>

        <TabsContent value="e-learning">
          <ResourceTable<ELearningCourse>
            columns={eLearningColumns}
            data={eLearningData}
            searchKeys={eLearningSearchKeys}
            searchPlaceholder={`${g('Search')} ${g('Course')}...`}
          />
        </TabsContent>

        <TabsContent value="inventory">
          <ResourceTable<InventoryItem>
            columns={inventoryColumns}
            data={inventoryData}
            searchKeys={inventorySearchKeys}
            searchPlaceholder={`${g('Search')} ${g('Item')}...`}
          />
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
}
