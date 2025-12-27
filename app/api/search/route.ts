import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  
  // IDを文字列として定義
  const rId = "1060558184440519518";
  const yId = "dj00aiZpPXQ5S2w1alptTDVTUiZzPWNvbnN1bWVyc2VjcmV0Jng9Yjk-";

  if (!query) return NextResponse.json({ error: 'キーワードが必要です' });

  try {
    // 並び替え(sort)を指定しないことで、各ショップの「関連度順（おすすめ順）」で取得します
    const rUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${rId}&keyword=${encodeURIComponent(query)}&hits=20`;
    const yUrl = `https://shopping.yahoo.co.jp/ShoppingApi/V3/itemSearch?appid=${yId}&query=${encodeURIComponent(query)}&results=20`;

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