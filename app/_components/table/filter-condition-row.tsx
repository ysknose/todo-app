'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

// フィルター条件の型定義
export type FilterCondition = {
  id: string;
  columnId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty';
  value: string;
  logicalOperator?: 'AND' | 'OR'; // 前のフィルターとの論理演算子
};

export type FilterGroup = {
  id: string;
  conditions: FilterCondition[];
  logicalOperator?: 'AND' | 'OR'; // 前のグループとの論理演算子
};

interface FilterConditionRowProps {
  filter: FilterCondition;
  index: number;
  onUpdate: (updatedFilter: FilterCondition) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  showLogicalOperator?: boolean;
  isGrouped?: boolean;
}

export function FilterConditionRow({
  filter,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  showLogicalOperator = true,
  isGrouped = false
}: FilterConditionRowProps) {
  return (
    <div className={`flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md group ${isGrouped ? 'hover:bg-blue-50' : ''}`}>
      {/* 論理演算子 */}
      {index > 0 && showLogicalOperator && (
        <Select
          value={filter.logicalOperator || 'AND'}
          onValueChange={(value: 'AND' | 'OR') => {
            onUpdate({ ...filter, logicalOperator: value });
          }}
        >
          <SelectTrigger className="h-8 w-16 text-sm border-gray-300 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
      )}
      {index === 0 && showLogicalOperator && (
        <div className="w-16 flex items-center justify-center">
          <span className="text-sm text-gray-500">条件</span>
        </div>
      )}

      {/* 列選択 */}
      <div className="flex items-center gap-1">
        <Select
          value={filter.columnId}
          onValueChange={(newColumnId) => {
            const isOptionColumn = newColumnId === 'role' || newColumnId === 'status';
            const currentIsOptionColumn = filter.columnId === 'role' || filter.columnId === 'status';

            let newOperator = filter.operator;
            if (!currentIsOptionColumn && isOptionColumn) {
              if (!['equals', 'not_equals', 'is_empty', 'is_not_empty'].includes(filter.operator)) {
                newOperator = 'equals';
              }
            }

            onUpdate({ ...filter, columnId: newColumnId, operator: newOperator, value: '' });
          }}
        >
          <SelectTrigger className="h-8 w-24 text-sm border-gray-300 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">名前</SelectItem>
            <SelectItem value="email">メールアドレス</SelectItem>
            <SelectItem value="role">役割</SelectItem>
            <SelectItem value="status">ステータス</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <span className="text-sm text-gray-500">が</span>

      {/* 値入力 */}
      {!['is_empty', 'is_not_empty'].includes(filter.operator) && (
        <div className="flex-1 min-w-0">
          {(filter.columnId === 'role' || filter.columnId === 'status') ? (
            <Select
              value={filter.value}
              onValueChange={(value) => {
                onUpdate({ ...filter, value });
              }}
            >
              <SelectTrigger className="h-8 text-sm border-gray-300 bg-white">
                <SelectValue placeholder="オプションを選択する" />
              </SelectTrigger>
              <SelectContent>
                {filter.columnId === 'role' ? (
                  <>
                    <SelectItem value="admin">管理者</SelectItem>
                    <SelectItem value="user">ユーザー</SelectItem>
                    <SelectItem value="viewer">閲覧者</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="active">有効</SelectItem>
                    <SelectItem value="inactive">無効</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          ) : (
            <Input
              placeholder="値を入力"
              value={filter.value}
              onChange={(event) => {
                onUpdate({ ...filter, value: event.target.value });
              }}
              className="h-8 text-sm border-gray-300 bg-white"
            />
          )}
        </div>
      )}

      {/* 演算子選択 */}
      <Select
        value={filter.operator}
        onValueChange={(operator: FilterCondition['operator']) => {
          onUpdate({ ...filter, operator });
        }}
      >
        <SelectTrigger className="h-8 w-28 text-sm border-gray-300 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(filter.columnId === 'role' || filter.columnId === 'status') ? (
            <>
              <SelectItem value="equals">と一致</SelectItem>
              <SelectItem value="not_equals">と一致しない</SelectItem>
              <SelectItem value="is_empty">未入力</SelectItem>
              <SelectItem value="is_not_empty">未入力ではない</SelectItem>
            </>
          ) : (
            <>
              <SelectItem value="equals">と一致</SelectItem>
              <SelectItem value="not_equals">と一致しない</SelectItem>
              <SelectItem value="contains">を含む</SelectItem>
              <SelectItem value="not_contains">を含まない</SelectItem>
              <SelectItem value="starts_with">で始まる</SelectItem>
              <SelectItem value="ends_with">で終わる</SelectItem>
              <SelectItem value="is_empty">未入力</SelectItem>
              <SelectItem value="is_not_empty">未入力ではない</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      {/* メニューボタン */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5"/>
              <circle cx="8" cy="8" r="1.5"/>
              <circle cx="8" cy="13" r="1.5"/>
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="w-full justify-start h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              className="w-full justify-start h-8 text-gray-700 hover:bg-gray-100"
            >
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
              </svg>
              複製
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
