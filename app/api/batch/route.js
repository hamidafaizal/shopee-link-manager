// ========== API: BATCH INFO (app/api/batch/route.ts) ==========
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM batch_info ORDER BY created_at DESC LIMIT 1'
    );
    return NextResponse.json(rows[0] || null);
  } catch (error) {
    console.error('Error fetching batch info:', error);
    return NextResponse.json({ error: 'Failed to fetch batch info' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { threshold } = await request.json();
    
    const [result] = await pool.execute(
      'INSERT INTO batch_info (threshold) VALUES (?)',
      [threshold]
    );
    
    return NextResponse.json({ 
      id: (result as any).insertId,
      threshold
    });
  } catch (error) {
    console.error('Error creating batch info:', error);
    return NextResponse.json({ error: 'Failed to create batch info' }, { status: 500 });
  }
}