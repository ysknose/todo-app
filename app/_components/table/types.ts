import React from 'react';

// テーブル設定の型定義
export interface TableConfig<TData> {
  columns: TableColumnConfig<TData>[];
  data: TData[];
  onEdit?: (item: TData) => void;
  onDelete?: (item: TData) => void;
  onAdd?: () => void;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableGrouping?: boolean;
  enableMultiSort?: boolean;
  maxMultiSortColCount?: number;
  groupByOptions?: Array<{
    value: string;
    label: string;
  }>;
}

export interface TableColumnConfig<TData> {
  id: string;
  header: string;
  accessorKey?: keyof TData;
  cell?: (props: { row: { original: TData }; getValue: () => any }) => React.ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  filterType?: 'text' | 'select';
  filterOptions?: Array<{
    value: string;
    label: string;
  }>;
  sortingFn?: string;
  meta?: {
    headerClassName?: string;
    cellClassName?: string;
  };
}

export interface DataTableProps<TData> {
  config: TableConfig<TData>;
  className?: string;
}
