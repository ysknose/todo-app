import fs from 'node:fs';
import path from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database, Task } from '../../_lib/api/types';

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

// GET /api/tasks - 全タスク取得またはクエリパラメータでフィルタリング
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const db = readDatabase();
    let tasks = db.tasks || [];

    // フィルタリング
    if (status) {
      tasks = tasks.filter((task: Task) => task.status === status);
    }
    if (priority) {
      tasks = tasks.filter((task: Task) => task.priority === priority);
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - 新しいタスクを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDatabase();

    const newTask = {
      id: Date.now().toString(),
      content: body.content,
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.tasks = db.tasks || [];
    db.tasks.push(newTask);
    writeDatabase(db);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
