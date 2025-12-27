'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Heart, ShoppingCart, TrendingDown, ExternalLink, Zap } from 'lucide-react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('happy-price-fav');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (item: any) => {
    const isFav = favorites.find(f => f.asin === item.asin);
    const newFavs = isFav ? favorites.filter(f => f.asin !== item.asin) : [...favorites, item];
    setFavorites(newFavs);
    localStorage.setItem('happy-price-fav', JSON.stringify(newFavs));
  };

  const handleSearch = async (searchWord: string = keyword) => {
    if (!searchWord) return;
    setLoading(true);
    setResults(null); // 前回の結果をクリア
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchWord)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      alert("検索中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const dummyChartData = [
    { name: '10日前', price: 10500 }, { name: '7日前', price: 9800 },
    { name: '5日前', price: 10200 }, { name: '3日前', price: 9900 }, { name: '今日', price: 9500 },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* ヘッダー */}
      <header className="bg-white border-b sticky top-0 z-50 p-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-orange-500 flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <ShoppingCart /> Happy-Price
          </h1>
          <div className="flex-1 max-w-xl w-full flex gap-2">
            <input 
              type="text" className="flex-1 bg-slate-100 p-2 rounded-xl border-none outline-orange-500 px-4 text-black"
              placeholder="商品を一括比較..." value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={() => handleSearch()} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold">検索</button>
          </div>
          <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 font-bold">
            <Heart size={18} fill={favorites.length > 0 ? "currentColor" : "none"} />
            <span>{favorites.length}</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* 検索中表示 */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold">最安値を収集中...</p>
          </div>
        )}

        {/* 検索結果リスト */}
        <div className="space-y-8">
          {results && results.amazonResults?.length > 0 ? (
            results.amazonResults.slice(0, 3).map((item: any, index: number) => {
              
              // --- 価格計算のガード部分 ---
              const amazonPrice = item.price?.value || 0;
              const rakutenItem = results.rakutenResults?.[index]?.Item || null;
              const rakutenPrice = rakutenItem?.itemPrice || 0;
              const yahooItem = results.yahooResults?.[index] || null;
              const yahooPrice = yahooItem?.price || 0;

              const priceList = [];
              if (amazonPrice > 0) priceList.push({ name: 'Amazon', value: amazonPrice });
              if (rakutenPrice > 0) priceList.push({ name: '楽天', value: rakutenPrice });
              if (yahooPrice > 0) priceList.push({ name: 'Yahoo', value: yahooPrice });

              const minPrice = priceList.length > 0 ? Math.min(...priceList.map(p => p.value)) : 0;
              // --- ガード終了 ---

              return (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 relative">
                  <button onClick={() => toggleFavorite(item)} className="absolute top-4 right-4 p-2 rounded-full border bg-slate-50">
                    <Heart size={20} className={favorites.find(f => f.asin === item.asin) ? "text-rose-500 fill-current" : "text-slate-300"} />
                  </button>

                  <div className="md:w-48 flex-shrink-0 flex items-center justify-center">
                    <img src={item.image} alt="商品画像" className="max-h-40 object-contain" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold mb-4 line-clamp-2">{item.title}</h2>
                    
                    {/* ダミーグラフ */}
                    <div className="bg-slate-50 p-4 rounded-2xl mb-6 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dummyChartData}>
                          <Line type="monotone" dataKey="price" stroke="#f97316" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Amazon */}
                      <div className={`p-3 rounded-2xl border-2 ${amazonPrice > 0 && amazonPrice === minPrice ? 'border-orange-500 bg-orange-50' : 'border-slate-100'}`}>
                        <p className="text-[10px] font-bold text-slate-400">Amazon</p>
                        <p className="text-xl font-black">{amazonPrice > 0 ? `¥${amazonPrice.toLocaleString()}` : '---'}</p>
                        <a href={item.link} target="_blank" className="text-[10px] text-blue-500 underline mt-2 block">Amazonで見る</a>
                      </div>

                      {/* 楽天 */}
                      <div className={`p-3 rounded-2xl border-2 ${rakutenPrice > 0 && rakutenPrice === minPrice ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}>
                        <p className="text-[10px] font-bold text-slate-400">楽天市場</p>
                        <p className="text-xl font-black">{rakutenPrice > 0 ? `¥${rakutenPrice.toLocaleString()}` : '在庫なし'}</p>
                        <a href={rakutenItem?.itemUrl || '#'} target="_blank" className="text-[10px] text-blue-500 underline mt-2 block">楽天で見る</a>
                      </div>

                      {/* Yahoo */}
                      <div className={`p-3 rounded-2xl border-2 ${yahooPrice > 0 && yahooPrice === minPrice ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
                        <p className="text-[10px] font-bold text-slate-400">Yahoo!</p>
                        <p className="text-xl font-black">{yahooPrice > 0 ? `¥${yahooPrice.toLocaleString()}` : '在庫なし'}</p>
                        <a href={yahooItem?.url || '#'} target="_blank" className="text-[10px] text-blue-500 underline mt-2 block">Yahooで見る</a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : !loading && results && (
            <div className="text-center py-20 text-slate-400">検索結果が見つかりませんでした。別のキーワードを試してください。</div>
          )}
        </div>
      </div>
    </main>
  );
}