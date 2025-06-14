// app/api/phones/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, whatsapp_number } = await request.json();
    
    await pool.execute<ResultSetHeader>(
      'UPDATE phones SET name = ?, whatsapp_number = ? WHERE id = ?',
      [name, whatsapp_number, params.id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating phone:', error);
    return NextResponse.json({ error: 'Failed to update phone' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await pool.execute<ResultSetHeader>('DELETE FROM phones WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting phone:', error);
    return NextResponse.json({ error: 'Failed to delete phone' }, { status: 500 });
  }
}