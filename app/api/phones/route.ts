// app/api/phones/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM phones ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching phones:', error);
    return NextResponse.json({ error: 'Failed to fetch phones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, whatsapp_number } = await request.json();
    
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO phones (name, whatsapp_number) VALUES (?, ?)',
      [name, whatsapp_number]
    );
    
    return NextResponse.json({ 
      id: result.insertId, 
      name, 
      whatsapp_number 
    });
  } catch (error) {
    console.error('Error creating phone:', error);
    return NextResponse.json({ error: 'Failed to create phone' }, { status: 500 });
  }
}