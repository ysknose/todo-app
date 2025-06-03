'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTasks } from '../_hooks/useTasks';
import type { CreateTaskRequest, Task } from '../_lib/api/types';

export default function ApiDemoPage() {
  const {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    getTasksByStatus,
  } = useTasks();
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<
    'low' | 'medium' | 'high'
  >('medium');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = async () => {
    if (!newTaskContent.trim()) return;

    try {
      setIsCreating(true);
      const taskData: CreateTaskRequest = {
        content: newTaskContent.trim(),
        priority: newTaskPriority,
        status: 'todo',
      };
      await createTask(taskData);
      setNewTaskContent('');
      setNewTaskPriority('medium');
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task['status']
  ) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in-progress');
  const doneTasks = getTasksByStatus('done');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Next.js API Routes デモ
        </h1>
        <p className="text-gray-600">
          Next.js API Routesを使用したタスク管理APIのデモページです
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* タスク作成フォーム */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>新しいタスクを作成</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-content">タスク内容</Label>
              <Input
                id="task-content"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                placeholder="タスクの内容を入力してください"
                disabled={isCreating}
              />
            </div>
            <div>
              <Label htmlFor="task-priority">優先度</Label>
              <Select
                value={newTaskPriority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setNewTaskPriority(value)
                }
                disabled={isCreating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateTask}
                disabled={!newTaskContent.trim() || isCreating}
                className="flex items-center gap-2"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                タスクを作成
              </Button>
              <Button
                onClick={refreshTasks}
                variant="outline"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                更新
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タスク一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              TODO
              <Badge variant="secondary">{todoTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 flex-1">
                      {task.content}
                    </p>
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority === 'high'
                          ? '高'
                          : task.priority === 'medium'
                            ? '中'
                            : '低'}
                      </Badge>
                      <Badge
                        className={`text-xs ${getStatusColor(task.status)}`}
                      >
                        TODO
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() =>
                          handleStatusChange(task.id, 'in-progress')
                        }
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2"
                      >
                        進行中へ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 進行中 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              進行中
              <Badge variant="secondary">{inProgressTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 flex-1">
                      {task.content}
                    </p>
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority === 'high'
                          ? '高'
                          : task.priority === 'medium'
                            ? '中'
                            : '低'}
                      </Badge>
                      <Badge
                        className={`text-xs ${getStatusColor(task.status)}`}
                      >
                        進行中
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleStatusChange(task.id, 'todo')}
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2"
                      >
                        TODOへ
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(task.id, 'done')}
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2"
                      >
                        完了へ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 完了 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              完了
              <Badge variant="secondary">{doneTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 flex-1">
                      {task.content}
                    </p>
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority === 'high'
                          ? '高'
                          : task.priority === 'medium'
                            ? '中'
                            : '低'}
                      </Badge>
                      <Badge
                        className={`text-xs ${getStatusColor(task.status)}`}
                      >
                        完了
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() =>
                          handleStatusChange(task.id, 'in-progress')
                        }
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2"
                      >
                        進行中へ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API情報 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>API情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>ベースURL:</strong> http://localhost:3001
            </p>
            <p>
              • <strong>タスク一覧:</strong> GET /api/tasks
            </p>
            <p>
              • <strong>タスク作成:</strong> POST /api/tasks
            </p>
            <p>
              • <strong>タスク更新:</strong> PATCH /api/tasks/:id
            </p>
            <p>
              • <strong>タスク削除:</strong> DELETE /api/tasks/:id
            </p>
            <p>
              • <strong>ステータス別取得:</strong> GET /api/tasks?status=todo
            </p>
            <p>
              • <strong>優先度別取得:</strong> GET /api/tasks?priority=high
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
