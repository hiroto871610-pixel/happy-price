import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const amazonKey = process.env.RAINFOREST_API_KEY;
  const rakutenId = process.env.RAKUTEN_APP_ID;
  const yahooId = process.env.YAHOO_CLIENT_ID;

  if (!query) return NextResponse.json({ error: 'キーワードが必要です' });

  try {
    // 3社同時にデータを取得開始
    const [amazonRes, rakutenRes, yahooRes] = await Promise.all([
      // 1. Amazon (Rainforest API)
      fetch(`https://api.rainforestapi.com/request?api_key=${amazonKey}&type=search&amazon_domain=amazon.co.jp&search_term=${encodeURIComponent(query)}&currency=jpy`)
        .then(res => res.json())
        .catch(err => { console.error("Amazon API Error:", err); return {}; }),
      
      // 2. 楽天 (公式API)
      fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${rakutenId}&keyword=${encodeURIComponent(query)}&hits=3&sort=%2BitemPrice`)
        .then(res => res.json())
        .catch(err => { console.error("Rakuten API Error:", err); return {}; }),
      
      // 3. Yahoo!ショッピング (公式API V3) ※修正済みURL
      fetch(`https://shopping.yahoo.co.jp/ShoppingApi/V3/itemSearch?appid=${yahooId}&query=${encodeURIComponent(query)}&results=3&sort=%2Bprice`)
        .then(res => res.json())
        .catch(err => { console.error("Yahoo API Error:", err); return {}; })
    ]);

    // 取得したデータを整理してフロントエンドに返す
    return NextResponse.json({
      amazonResults: amazonRes.search_results || [],
      rakutenResults: rakutenRes.Items || [],
      yahooResults: yahooRes.hits || []
    });
  } catch (error) {
    console.error("General API Error:", error);
    return NextResponse.json({ error: 'データ取得プロセスでエラーが発生しました' }, { status: 500 });
  }
}