'use client';

import type { ViewProps } from '../_lib';

interface KanbanCardProps {
  user: any;
}

function KanbanCard({ user }: KanbanCardProps) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{user.name || '(未入力)'}</h4>
          <p className="text-xs text-gray-500 mt-1">{user.email || '(未入力)'}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${
          user.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {user.status === 'active' ? '有効' : '無効'}
        </span>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  users: any[];
  badgeColor: string;
}

function KanbanColumn({ title, users, badgeColor }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
            {users.length}
          </span>
        </div>
        <div className="space-y-3">
          {users.map((user, index) => (
            <KanbanCard key={`${title}-${index}`} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function KanbanView({ form }: ViewProps) {
  const users = form.watch('users');

  const adminUsers = users.filter((user: any) => user.role === 'admin');
  const regularUsers = users.filter((user: any) => user.role === 'user');
  const viewerUsers = users.filter((user: any) => user.role === 'viewer');

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      <KanbanColumn
        title="管理者"
        users={adminUsers}
        badgeColor="bg-blue-100 text-blue-800"
      />
      <KanbanColumn
        title="ユーザー"
        users={regularUsers}
        badgeColor="bg-green-100 text-green-800"
      />
      <KanbanColumn
        title="閲覧者"
        users={viewerUsers}
        badgeColor="bg-purple-100 text-purple-800"
      />
    </div>
  );
}
