'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

// 新しいモジュラー構造のimport
import { TableControls } from './components';
import { useTableDnd, useTableState } from './hooks';
import type { DataTableProps } from './types';
import { generateColumns } from './utils';

export function DataTable<TData extends Record<string, any>>({
  config,
  className = ''
}: DataTableProps<TData>) {
  // 状態管理
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    filteredData,
  } = useTableState(config);

  // DnD機能
  const { sensors, handleDragEnd } = useTableDnd(sorting, setSorting);

  // カラム生成
  const columns = useMemo(() => generateColumns(config), [config]);

  // React Table初期化
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

  return (
    <div className={className}>
      {/* コントロールバー */}
      <TableControls
        config={config}
        sorting={sorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        table={table}
        sensors={sensors}
        handleDragEnd={handleDragEnd}
      />

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
            {table.getRowModel().rows?.length ? (
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
