import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const amazonKey = process.env.RAINFOREST_API_KEY;
  const rakutenId = process.env.RAKUTEN_APP_ID;
  const yahooId = process.env.YAHOO_CLIENT_ID;

  if (!query) return NextResponse.json({ error: 'No query' });

  try {
    const [amazonRes, rakutenRes, yahooRes] = await Promise.all([
      fetch(`https://api.rainforestapi.com/request?api_key=${amazonKey}&type=search&amazon_domain=amazon.co.jp&search_term=${encodeURIComponent(query)}&currency=jpy`).then(res => res.json()).catch(() => ({})),
      fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${rakutenId}&keyword=${encodeURIComponent(query)}&hits=3&sort=%2BitemPrice`).then(res => res.json()).catch(() => ({})),
      fetch(`https://shopping.yahoo.co.jp/ShoppingApi/V3/itemSearch?appid=${yahooId}&query=${encodeURIComponent(query)}&results=3`).then(res => res.json()).catch(() => ({}))
    ]);

    // ログを確認（VercelのLogsで見ることができます）
    console.log("Amazon Data Exists:", !!amazonRes.search_results);

    return NextResponse.json({
      amazonResults: amazonRes.search_results || [],
      rakutenResults: rakutenRes.Items || [],
      yahooResults: yahooRes.hits || []
    });
  } catch (error) {
    return NextResponse.json({ amazonResults: [], rakutenResults: [], yahooResults: [] });
  }
}