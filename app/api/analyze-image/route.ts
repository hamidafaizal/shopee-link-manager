// ========== API: ANALYZE IMAGE (app/api/analyze-image/route.ts) ==========
import { NextRequest, NextResponse } from 'next/server';
import { analyzeCommission } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    // Remove data URL prefix
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await analyzeCommission(base64Image);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}