'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type React from 'react';
import { useState } from 'react';

interface Task {
  id: string;
  content: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface ContainerProps {
  id: string;
  title: string;
  tasks: Task[];
  children: React.ReactNode;
}

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'TODO';
      case 'in-progress':
        return '進行中';
      case 'done':
        return '完了';
      default:
        return status;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-gray-900 flex-1">
          {task.content}
        </p>
        <div className="flex space-x-1 ml-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
        </div>
      </div>
      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
        {getStatusLabel(task.status)}
      </Badge>
    </div>
  );
}

function Container({ id: _id, title, tasks, children }: ContainerProps) {
  return (
    <div className="flex-1 min-w-0">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            {title}
            <Badge variant="secondary" className="ml-2">
              {tasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 min-h-[400px]">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MultiContainerDemoPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', content: 'プロジェクトの要件定義を作成', status: 'todo' },
    { id: '2', content: 'UIデザインのモックアップを作成', status: 'todo' },
    { id: '3', content: 'データベース設計を完了', status: 'in-progress' },
    { id: '4', content: 'APIエンドポイントを実装', status: 'in-progress' },
    { id: '5', content: 'ユーザー認証機能を実装', status: 'done' },
    { id: '6', content: 'テストケースを作成', status: 'done' },
  ]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const doneTasks = tasks.filter((task) => task.status === 'done');

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find((task) => task.id === active.id);
    setActiveTask(task || null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    let newStatus: Task['status'] = activeTask.status;

    // コンテナにドロップした場合
    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      newStatus = overId as Task['status'];
    } else {
      // タスクにドロップした場合、そのタスクのステータスを取得
      const overTask = tasks.find((task) => task.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (activeTask.status !== newStatus) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === active.id ? { ...task, status: newStatus } : task
        )
      );
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);

    if (!activeTask) return;

    // 同じステータス内での並び替え
    if (overTask && activeTask.status === overTask.status) {
      const statusTasks = tasks.filter(
        (task) => task.status === activeTask.status
      );
      const oldIndex = statusTasks.findIndex((task) => task.id === active.id);
      const newIndex = statusTasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== newIndex) {
        const reorderedTasks = arrayMove(statusTasks, oldIndex, newIndex);
        const otherTasks = tasks.filter(
          (task) => task.status !== activeTask.status
        );
        setTasks([...otherTasks, ...reorderedTasks]);
      }
    }
  }

  const resetTasks = () => {
    setTasks([
      { id: '1', content: 'プロジェクトの要件定義を作成', status: 'todo' },
      { id: '2', content: 'UIデザインのモックアップを作成', status: 'todo' },
      { id: '3', content: 'データベース設計を完了', status: 'in-progress' },
      { id: '4', content: 'APIエンドポイントを実装', status: 'in-progress' },
      { id: '5', content: 'ユーザー認証機能を実装', status: 'done' },
      { id: '6', content: 'テストケースを作成', status: 'done' },
    ]);
  };

  const addNewTask = () => {
    const newId = (tasks.length + 1).toString();
    const newTask: Task = {
      id: newId,
      content: `新しいタスク ${newId}`,
      status: 'todo',
    };
    setTasks([...tasks, newTask]);
  };

  return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            カンバンボード デモ
          </h1>
          <p className="text-gray-600">
            タスクをドラッグ&ドロップしてステータスを変更できます
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button onClick={addNewTask} variant="outline" size="sm">
            タスクを追加
          </Button>
          <Button onClick={resetTasks} variant="outline" size="sm">
            リセット
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Container id="todo" title="TODO" tasks={todoTasks}>
              <SortableContext
                items={todoTasks}
                strategy={verticalListSortingStrategy}
              >
                {todoTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </SortableContext>
            </Container>

            <Container id="in-progress" title="進行中" tasks={inProgressTasks}>
              <SortableContext
                items={inProgressTasks}
                strategy={verticalListSortingStrategy}
              >
                {inProgressTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </SortableContext>
            </Container>

            <Container id="done" title="完了" tasks={doneTasks}>
              <SortableContext
                items={doneTasks}
                strategy={verticalListSortingStrategy}
              >
                {doneTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </SortableContext>
            </Container>
          </div>

          <DragOverlay>
            {activeTask ? <TaskItem task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>使い方</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                • タスクをドラッグして他のコンテナにドロップしてステータスを変更
              </p>
              <p>• 同じコンテナ内でドラッグして順序を変更</p>
              <p>
                • 「タスクを追加」ボタンで新しいタスクを追加（TODOに追加されます）
              </p>
              <p>• 「リセット」ボタンで初期状態に戻します</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
