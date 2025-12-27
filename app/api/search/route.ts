import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const rakutenId = process.env.RAKUTEN_APP_ID;
  const yahooId = process.env.YAHOO_CLIENT_ID;

  if (!query) return NextResponse.json({ error: 'キーワードが必要です' });

  try {
    const encodedQuery = encodeURIComponent(query);

    const [rakutenRes, yahooRes] = await Promise.all([
      // 楽天: キーワードのみで検索。価格での絞り込みはフロントで行う
      fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${rakutenId}&keyword=${encodedQuery}&hits=20&sort=%2BitemPrice`)
        .then(res => res.json()).catch(() => ({})),
      
      // Yahoo!: キーワードのみで検索
      fetch(`https://shopping.yahoo.co.jp/ShoppingApi/V3/itemSearch?appid=${yahooId}&query=${encodedQuery}&results=20&sort=%2Bprice`)
        .then(res => res.json()).catch(() => ({}))
    ]);

    return NextResponse.json({
      rakuten: rakutenRes.Items || [],
      yahoo: yahooRes.hits || []
    });
  } catch (error) {
    return NextResponse.json({ rakuten: [], yahoo: [] });
  }
}