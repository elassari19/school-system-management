// Resource data (Library, E-Learning, Inventory) — replace with API queries when the backend is ready.
export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  copies: number;
  available: number;
  shelf: string;
  status: 'Available' | 'Lent' | 'Overdue';
}

export const libraryData: LibraryBook[] = [
  { id: 'b1', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '978-0262033848', copies: 12, available: 8, shelf: 'CS-01', status: 'Available' },
  { id: 'b2', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Physics', isbn: '978-0553380163', copies: 6, available: 0, shelf: 'PH-03', status: 'Lent' },
  { id: 'b3', title: 'Clean Code', author: 'Robert C. Martin', category: 'Computer Science', isbn: '978-0132350884', copies: 10, available: 4, shelf: 'CS-02', status: 'Available' },
  { id: 'b4', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Literature', isbn: '978-0743273565', copies: 15, available: 11, shelf: 'LT-01', status: 'Available' },
  { id: 'b5', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', isbn: '978-0062316097', copies: 8, available: 0, shelf: 'HS-02', status: 'Overdue' },
  { id: 'b6', title: 'Calculus Made Easy', author: 'Silvanus P. Thompson', category: 'Mathematics', isbn: '978-0312185480', copies: 9, available: 5, shelf: 'MA-01', status: 'Available' },
  { id: 'b7', title: 'Cosmos', author: 'Carl Sagan', category: 'Physics', isbn: '978-0345539434', copies: 5, available: 0, shelf: 'PH-01', status: 'Overdue' },
  { id: 'b8', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Literature', isbn: '978-0141439518', copies: 11, available: 7, shelf: 'LT-02', status: 'Available' },
  { id: 'b9', title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Biology', isbn: '978-0198788607', copies: 7, available: 0, shelf: 'BI-01', status: 'Lent' },
  { id: 'b10', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Psychology', isbn: '978-0374533557', copies: 9, available: 6, shelf: 'PS-01', status: 'Available' },
];

export interface ELearningCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  format: 'Video' | 'Digital';
  lessons: number;
  enrolled: number;
  completion: number;
  status: 'Published' | 'Draft' | 'Archived';
}

export const eLearningData: ELearningCourse[] = [
  { id: 'e1', title: 'Algebra Fundamentals', instructor: 'Dr. Amine Bensalem', category: 'Mathematics', format: 'Video', lessons: 24, enrolled: 186, completion: 72, status: 'Published' },
  { id: 'e2', title: 'World History: Modern Era', instructor: 'Marta Reyes', category: 'History', format: 'Digital', lessons: 18, enrolled: 143, completion: 65, status: 'Published' },
  { id: 'e3', title: 'Python for Beginners', instructor: 'Karim Alaoui', category: 'Computer Science', format: 'Video', lessons: 32, enrolled: 251, completion: 81, status: 'Published' },
  { id: 'e4', title: 'Organic Chemistry Lab', instructor: 'Dr. Fatima Zahra', category: 'Chemistry', format: 'Video', lessons: 14, enrolled: 58, completion: 34, status: 'Draft' },
  { id: 'e5', title: 'English Writing Skills', instructor: 'John Peterson', category: 'Languages', format: 'Digital', lessons: 20, enrolled: 172, completion: 69, status: 'Published' },
  { id: 'e6', title: 'Physics: Mechanics', instructor: 'Dr. Youssef Haddad', category: 'Physics', format: 'Video', lessons: 26, enrolled: 97, completion: 48, status: 'Published' },
  { id: 'e7', title: 'Art of the Renaissance', instructor: 'Sofia Marino', category: 'Arts', format: 'Digital', lessons: 12, enrolled: 0, completion: 0, status: 'Archived' },
  { id: 'e8', title: 'Statistics in Practice', instructor: 'Dr. Leila Bennani', category: 'Mathematics', format: 'Video', lessons: 22, enrolled: 84, completion: 55, status: 'Draft' },
];

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  lastChecked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const inventoryData: InventoryItem[] = [
  { id: 'i1', name: 'Notebook A4 (500 pages)', sku: 'STN-0012', category: 'Stationery', quantity: 420, unitPrice: 2.5, supplier: 'OfficePro Supplies', lastChecked: '2026-09-15', status: 'In Stock' },
  { id: 'i2', name: 'Whiteboard Markers (box)', sku: 'STN-0031', category: 'Stationery', quantity: 8, unitPrice: 6.9, supplier: 'OfficePro Supplies', lastChecked: '2026-09-20', status: 'Low Stock' },
  { id: 'i3', name: 'Student Desk Chair', sku: 'FRN-0104', category: 'Furniture', quantity: 0, unitPrice: 45.0, supplier: 'SchoolFit Furniture', lastChecked: '2026-09-10', status: 'Out of Stock' },
  { id: 'i4', name: 'Science Lab Goggles', sku: 'LAB-0207', category: 'Lab Equipment', quantity: 156, unitPrice: 3.2, supplier: 'EduLab Direct', lastChecked: '2026-09-18', status: 'In Stock' },
  { id: 'i5', name: 'Projector Lamp', sku: 'TEC-0301', category: 'Technology', quantity: 4, unitPrice: 120.0, supplier: 'BrightTech', lastChecked: '2026-09-22', status: 'Low Stock' },
  { id: 'i6', name: 'Gym Mats', sku: 'SPT-0415', category: 'Sports', quantity: 35, unitPrice: 18.5, supplier: 'SportLine', lastChecked: '2026-09-12', status: 'In Stock' },
  { id: 'i7', name: 'Printer Toner', sku: 'TEC-0309', category: 'Technology', quantity: 0, unitPrice: 65.0, supplier: 'BrightTech', lastChecked: '2026-09-25', status: 'Out of Stock' },
  { id: 'i8', name: 'Chalk (box of 100)', sku: 'STN-0019', category: 'Stationery', quantity: 74, unitPrice: 4.1, supplier: 'OfficePro Supplies', lastChecked: '2026-09-14', status: 'In Stock' },
];
