'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Search, Heart, ShoppingCart, TrendingDown, ExternalLink, Zap, CreditCard, Bell, ChevronRight } from 'lucide-react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  // お気に入り保存用
  useEffect(() => {
    const saved = localStorage.getItem('happy-price-fav');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const handleSearch = async (word: string = keyword) => {
    if (!word) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(word)}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      alert("検索に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const dummyData = [{ p: 100 }, { p: 90 }, { p: 95 }, { p: 80 }];

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-[#1a1a1a]">
      {/* ヘッダー・SEO考慮 */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-orange-500 flex items-center gap-1 italic tracking-tighter cursor-pointer" onClick={() => window.location.reload()}>
            <ShoppingCart size={28} strokeWidth={3} /> HappyPrice
          </h1>
          <div className="flex-1 max-w-2xl w-full flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <input 
              className="flex-1 bg-transparent px-4 outline-none text-black placeholder:text-slate-400" 
              placeholder="最安値を一括検索..." 
              value={keyword} onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={() => handleSearch()} className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-md">
              <Search size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-rose-500 font-black">
              <Heart size={20} fill={favorites.length > 0 ? "currentColor" : "none"} />
              <span>{favorites.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-10 pb-20">
        {!results && !loading && (
          <div className="space-y-12">
            {/* メインビジュアル */}
            <section className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-5xl font-black mb-6 leading-tight">賢く選んで、<br/>もっとおトクに。</h2>
                <p className="text-lg opacity-90 mb-8 max-w-md">楽天・Yahoo・Amazonの価格を瞬時に比較。あなたの「欲しい」が一番安い場所を見つけます。</p>
                <div className="flex flex-wrap gap-3">
                  {["iPhone 15", "Switch", "冬物家電", "スニーカー"].map(t => (
                    <button key={t} onClick={() => handleSearch(t)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold transition">#{t}</button>
                  ))}
                </div>
              </div>
              <Zap className="absolute right-[-40px] bottom-[-40px] text-white/10 rotate-12" size={300} />
            </section>

            {/* 楽天カード訴求 */}
            <section className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="bg-blue-100 p-4 rounded-3xl text-blue-600"><CreditCard size={32} /></div>
                <div>
                  <h3 className="text-xl font-bold">楽天カードでポイント最大16倍</h3>
                  <p className="text-slate-500 text-sm">表示価格よりさらにおトクに購入できるチャンス！</p>
                </div>
              </div>
              <a href="#" className="bg-[#bf0000] text-white px-8 py-3 rounded-xl font-black text-sm whitespace-nowrap hover:scale-105 transition">詳細を確認</a>
            </section>
          </div>
        )}

        {loading && (
          <div className="text-center py-24">
            <div className="animate-spin h-14 w-14 border-[6px] border-orange-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-slate-400 font-black text-xl animate-pulse">価格情報を解析中...</p>
          </div>
        )}

        {/* 検索結果リスト */}
        <div className="grid grid-cols-1 gap-8">
          {results?.rakuten?.map((item: any, i: number) => {
            const rItem = item.Item;
            const yItem = results.yahoo?.[i];
            const rPrice = rItem.itemPrice || 0;
            const yPrice = yItem?.price || 0;
            
            // 最安値判定
            const minPrice = (yPrice > 0) ? Math.min(rPrice, yPrice) : rPrice;

            return (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8">
                <div className="md:w-56 flex-shrink-0 bg-white rounded-3xl p-4 flex items-center justify-center">
                  <img src={rItem.mediumImageUrls[0].imageUrl.replace("?_ex=128x128", "?_ex=300x300")} className="max-h-52 object-contain" alt="商品" />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold leading-snug mb-4 line-clamp-2">{rItem.itemName}</h2>
                  
                  {/* ミニグラフ・推移 */}
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex items-center gap-6">
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-1">
                        <TrendingDown size={14} /> 価格推移（目安）
                      </div>
                      <div className="h-10 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dummyData}><Line type="monotone" dataKey="p" stroke="#f97316" strokeWidth={3} dot={false} /></LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-center">
                      <div className="text-[8px] font-bold opacity-80 uppercase">買い時</div>
                      <div className="text-sm font-black">最高</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    {/* 楽天 */}
                    <div className={`p-4 rounded-3xl border-2 transition ${rPrice === minPrice ? 'border-red-500 bg-red-50' : 'border-slate-50'}`}>
                      <div className="text-[10px] font-black text-red-500 mb-1">楽天市場</div>
                      <div className="text-2xl font-black">¥{rPrice.toLocaleString()}</div>
                      <a href={rItem.itemUrl} target="_blank" className="mt-3 block bg-red-600 text-white py-2 rounded-xl text-[10px] font-bold">楽天で見る</a>
                    </div>
                    {/* Yahoo */}
                    <div className={`p-4 rounded-3xl border-2 transition ${yPrice > 0 && yPrice === minPrice ? 'border-blue-500 bg-blue-50' : 'border-slate-50'}`}>
                      <div className="text-[10px] font-black text-blue-500 mb-1">Yahoo!ショッピング</div>
                      <div className="text-2xl font-black">{yPrice > 0 ? `¥${yPrice.toLocaleString()}` : "在庫なし"}</div>
                      <a href={yItem?.url || "#"} target="_blank" className="mt-3 block bg-blue-600 text-white py-2 rounded-xl text-[10px] font-bold">Yahooで見る</a>
                    </div>
                    {/* Amazon */}
                    <div className="p-4 rounded-3xl border-2 border-slate-50 bg-slate-50/50">
                      <div className="text-[10px] font-black text-orange-500 mb-1">Amazon.co.jp</div>
                      <div className="text-xs font-bold text-slate-400 py-2 italic">最新価格を確認</div>
                      <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(rItem.itemName)}`} target="_blank" className="mt-1 block bg-orange-500 text-white py-2 rounded-xl text-[10px] font-bold">Amazonで見る</a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 値下げ通知ボタン（固定） */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3">
        <button className="bg-[#06c755] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold hover:scale-105 transition">
          <Bell size={24} className="animate-bounce" /> LINEで最安値速報を受け取る
        </button>
      </div>
    </main>
  );
}