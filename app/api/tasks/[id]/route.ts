import fs from 'node:fs';
import path from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database, Task } from '../../../_lib/api/types';

// データベースファイルのパス
const dbPath = path.join(process.cwd(), 'db.json');

// データベースを読み込む関数
function readDatabase(): Database {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data) as Database;
  } catch (error) {
    console.error('Failed to read database:', error);
    return { tasks: [], users: [] };
  }
}

// データベースに書き込む関数
function writeDatabase(data: Database) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to write database:', error);
  }
}

// GET /api/tasks/[id] - 特定のタスクを取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();
    const task = db.tasks?.find((t: Task) => t.id === id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('GET /api/tasks/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - タスクを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDatabase();

    const taskIndex = db.tasks?.findIndex((t: Task) => t.id === id);

    if (taskIndex === -1 || taskIndex === undefined) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // タスクを更新
    const updatedTask = {
      ...db.tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    db.tasks[taskIndex] = updatedTask;
    writeDatabase(db);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('PATCH /api/tasks/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - タスクを削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDatabase();
    const taskIndex = db.tasks?.findIndex((t: Task) => t.id === id);

    if (taskIndex === -1 || taskIndex === undefined) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // タスクを削除
    db.tasks.splice(taskIndex, 1);
    writeDatabase(db);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
