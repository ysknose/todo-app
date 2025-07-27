'use client';

import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDown, ArrowUp, GripVertical, X } from 'lucide-react';

interface SortableItemProps {
  id: string;
  index: number;
  sort: { id: string; desc: boolean };
  onToggleSort: () => void;
  onRemoveSort: () => void;
}

export function SortableItem({
  id,
  index,
  sort,
  onToggleSort,
  onRemoveSort
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getColumnLabel = (columnId: string) => {
    switch (columnId) {
      case 'name': return '名前';
      case 'email': return 'メールアドレス';
      case 'role': return '役割';
      case 'status': return 'ステータス';
      default: return columnId;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-2 bg-white border rounded text-xs ${
        isDragging ? 'shadow-lg border-blue-300' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded flex-shrink-0"
        >
          <GripVertical className="h-3 w-3 text-gray-400" />
        </div>
        <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center font-medium flex-shrink-0">
          {index + 1}
        </span>
        <span className="text-xs font-medium text-gray-700 truncate">
          {getColumnLabel(sort.id)}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {sort.desc ? (
            <ArrowDown className="h-3 w-3 text-gray-500" />
          ) : (
            <ArrowUp className="h-3 w-3 text-gray-500" />
          )}
          <span className="text-xs text-gray-500">
            {sort.desc ? '降順' : '昇順'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleSort}
          className="h-5 w-5 p-0"
          title="ソート順を切り替え"
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemoveSort}
          className="h-5 w-5 p-0 text-red-500"
          title="このソートを削除"
        >
          <X className="h-2 w-2" />
        </Button>
      </div>
    </div>
  );
}
