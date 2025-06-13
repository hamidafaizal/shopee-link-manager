// ========== API: UPLOAD CSV (app/api/upload-csv/route.ts) ==========
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();
    
    // Save filtered links to database
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const batchId = `batch_${Date.now()}`;
      
      for (const item of data) {
        await connection.execute(
          'INSERT INTO filtered_links (batch_id, product_link, commission) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE batch_id = VALUES(batch_id)',
          [batchId, item.productLink, item.commission || null]
        );
      }
      
      await connection.commit();
      
      return NextResponse.json({ success: true, batchId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json({ error: 'Failed to process CSV' }, { status: 500 });
  }
}