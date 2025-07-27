'use client';

import { UserEditDialog } from '@/app/_objects/user/components';
import type { User } from '@/app/_objects/user/types';
import { userFormSchema } from '@/app/_objects/user/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Calendar, Kanban, Table2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  DataTableBenefitsSection,
  FormStatusSection,
  GanttView,
  KanbanView,
  TableView
} from './_components';
import {
  createHandlers,
  getInitialUsers,
  handleViewChange,
  type FormData,
  type ViewType
} from './_lib';

export default function TableDemo() {
  // 状態管理
  const [currentView, setCurrentView] = useState<ViewType>('table');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // フォーム設定
  const form = useForm<FormData>({
    resolver: valibotResolver(userFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      users: getInitialUsers(),
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'users',
  });

  // ハンドラー関数を生成
  const handlers = createHandlers(
    form,
    fields,
    update,
    remove,
    append,
    setEditingUser,
    setIsEditDialogOpen
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          TanStack Table + React Hook Form デモ（共通化版）
        </h1>
        <p className="text-gray-600">
          DataTableコンポーネントを使用した共通化されたテーブル実装
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ユーザー管理テーブル</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(handleViewChange(value))}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <Table2 className="h-4 w-4" />
                  テーブル
                </TabsTrigger>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <Kanban className="h-4 w-4" />
                  カンバン
                </TabsTrigger>
                <TabsTrigger value="gantt" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  ガント
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="table" className="space-y-6">
              <TableView
                form={form}
                fields={fields}
                onEditUser={handlers.handleEditUser}
                onDeleteUser={handlers.handleDeleteUser}
                onAddUser={handlers.addUser}
                onReset={handlers.resetData}
              />
            </TabsContent>

            <TabsContent value="kanban" className="space-y-6">
              <KanbanView
                form={form}
                fields={fields}
                onEditUser={handlers.handleEditUser}
                onDeleteUser={handlers.handleDeleteUser}
                onAddUser={handlers.addUser}
                onReset={handlers.resetData}
              />
            </TabsContent>

            <TabsContent value="gantt" className="space-y-6">
              <GanttView
                form={form}
                fields={fields}
                onEditUser={handlers.handleEditUser}
                onDeleteUser={handlers.handleDeleteUser}
                onAddUser={handlers.addUser}
                onReset={handlers.resetData}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* フォーム状態表示 */}
      <FormStatusSection form={form} fields={fields} />

      {/* 共通化のメリット */}
      <DataTableBenefitsSection />

      {/* 編集ダイアログ */}
      <UserEditDialog
        isOpen={isEditDialogOpen}
        onClose={handlers.handleCloseEditDialog}
        user={editingUser}
        onSave={handlers.handleSaveUser}
      />
    </div>
  );
}
