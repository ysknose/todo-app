import type { TableConfig } from '@/app/_components/table';
import React from 'react';
import type { User } from '../types';

export const userTableConfig: TableConfig<User> = {
  columns: [
    {
      id: 'name',
      header: '名前',
      accessorKey: 'name',
      enableSorting: true,
      enableFiltering: true,
      filterType: 'text',
      size: 200,
    },
    {
      id: 'email',
      header: 'メールアドレス',
      accessorKey: 'email',
      enableSorting: true,
      enableFiltering: true,
      filterType: 'text',
      size: 250,
    },
    {
      id: 'role',
      header: '役割',
      accessorKey: 'role',
      enableSorting: true,
      enableFiltering: true,
      filterType: 'select',
      filterOptions: [
        { value: 'admin', label: '管理者' },
        { value: 'user', label: 'ユーザー' },
        { value: 'viewer', label: '閲覧者' },
      ],
      cell: ({ row }) => {
        const role = row.original.role;
        return React.createElement('span', {
          className: 'px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs'
        }, role === 'admin' ? '管理者' : role === 'user' ? 'ユーザー' : '閲覧者');
      },
      size: 120,
    },
    {
      id: 'status',
      header: 'ステータス',
      accessorKey: 'status',
      enableSorting: true,
      enableFiltering: true,
      filterType: 'select',
      filterOptions: [
        { value: 'active', label: '有効' },
        { value: 'inactive', label: '無効' },
      ],
      cell: ({ row }) => {
        const status = row.original.status;
        return React.createElement('span', {
          className: `px-2 py-1 rounded text-xs ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`
        }, status === 'active' ? '有効' : '無効');
      },
      size: 100,
    },
  ],
  data: [], // これは実際の使用時に設定される
  enableSorting: true,
  enableFiltering: true,
  enableGrouping: true,
  enableMultiSort: true,
  maxMultiSortColCount: 4,
  groupByOptions: [
    { value: 'role', label: '役割' },
    { value: 'status', label: 'ステータス' },
  ],
};
