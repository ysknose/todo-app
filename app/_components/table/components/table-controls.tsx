import { Button } from '@/components/ui/button';
import type { ColumnFiltersState, SortingState, Table } from '@tanstack/react-table';
import type { TableConfig } from '../types';
import { FilterMenu } from './filter-menu';
import { SortMenu } from './sort-menu';

interface TableControlsProps<TData> {
  config: TableConfig<TData>;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  table: Table<TData>;
  sensors: any;
  handleDragEnd: (event: any) => void;
}

export function TableControls<TData>({
  config,
  sorting,
  columnFilters,
  setColumnFilters,
  table,
  sensors,
  handleDragEnd,
}: TableControlsProps<TData>) {
  if (!config.enableFiltering && !config.enableSorting && !config.enableGrouping) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        {/* フィルターボタン */}
        {config.enableFiltering && (
          <FilterMenu
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            config={config}
          />
        )}

        {/* ソートボタン */}
        {config.enableSorting && (
          <SortMenu
            sorting={sorting}
            table={table}
            sensors={sensors}
            handleDragEnd={handleDragEnd}
          />
        )}

        {/* 全クリアボタン */}
        {(columnFilters.length > 0 || sorting.length > 0) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setColumnFilters([]);
              table.resetSorting();
            }}
            className="h-7 px-2 text-gray-500 hover:bg-gray-200"
          >
            すべてクリア
          </Button>
        )}
      </div>
    </div>
  );
}
