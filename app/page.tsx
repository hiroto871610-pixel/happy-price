'use client';
import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, TrendingDown, Bell, CreditCard } from 'lucide-react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (word: string = keyword) => {
    if (!word) return;
    setLoading(true);
    setResults(null); 
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(word)}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-20 font-sans">
      <header className="bg-white border-b sticky top-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-orange-500 italic flex items-center gap-2" onClick={() => window.location.reload()}>
            <ShoppingCart size={28} /> HappyPrice
          </h1>
          <div className="flex-1 max-w-2xl w-full flex gap-2 bg-slate-100 p-1 rounded-xl">
            <input 
              className="flex-1 bg-transparent p-2 outline-none px-4 font-bold" 
              placeholder="iPhone, Switch..." 
              value={keyword} onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={() => handleSearch()} className="bg-orange-500 text-white px-6 rounded-lg font-bold">検索</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {loading && <div className="py-20 text-center font-bold text-slate-400">検索中...</div>}

        <div className="space-y-6">
          {/* 楽天の結果を表示 */}
          {results?.rakuten?.map((item: any, i: number) => {
            const r = item.Item;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 flex gap-6 shadow-sm">
                <img src={r.mediumImageUrls[0].imageUrl} className="w-32 h-32 object-contain" alt="img" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">{r.itemName}</h3>
                  <div className="text-xl font-black text-red-600">¥{r.itemPrice.toLocaleString()}</div>
                  <div className="mt-4 flex gap-2">
                    <a href={r.itemUrl} target="_blank" className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold">楽天で見る</a>
                    <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(r.itemName)}`} target="_blank" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold">Amazonへ</a>
                  </div>
                </div>
              </div>
            );
          })}

          {results && results.rakuten?.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              ヒットしませんでした。キーワードを変えてみてください。
            </div>
          )}
        </div>
      </div>
    </main>
  );
}