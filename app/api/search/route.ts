import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'iPhone';
  
  // IDを文字列として正しく定義
  const rId = "1060558184440519518";
  const yId = "dj00aiZpPXQ5S2w1alptTDVTUiZzPWNvbnN1bWVyc2VjcmV0Jng9Yjk-";

  try {
    const rUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${rId}&keyword=${encodeURIComponent(query)}&hits=10`;
    const yUrl = `https://shopping.yahoo.co.jp/ShoppingApi/V3/itemSearch?appid=${yId}&query=${encodeURIComponent(query)}&results=10`;

    const [rRes, yRes] = await Promise.all([
      fetch(rUrl).then(res => res.json()).catch(() => ({})),
      fetch(yUrl).then(res => res.json()).catch(() => ({}))
    ]);

    return NextResponse.json({
      rakuten: rRes.Items || [],
      yahoo: yRes.hits || []
    });
  } catch (error) {
    return NextResponse.json({ rakuten: [], yahoo: [] });
  }
}