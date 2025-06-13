// ========== API: DISTRIBUTE LINKS (app/api/distribute-links/route.ts) ==========
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { batchId, phoneId, linksCount } = await request.json();
    
    await pool.execute(
      'INSERT INTO distribution_logs (batch_number, phone_id, links_count) VALUES (?, ?, ?)',
      [batchId, phoneId, linksCount]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging distribution:', error);
    return NextResponse.json({ error: 'Failed to log distribution' }, { status: 500 });
  }
}