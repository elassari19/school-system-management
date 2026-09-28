import { ResourceColumn } from '@/components/tables/resource-table';
import { ELearningCourse, InventoryItem, LibraryBook } from './resources-data';

export const libraryColumns: ResourceColumn<LibraryBook>[] = [
  { key: 'title', header: 'Title', className: 'font-medium' },
  { key: 'author', header: 'Author' },
  { key: 'category', header: 'Category' },
  { key: 'isbn', header: 'ISBN' },
  { key: 'copies', header: 'Copies' },
  { key: 'available', header: 'Available', type: 'fraction', totalKey: 'copies' },
  { key: 'shelf', header: 'Shelf' },
  { key: 'status', header: 'Status', type: 'status' },
];

export const librarySearchKeys = ['title', 'author', 'category', 'isbn', 'shelf'] as const;

export const eLearningColumns: ResourceColumn<ELearningCourse>[] = [
  { key: 'title', header: 'Course Title', className: 'font-medium' },
  { key: 'instructor', header: 'Instructor' },
  { key: 'category', header: 'Category' },
  { key: 'format', header: 'Format' },
  { key: 'lessons', header: 'Lessons' },
  { key: 'enrolled', header: 'Enrolled' },
  { key: 'completion', header: 'Completion', type: 'percent' },
  { key: 'status', header: 'Status', type: 'status' },
];

export const eLearningSearchKeys = ['title', 'instructor', 'category', 'format'] as const;

export const inventoryColumns: ResourceColumn<InventoryItem>[] = [
  { key: 'name', header: 'Name', className: 'font-medium' },
  { key: 'sku', header: 'SKU' },
  { key: 'category', header: 'Category' },
  { key: 'quantity', header: 'Quantity' },
  { key: 'unitPrice', header: 'Unit Price', type: 'currency' },
  { key: 'supplier', header: 'Supplier' },
  { key: 'lastChecked', header: 'Last Checked', type: 'date' },
  { key: 'status', header: 'Status', type: 'status' },
];

export const inventorySearchKeys = ['name', 'sku', 'category', 'supplier'] as const;
