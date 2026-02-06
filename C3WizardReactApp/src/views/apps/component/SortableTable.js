import { useState, useMemo } from 'react';

// Custom hook for sortable table functionality
export const useSortableTable = (data) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      // Handle numeric values properly
      if (typeof a[sortConfig.key] === 'number' && typeof b[sortConfig.key] === 'number') {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }

      // Handle string values
      const aValue = (a[sortConfig.key] || '').toString().toLowerCase();
      const bValue = (b[sortConfig.key] || '').toString().toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const getSortIcon = (key, Icon) => {
    if (!Icon) return null;

    if (sortConfig.key !== key) {
      return Icon.ArrowUpDown ? <Icon.ArrowUpDown size={14} /> : null;
    }

    if (sortConfig.direction === 'asc') {
      return Icon.ArrowUp ? <Icon.ArrowUp size={14} /> : null;
    }

    // No need for else after return (fixed eslint warning)
    return Icon.ArrowDown ? <Icon.ArrowDown size={14} /> : null;
  };

  return { sortedData, handleSort, getSortIcon, sortConfig };
};

// Keeping the old component for backward compatibility
const SortableTable = (data) => {
  return useSortableTable(data);
};

export default SortableTable;
