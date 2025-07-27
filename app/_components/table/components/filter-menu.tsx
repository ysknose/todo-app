import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { ColumnFiltersState } from '@tanstack/react-table';
import { ChevronDown, Filter, Trash2, X } from 'lucide-react';
import type { TableConfig } from '../types';

interface FilterMenuProps<TData> {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  config: TableConfig<TData>;
}

export function FilterMenu<TData>({
  columnFilters,
  setColumnFilters,
  config,
}: FilterMenuProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-7 px-2 ${
            columnFilters.length > 0
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Filter className="h-3 w-3 mr-1" />
          フィルター
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] max-h-96 overflow-y-auto" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">フィルター</h4>
          </div>

          {/* ヘッダーフィルター（columnFilters）の表示 */}
          {columnFilters.length > 0 ? (
            <div className="space-y-2">
              {columnFilters.map((filter) => {
                const column = config.columns.find(col => col.id === filter.id);
                const isSelectFilter = column?.filterType === 'select';
                const displayValue = isSelectFilter && column?.filterOptions
                  ? column.filterOptions.find(opt => opt.value === filter.value)?.label || String(filter.value)
                  : String(filter.value);
                const filterText = isSelectFilter ? 'と一致' : 'を含む';

                return (
                  <div key={`header-${filter.id}`} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{String(column?.header || filter.id)}</span>
                      <span className="text-gray-500">{filterText}</span>
                      <span className="font-medium text-blue-600">{displayValue}</span>
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
              <div className="border-t pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setColumnFilters([])}
                  className="w-full h-8 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 justify-start"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  全フィルターを削除
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              フィルターがありません。
              <br />
              <span className="text-xs">
                各列のヘッダーからフィルターを設定できます。
              </span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
