'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Heart, ShoppingCart, TrendingDown, Zap, ExternalLink, Award, CreditCard, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null); // 3社分を格納
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('happy-price-fav');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const handleSearch = async (searchWord: string = keyword) => {
    if (!searchWord) return;
    setLoading(true);
    setKeyword(searchWord);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchWord)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      alert("検索エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // グラフ用ダミーデータ
  const dummyChartData = [
    { name: '10日前', price: 10500 }, { name: '7日前', price: 9800 },
    { name: '5日前', price: 10200 }, { name: '3日前', price: 9900 }, { name: '今日', price: 9500 },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-orange-500 italic tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <ShoppingCart size={32} /> Happy-Price
          </h1>
          <div className="flex-1 max-w-2xl w-full flex gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 focus-within:ring-2 ring-orange-400">
            <input 
              type="text" className="flex-1 bg-transparent p-3 outline-none px-4 text-black"
              placeholder="商品を一括比較検索..." value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={() => handleSearch()} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold shadow-md">
              <Search size={20} />
            </button>
          </div>
          <button className="flex items-center gap-2 text-rose-500 font-bold bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
            <Heart size={20} fill={favorites.length > 0 ? "currentColor" : "none"} />
            <span>{favorites.length}</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        {/* 楽天カード訴求エリア */}
        <div className="mt-8 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-black mb-2">楽天カードでもっとおトクに！</h3>
            <p className="text-blue-100 text-sm opacity-90 max-w-md">新規入会ポイントで実質価格がさらにダウン。Happy-Priceユーザー必須の1枚です。</p>
          </div>
          <a href="#" className="relative z-10 bg-white text-blue-700 px-8 py-3 rounded-xl font-black text-lg shadow-lg">カード詳細 ➔</a>
        </div>

        {/* 検索結果 */}
        <div className="mt-12 space-y-12">
          {results && results.amazonResults?.slice(0, 3).map((item: any, index: number) => {
            // Amazon、楽天、Yahooの価格を比較して最小値を見つける
            const amazonPrice = item.price?.value || 0;
            const rakutenItem = results.rakutenResults?.[index]?.Item;
            const rakutenPrice = rakutenItem?.itemPrice || 0;
            const yahooItem = results.yahooResults?.[index];
            const yahooPrice = yahooItem?.price || 0;

            const prices = [
              { name: 'Amazon', value: amazonPrice },
              { name: '楽天', value: rakutenPrice },
              { name: 'Yahoo', value: yahooPrice }
            ].filter(p => p.value > 0);

            const minPrice = Math.min(...prices.map(p => p.value));

            return (
              <div key={index} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-10 relative overflow-hidden">
                {/* 画像 */}
                <div className="md:w-52 flex-shrink-0 flex items-center justify-center bg-white rounded-3xl p-2">
                  <img src={item.image} alt={item.title} className="max-h-52 object-contain" />
                </div>

                {/* 情報 */}
                <div className="flex-1">
                  <h2 className="text-xl font-extrabold mb-6 leading-tight line-clamp-2 text-slate-800">{item.title}</h2>
                  
                  {/* グラフエリア */}
                  <div className="bg-slate-50 p-5 rounded-3xl mb-8 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2"><TrendingDown size={14} /> 価格推移グラフ</p>
                    <div className="h-32 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dummyChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <Tooltip />
                          <Line type="monotone" dataKey="price" stroke="#f97316" strokeWidth={4} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 3社比較セクション */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Amazon表示 */}
                    <div className={`border-2 rounded-[1.5rem] p-4 flex flex-col justify-between ${amazonPrice === minPrice ? 'border-orange-500 bg-orange-50' : 'border-slate-100 bg-white'}`}>
                      <div>
                        {amazonPrice === minPrice && <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full mb-1 inline-block">最安値</span>}
                        <p className="text-xs font-bold text-slate-400">Amazon</p>
                        <p className="text-xl font-black text-slate-900">¥{amazonPrice.toLocaleString()}</p>
                      </div>
                      <a href={item.link} target="_blank" className="mt-3 block text-center bg-orange-500 text-white py-2 rounded-xl text-xs font-bold">Amazonへ</a>
                    </div>

                    {/* 楽天表示 */}
                    <div className={`border-2 rounded-[1.5rem] p-4 flex flex-col justify-between ${rakutenPrice === minPrice ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-white'}`}>
                      <div>
                        {rakutenPrice === minPrice && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full mb-1 inline-block">最安値</span>}
                        <p className="text-xs font-bold text-slate-400">楽天市場</p>
                        <p className="text-xl font-black text-slate-900">¥{rakutenPrice > 0 ? rakutenPrice.toLocaleString() : "---"}</p>
                      </div>
                      <a href={rakutenItem?.itemUrl || `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(item.title)}/`} target="_blank" className="mt-3 block text-center bg-red-600 text-white py-2 rounded-xl text-xs font-bold">楽天で見る</a>
                    </div>

                    {/* Yahoo表示 */}
                    <div className={`border-2 rounded-[1.5rem] p-4 flex flex-col justify-between ${yahooPrice === minPrice ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white'}`}>
                      <div>
                        {yahooPrice === minPrice && <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full mb-1 inline-block">最安値</span>}
                        <p className="text-xs font-bold text-slate-400">Yahoo!</p>
                        <p className="text-xl font-black text-slate-900">¥{yahooPrice > 0 ? yahooPrice.toLocaleString() : "---"}</p>
                      </div>
                      <a href={yahooItem?.url || `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(item.title)}`} target="_blank" className="mt-3 block text-center bg-blue-600 text-white py-2 rounded-xl text-xs font-bold">Yahooで見る</a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 読み込み中表示 */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400 font-bold">3大サイトから最安値を収集中...</p>
          </div>
        )}
      </div>
    </main>
  );
}