import fs from 'node:fs';
import path from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '../../_lib/api/types';

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

// GET /api/users - 全ユーザー取得
export async function GET(_request: NextRequest) {
  try {
    const db = readDatabase();
    const users = db.users || [];

    return NextResponse.json(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
