import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const apiKey = process.env.RAINFOREST_API_KEY;

  if (!query) return NextResponse.json({ error: 'キーワードが必要です' }, { status: 400 });

  // include_history=true で価格推移データを取得できるように設定
  const url = `https://api.rainforestapi.com/request?api_key=${apiKey}&type=search&amazon_domain=amazon.co.jp&search_term=${encodeURIComponent(query)}&currency=jpy&include_history=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '取得失敗' }, { status: 500 });
  }
}