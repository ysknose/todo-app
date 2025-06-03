'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface Item {
  id: string;
  content: string;
}

interface SortableItemProps {
  id: string;
  content: string;
}

function SortableItem({ id, content }: SortableItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{content}</span>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function DndDemoPage() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', content: 'タスク 1: プロジェクトの企画書を作成' },
    { id: '2', content: 'タスク 2: デザインのモックアップを作成' },
    { id: '3', content: 'タスク 3: データベース設計を完了' },
    { id: '4', content: 'タスク 4: APIエンドポイントを実装' },
    { id: '5', content: 'タスク 5: フロントエンドのコンポーネントを作成' },
    { id: '6', content: 'タスク 6: テストケースを作成' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const resetItems = () => {
    setItems([
      { id: '1', content: 'タスク 1: プロジェクトの企画書を作成' },
      { id: '2', content: 'タスク 2: デザインのモックアップを作成' },
      { id: '3', content: 'タスク 3: データベース設計を完了' },
      { id: '4', content: 'タスク 4: APIエンドポイントを実装' },
      { id: '5', content: 'タスク 5: フロントエンドのコンポーネントを作成' },
      { id: '6', content: 'タスク 6: テストケースを作成' },
    ]);
  };

  const addNewItem = () => {
    const newId = (items.length + 1).toString();
    const newItem: Item = {
      id: newId,
      content: `新しいタスク ${newId}: 追加されたタスク`,
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          dnd kit デモページ
        </h1>
        <p className="text-gray-600">
          ドラッグ&ドロップでタスクの順序を変更できます
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ソート可能なタスクリスト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={addNewItem} variant="outline" size="sm">
              タスクを追加
            </Button>
            <Button onClick={resetItems} variant="outline" size="sm">
              リセット
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    content={item.content}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• タスクをドラッグして順序を変更できます</p>
            <p>• キーボードでも操作可能です（Tab + Space + 矢印キー）</p>
            <p>• 「タスクを追加」ボタンで新しいタスクを追加</p>
            <p>• 「リセット」ボタンで初期状態に戻します</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
