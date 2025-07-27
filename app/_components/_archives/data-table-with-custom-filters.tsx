'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronDown, Edit, Filter, Group, Plus, Trash2, X } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { FilterConditionRow, type FilterCondition, type FilterGroup } from '.';

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

/**
 * カスタムフィルター機能付きDataTableコンポーネント（アーカイブ版）
 *
 * このファイルは、高度なフィルタリング機能（カスタムフィルター、グループフィルター）を
 * 含む完全版のDataTableコンポーネントです。
 *
 * 機能:
 * - ヘッダーフィルター（columnFilters）
 * - カスタムフィルター（customFilters）
 * - グループフィルター（filterGroups）
 * - ドラッグ&ドロップソート
 * - 複数ソート
 * - グループ化表示
 */
export function DataTableWithCustomFilters<TData extends Record<string, any>>({
  config,
  className = ''
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [groupBy, setGroupBy] = useState<string>('');
  const [customFilters, setCustomFilters] = useState<FilterCondition[]>([]);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: 'group-1',
      conditions: [],
      logicalOperator: 'AND'
    }
  ]);

  // dnd-kitのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // ドラッグ終了時の処理
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sorting.findIndex(sort => sort.id === active.id);
      const newIndex = sorting.findIndex(sort => sort.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const moveArrayItem = <T,>(array: T[], fromIndex: number, toIndex: number): T[] => {
          const result = [...array];
          const [removed] = result.splice(fromIndex, 1);
          result.splice(toIndex, 0, removed);
          return result;
        };

        const newSorting = moveArrayItem(sorting, oldIndex, newIndex);
        setSorting(newSorting);
      }
    }
  }, [sorting, setSorting]);

  // フィルター更新のコールバック関数
  const updateFilter = useCallback((id: string, updatedFilter: FilterCondition) => {
    setCustomFilters(prev => prev.map(f => f.id === id ? updatedFilter : f));
  }, []);

  const deleteFilter = useCallback((id: string) => {
    setCustomFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  const duplicateFilter = useCallback((id: string) => {
    const filterToDuplicate = customFilters.find(f => f.id === id);
    if (filterToDuplicate) {
      const newFilter: FilterCondition = {
        ...filterToDuplicate,
        id: `filter-${Date.now()}`,
      };
      setCustomFilters(prev => [...prev, newFilter]);
    }
  }, [customFilters]);

  // カラム定義の生成
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<TData>();

    const generatedColumns: ColumnDef<TData>[] = config.columns.map((col) => {
      if (col.cell) {
        return columnHelper.display({
          id: col.id,
          header: ({ column }) => (
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${col.meta?.headerClassName || ''}`}>
                  {col.header}
                </span>
                {col.enableSorting !== false && config.enableSorting !== false && (
                  <div className="flex flex-col ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 hover:bg-gray-100"
                      onClick={() => column.toggleSorting(false)}
                    >
                      <ArrowUp className="h-2 w-2" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 hover:bg-gray-100"
                      onClick={() => column.toggleSorting(true)}
                    >
                      <ArrowDown className="h-2 w-2" />
                    </Button>
                  </div>
                )}
              </div>

              {col.enableFiltering !== false && config.enableFiltering !== false && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 absolute top-0 right-0 text-gray-400 hover:text-gray-600"
                    >
                      <Filter className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64" align="start">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{col.header}</h4>
                        {column.getFilterValue() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => column.setFilterValue("")}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      {col.enableFiltering !== false && config.enableFiltering !== false && (
                        <div className="border-t pt-3">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Filter className="h-3 w-3" />
                            フィルター
                          </h4>
                          {col.filterType === 'select' && col.filterOptions ? (
                            <Select
                              value={(column.getFilterValue() as string) ?? ""}
                              onValueChange={(value) => column.setFilterValue(value === "all" ? "" : value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">全て</SelectItem>
                                {col.filterOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              placeholder={`${col.header}で検索...`}
                              value={(column.getFilterValue() as string) ?? ""}
                              onChange={(event) => column.setFilterValue(event.target.value)}
                              className="h-8"
                            />
                          )}
                        </div>
                      )}

                      <div className="border-t pt-3">
                        <h4 className="font-medium text-sm mb-2">ソート</h4>
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => column.toggleSorting(false)}
                            className="w-full h-7 justify-start text-xs"
                          >
                            <ArrowUp className="h-3 w-3 mr-2" />
                            昇順
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => column.toggleSorting(true)}
                            className="w-full h-7 justify-start text-xs"
                          >
                            <ArrowDown className="h-3 w-3 mr-2" />
                            降順
                          </Button>
                          {column.getIsSorted() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => column.clearSorting()}
                              className="w-full h-7 justify-start text-xs"
                            >
                              <X className="h-3 w-3 mr-2" />
                              ソートを解除
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ),
          cell: col.cell,
          meta: col.meta,
        });
      }

      return columnHelper.accessor(col.accessorKey as any, {
        id: col.id,
        header: ({ column }) => (
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className={`font-medium ${col.meta?.headerClassName || ''}`}>
                {col.header}
              </span>
              {col.enableSorting !== false && config.enableSorting !== false && (
                <div className="flex flex-col ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-gray-100"
                    onClick={() => column.toggleSorting(false)}
                  >
                    <ArrowUp className="h-2 w-2" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-gray-100"
                    onClick={() => column.toggleSorting(true)}
                  >
                    <ArrowDown className="h-2 w-2" />
                  </Button>
                </div>
              )}
            </div>

            {col.enableFiltering !== false && config.enableFiltering !== false && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 absolute top-0 right-0 text-gray-400 hover:text-gray-600"
                  >
                    <Filter className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{col.header}</h4>
                      {column.getFilterValue() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => column.setFilterValue("")}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {col.enableFiltering !== false && config.enableFiltering !== false && (
                      <div className="border-t pt-3">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Filter className="h-3 w-3" />
                          フィルター
                        </h4>
                        {col.filterType === 'select' && col.filterOptions ? (
                          <Select
                            value={(column.getFilterValue() as string) ?? ""}
                            onValueChange={(value) => column.setFilterValue(value === "all" ? "" : value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">全て</SelectItem>
                              {col.filterOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            placeholder={`${col.header}で検索...`}
                            value={(column.getFilterValue() as string) ?? ""}
                            onChange={(event) => column.setFilterValue(event.target.value)}
                            className="h-8"
                          />
                        )}
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <h4 className="font-medium text-sm mb-2">ソート</h4>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => column.toggleSorting(false)}
                          className="w-full h-7 justify-start text-xs"
                        >
                          <ArrowUp className="h-3 w-3 mr-2" />
                          昇順
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => column.toggleSorting(true)}
                          className="w-full h-7 justify-start text-xs"
                        >
                          <ArrowDown className="h-3 w-3 mr-2" />
                          降順
                        </Button>
                        {column.getIsSorted() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => column.clearSorting()}
                            className="w-full h-7 justify-start text-xs"
                          >
                            <X className="h-3 w-3 mr-2" />
                            ソートを解除
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ),
        cell: ({ getValue }) => (
          <div className={col.meta?.cellClassName || ''}>
            {getValue()}
          </div>
        ),
        enableSorting: col.enableSorting,
        sortingFn: col.sortingFn as any,
        meta: col.meta,
      });
    });

    return generatedColumns;
  }, [config]);

  // フィルターされたデータを計算（columnFiltersとcustomFiltersの両方を考慮）
  const filteredData = useMemo(() => {
    return config.data.filter(row => {
      // columnFilters（ヘッダーフィルター）の評価
      const columnFiltersPass = columnFilters.every(filter => {
        const cellValue = String(row[filter.id] || '').toLowerCase();
        const filterValue = String(filter.value || '').toLowerCase();
        return cellValue.includes(filterValue);
      });

      // customFilters（メニューフィルター）の評価
      const customFiltersPass = customFilters.every(filter => {
        const cellValue = String(row[filter.columnId] || '').toLowerCase();
        const filterValue = filter.value.toLowerCase();

        switch (filter.operator) {
          case 'contains':
            return cellValue.includes(filterValue);
          case 'equals':
            return cellValue === filterValue;
          case 'not_equals':
            return cellValue !== filterValue;
          case 'starts_with':
            return cellValue.startsWith(filterValue);
          case 'ends_with':
            return cellValue.endsWith(filterValue);
          case 'not_contains':
            return !cellValue.includes(filterValue);
          case 'is_empty':
            return cellValue === '';
          case 'is_not_empty':
            return cellValue !== '';
          default:
            return true;
        }
      });

      // グループフィルターの評価
      const groupFiltersPass = filterGroups.every(group => {
        if (group.conditions.length === 0) return true;

        return group.conditions.every(filter => {
          const cellValue = String(row[filter.columnId] || '').toLowerCase();
          const filterValue = filter.value.toLowerCase();

          switch (filter.operator) {
            case 'contains':
              return cellValue.includes(filterValue);
            case 'equals':
              return cellValue === filterValue;
            case 'not_equals':
              return cellValue !== filterValue;
            case 'starts_with':
              return cellValue.startsWith(filterValue);
            case 'ends_with':
              return cellValue.endsWith(filterValue);
            case 'not_contains':
              return !cellValue.includes(filterValue);
            case 'is_empty':
              return cellValue === '';
            case 'is_not_empty':
              return cellValue !== '';
            default:
              return true;
          }
        });
      });

      return columnFiltersPass && customFiltersPass && groupFiltersPass;
    });
  }, [config.data, columnFilters, customFilters, filterGroups]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    enableMultiSort: config.enableMultiSort ?? true,
    maxMultiSortColCount: config.maxMultiSortColCount ?? 4,
    isMultiSortEvent: () => true,
    state: {
      sorting,
      columnFilters,
    },
  });

  // グループ化されたデータを取得する関数
  const getGroupedData = () => {
    if (!groupBy) return null;

    const data = table.getRowModel().rows;
    const grouped = data.reduce((acc, row) => {
      const groupValue = String(row.original[groupBy] || '');
      const groupOption = config.groupByOptions?.find(opt => opt.value === groupValue);
      const groupLabel = groupOption?.label || groupValue || '未分類';

      if (!acc[groupLabel]) {
        acc[groupLabel] = [];
      }
      acc[groupLabel].push(row);
      return acc;
    }, {} as Record<string, typeof data>);

    return grouped;
  };

  return (
    <div className={className}>
      {/* Notionスタイルのフィルター・ソートバー */}
      {(config.enableFiltering || config.enableSorting || config.enableGrouping) && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* フィルターボタン */}
            {config.enableFiltering && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-2 ${
                      customFilters.length > 0 || columnFilters.length > 0
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    フィルター
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] max-h-96 overflow-y-auto" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">フィルター</h4>
                    </div>

                    {/* ヘッダーフィルター（columnFilters）の表示 */}
                    {columnFilters.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          ヘッダーフィルター
                        </h5>
                        {columnFilters.map((filter) => {
                          const column = config.columns.find(col => col.id === filter.id);
                          return (
                            <div key={`header-${filter.id}`} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{String(column?.header || filter.id)}</span>
                                <span className="text-gray-500">を含む</span>
                                <span className="font-medium text-blue-600">{String(filter.value)}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setColumnFilters(prev => prev.filter(f => f.id !== filter.id));
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* カスタムフィルター */}
                    <div className="space-y-1">
                      {customFilters.length > 0 && (
                        <h5 className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          カスタムフィルター
                        </h5>
                      )}
                      {customFilters.map((filter, index) => (
                        <FilterConditionRow
                          key={filter.id}
                          filter={filter}
                          index={index}
                          onUpdate={(updatedFilter) => updateFilter(filter.id, updatedFilter)}
                          onDelete={() => deleteFilter(filter.id)}
                          onDuplicate={() => duplicateFilter(filter.id)}
                        />
                      ))}
                    </div>

                    {customFilters.length === 0 && columnFilters.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        フィルタールールがありません
                      </div>
                    )}

                    <div className="border-t pt-3 space-y-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFilter: FilterCondition = {
                            id: `filter-${Date.now()}`,
                            columnId: config.columns[0]?.id || '',
                            operator: 'contains',
                            value: '',
                            logicalOperator: 'AND'
                          };
                          setCustomFilters([...customFilters, newFilter]);
                        }}
                        className="w-full h-8 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 justify-start"
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        フィルタールールを追加
                      </Button>

                      {(customFilters.length > 0 || columnFilters.length > 0) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCustomFilters([]);
                            setColumnFilters([]);
                          }}
                          className="w-full h-8 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 justify-start"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          全フィルターを削除
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* 残りの実装... */}
          </div>
        </div>
      )}

      {/* テーブル本体 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="relative">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                {/* 操作列 */}
                {(config.onEdit || config.onDelete) && (
                  <TableHead className="w-24">操作</TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {groupBy ? (
              // グループ化された表示
              Object.entries(getGroupedData() || {}).map(([groupName, rows]) => (
                <React.Fragment key={groupName}>
                  <TableRow className="bg-gray-50">
                    <TableCell
                      colSpan={table.getHeaderGroups()[0]?.headers.length + (config.onEdit || config.onDelete ? 1 : 0)}
                      className="font-medium text-gray-700 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <Group className="h-4 w-4" />
                        {groupName} ({rows.length}件)
                      </div>
                    </TableCell>
                  </TableRow>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                      {/* 操作セル */}
                      {(config.onEdit || config.onDelete) && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {config.onEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => config.onEdit?.(row.original)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {config.onDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => config.onDelete?.(row.original)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : table.getRowModel().rows?.length ? (
              // 通常の表示
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {/* 操作セル */}
                  {(config.onEdit || config.onDelete) && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {config.onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => config.onEdit?.(row.original)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {config.onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => config.onDelete?.(row.original)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getHeaderGroups()[0]?.headers.length + (config.onEdit || config.onDelete ? 1 : 0)}
                  className="h-24 text-center"
                >
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 追加ボタン */}
      {config.onAdd && (
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={config.onAdd}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-2" />
            追加
          </Button>
        </div>
      )}
    </div>
  );
}
