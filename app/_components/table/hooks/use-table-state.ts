import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type { TableConfig } from '../types';

export function useTableState<TData extends Record<string, any>>(config: TableConfig<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [groupBy, setGroupBy] = useState<string>('');

  // フィルターされたデータを計算（columnFiltersのみ考慮）
  const filteredData = useMemo(() => {
    return config.data.filter(row => {
      // columnFilters（ヘッダーフィルター）の評価
      return columnFilters.every(filter => {
        const column = config.columns.find(col => col.id === filter.id);
        const cellValue = String(row[filter.id] || '');
        const filterValue = String(filter.value || '');

        // select型フィルターは完全一致
        if (column?.filterType === 'select') {
          return cellValue === filterValue;
        }

        // text型フィルターは部分一致（あいまい検索）
        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [config.data, columnFilters, config.columns]);

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    groupBy,
    setGroupBy,
    filteredData,
  };
}
