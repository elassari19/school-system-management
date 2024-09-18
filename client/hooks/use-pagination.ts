import { useState } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  getPageItems: <T>(items: T[]) => T[];
}

const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const setPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };
  // This function retrieves the items for the current page
  const getPageItems = <T>(items: T[]): T[] => {
    // Calculate the starting index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    // Calculate the ending index for the current page
    const endIndex = startIndex + itemsPerPage;
    // Return a slice of the items array from startIndex to endIndex
    // This effectively returns only the items for the current page
    return items.slice(startIndex, endIndex);
  };

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    setPage,
    getPageItems,
  };
};

export default usePagination;
