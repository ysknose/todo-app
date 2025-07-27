import { KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import type { SortingState } from '@tanstack/react-table';
import { useCallback } from 'react';

export function useTableDnd(
  sorting: SortingState,
  setSorting: (sorting: SortingState) => void
) {
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

  return {
    sensors,
    handleDragEnd,
  };
}
