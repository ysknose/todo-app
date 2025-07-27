'use client';

import { getRandomProgress, getRoleLabel, getStatusLabel, type ViewProps } from '../_lib';

interface GanttRowProps {
  user: any;
  index: number;
}

function GanttRow({ user, index }: GanttRowProps) {
  const progress = user.status === 'active' ? getRandomProgress() : 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* ユーザー情報 */}
        <div className="col-span-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-800">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <p className="font-medium text-sm">{user.name || '(未入力)'}</p>
              <p className="text-xs text-gray-500">{user.email || '(未入力)'}</p>
            </div>
          </div>
        </div>

        {/* 役割 */}
        <div className="col-span-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            {getRoleLabel(user.role)}
          </span>
        </div>

        {/* ステータス */}
        <div className="col-span-2">
          <span className={`px-2 py-1 rounded text-xs ${
            user.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {getStatusLabel(user.status)}
          </span>
        </div>

        {/* プログレスバー（仮想的なタスク進捗） */}
        <div className="col-span-5">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 min-w-[3rem]">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* タイムライン（簡易版） */}
      <div className="mt-3 ml-12">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>開始: 2024-01-01</span>
          <span>•</span>
          <span>終了: 2024-12-31</span>
          <span>•</span>
          <span className={user.status === 'active' ? 'text-green-600' : 'text-red-600'}>
            {user.status === 'active' ? '進行中' : '停止中'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function GanttView({ form }: ViewProps) {
  const users = form.watch('users');

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">ユーザー管理ガントチャート</h3>
      <div className="space-y-4">
        {users.map((user: any, index: number) => (
          <GanttRow key={`gantt-${index}`} user={user} index={index} />
        ))}
      </div>

      {/* ガントチャートの説明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📊 ガントチャートビュー</h4>
        <p className="text-sm text-blue-800">
          ユーザーの役割とステータスを時系列で視覚化。プログレスバーは仮想的なタスク進捗を表示しています。
          実際のプロジェクトでは、開始日・終了日・依存関係などを設定できます。
        </p>
      </div>
    </div>
  );
}
