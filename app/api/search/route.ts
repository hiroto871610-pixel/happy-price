import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const rakutenId = process.env.RAKUTEN_APP_ID;
  const yahooId = process.env.YAHOO_CLIENT_ID;

  if (!query) return NextResponse.json({ error: 'キーワードを入力してください' });

  try {
    // 楽天とYahooのAPIを同時に叩く
    const [rakutenRes, yahooRes] = await Promise.all([
      fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${rakutenId}&keyword=${encodeURIComponent(query)}&hits=6&sort=%2BitemPrice`)
        .then(res => res.json()).catch(() => ({})),
      fetch(`https://shopping.yahoo.co.jp/ShoppingApi/V3/itemSearch?appid=${yahooId}&query=${encodeURIComponent(query)}&results=6`)
        .then(res => res.json()).catch(() => ({}))
    ]);

    // データを整理して返す
    return NextResponse.json({
      rakuten: rakutenRes.Items || [],
      yahoo: yahooRes.hits || []
    });
  } catch (error) {
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}