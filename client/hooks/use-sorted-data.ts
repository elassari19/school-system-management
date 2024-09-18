import { useState, useMemo } from 'react';

interface DataItem {
  [key: string]: any;
}

type SortOrder = 'asc' | 'desc';

const useSortedData = <T extends DataItem>(
  initialData: T[],
  initialSortKey: keyof T
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [sortKey, setSortKey] = useState<keyof T>(initialSortKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedData = useMemo(() => {
    const sortedArray = [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedArray;
  }, [data, sortKey, sortOrder]);

  const handleSort = (key: keyof T) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return {
    sortedData,
    sortKey,
    sortOrder,
    handleSort,
    setData,
  };
};

export default useSortedData;
