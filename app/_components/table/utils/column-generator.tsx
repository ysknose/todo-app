import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Check, ChevronsUpDown, Filter, Settings, X } from 'lucide-react';
import type { TableColumnConfig, TableConfig } from '../types';

export function generateColumns<TData extends Record<string, any>>(
  config: TableConfig<TData>
): ColumnDef<TData>[] {
  const columnHelper = createColumnHelper<TData>();

  return config.columns.map((col) => {
    if (col.cell) {
      return columnHelper.display({
        id: col.id,
        header: ({ column }) => (
          <ColumnHeader
            col={col}
            column={column}
            config={config}
          />
        ),
        cell: col.cell,
        meta: col.meta,
      });
    }

    return columnHelper.accessor(col.accessorKey as any, {
      id: col.id,
      header: ({ column }) => (
        <ColumnHeader
          col={col}
          column={column}
          config={config}
        />
      ),
      cell: ({ getValue }) => (
        <div className={col.meta?.cellClassName || ''}>
          {String(getValue())}
        </div>
      ),
      enableSorting: col.enableSorting,
      meta: col.meta,
    });
  });
}

interface ColumnHeaderProps<TData> {
  col: TableColumnConfig<TData>;
  column: any;
  config: TableConfig<TData>;
}

function ColumnHeader<TData>({ col, column, config }: ColumnHeaderProps<TData>) {
  const showControls = (col.enableSorting !== false && config.enableSorting !== false) ||
                      (col.enableFiltering !== false && config.enableFiltering !== false);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <span className={`font-medium ${col.meta?.headerClassName || ''}`}>
          {col.header}
        </span>
        {showControls && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <Settings className="h-3 w-3" />
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

                {/* ソートセクション */}
                {col.enableSorting !== false && config.enableSorting !== false && (
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">ソート</h4>
                      {column.getIsSorted() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => column.clearSorting()}
                          className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                          クリア
                        </Button>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => column.toggleSorting(false, true)}
                        className={`w-full h-7 justify-start text-xs ${
                          column.getIsSorted() === 'asc'
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <ArrowUp className="h-3 w-3 mr-2" />
                        昇順
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => column.toggleSorting(true, true)}
                        className={`w-full h-7 justify-start text-xs ${
                          column.getIsSorted() === 'desc'
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <ArrowDown className="h-3 w-3 mr-2" />
                        降順
                      </Button>
                    </div>
                  </div>
                )}

                {/* フィルターセクション */}
                {col.enableFiltering !== false && config.enableFiltering !== false && (
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Filter className="h-3 w-3" />
                        フィルター
                      </h4>
                      {column.getFilterValue() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => column.setFilterValue("")}
                          className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                          クリア
                        </Button>
                      )}
                    </div>
                    {col.filterType === 'select' && col.filterOptions ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full h-8 justify-between text-left font-normal"
                          >
                            {column.getFilterValue()
                              ? col.filterOptions.find(opt => opt.value === column.getFilterValue())?.label
                              : "選択してください"
                            }
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="検索..." className="h-8" />
                            <CommandList>
                              <CommandEmpty>見つかりませんでした。</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value=""
                                  onSelect={() => column.setFilterValue("")}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      !column.getFilterValue() ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  全て
                                </CommandItem>
                                {col.filterOptions.map(option => (
                                  <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => column.setFilterValue(option.value)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        column.getFilterValue() === option.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {option.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="relative">
                        <Input
                          placeholder={`${col.header}で検索...`}
                          value={(column.getFilterValue() as string) ?? ""}
                          onChange={(event) => column.setFilterValue(event.target.value)}
                          className="h-8 pr-8"
                        />
                        {column.getFilterValue() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => column.setFilterValue("")}
                            className="absolute right-1 top-1 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
