import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { SortingState, Table } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, X } from 'lucide-react';
import { SortableItem } from '../sortable-item';

interface SortMenuProps {
  sorting: SortingState;
  table: Table<any>;
  sensors: any;
  handleDragEnd: (event: DragEndEvent) => void;
}

export function SortMenu({
  sorting,
  table,
  sensors,
  handleDragEnd,
}: SortMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-7 px-2 ${
            sorting.length > 0
              ? 'text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-700'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ArrowUpDown className="h-3 w-3 mr-1" />
          ソート
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] max-h-96 overflow-y-auto" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">ソート</h4>
            {sorting.length > 1 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ドラッグで順序変更
              </span>
            )}
          </div>

          {sorting.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sorting.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {sorting.map((sort, index) => (
                    <SortableItem
                      key={sort.id}
                      id={sort.id}
                      index={index}
                      sort={sort}
                      onRemoveSort={() => {
                        table.getColumn(sort.id)?.clearSorting();
                      }}
                      onToggleSort={() => {
                        table.getColumn(sort.id)?.toggleSorting();
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              ソートがありません。
              <br />
              <span className="text-xs">
                各列のヘッダーからソートを設定できます。
              </span>
            </div>
          )}

          {sorting.length > 0 && (
            <div className="border-t pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => table.resetSorting()}
                className="w-full h-8 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 justify-start"
              >
                <X className="h-3 w-3 mr-2" />
                全ソートを解除
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
