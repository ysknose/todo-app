'use client';

import { DataTable } from '@/app/_components/table';
import { userTableConfig } from '@/app/_objects/user/lib';
import { Button } from '@/components/ui/button';
import type { TableViewProps } from '../_lib';

export function TableView({
  form,
  fields,
  onEditUser,
  onDeleteUser,
  onAddUser,
  onReset,
}: TableViewProps) {
  // テーブル設定をデータと共に設定
  const tableConfig = {
    ...userTableConfig,
    data: fields,
    onEdit: onEditUser,
    onDelete: onDeleteUser,
    onAdd: onAddUser,
  };

  return (
    <div className="space-y-6">
      {/* 操作ボタン */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
        >
          リセット
        </Button>
      </div>

      {/* 共通化されたDataTable */}
      <DataTable config={tableConfig} />
    </div>
  );
}
