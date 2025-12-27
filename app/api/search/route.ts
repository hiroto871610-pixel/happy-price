import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const amazonKey = process.env.RAINFOREST_API_KEY;

  if (!query) return NextResponse.json({ error: 'キーワードがありません' });
  if (!amazonKey) return NextResponse.json({ error: 'APIキーが設定されていません' });

  try {
    // 最もシンプルな検索URL（余計なパラメータを削除）
    const url = `https://api.rainforestapi.com/request?api_key=${amazonKey}&type=search&amazon_domain=amazon.co.jp&search_term=${encodeURIComponent(query)}`;
    
    const res = await fetch(url);
    const data = await res.json();

    // デバッグ用：何が返ってきたかVercelのログに表示
    console.log("Rainforest API Response Success:", data.request_info?.success);
    console.log("Results Count:", data.search_results?.length);

    // API側がエラーを返している場合
    if (data.request_info?.success === false) {
      return NextResponse.json({ error: data.request_info.message });
    }

    return NextResponse.json({
      amazonResults: data.search_results || [],
      rakutenResults: [],
      yahooResults: []
    });
  } catch (e: any) {
    return NextResponse.json({ error: '通信エラーが発生しました' });
  }
}