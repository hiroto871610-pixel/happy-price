'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Heart, ShoppingCart, TrendingDown, Bell, CreditCard, Zap, Smartphone, Laptop, Shirt, Gift, ExternalLink, Award } from 'lucide-react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  // お気に入り保存
  useEffect(() => {
    const saved = localStorage.getItem('hp-pro-fav');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (item: any) => {
    const isFav = favorites.find(f => f.id === item.id);
    const next = isFav ? favorites.filter(f => f.id !== item.id) : [...favorites, item];
    setFavorites(next);
    localStorage.setItem('hp-pro-fav', JSON.stringify(next));
  };

  const handleSearch = async (word: string = keyword) => {
    if (!word) return;
    setLoading(true);
    setKeyword(word);
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

  // 1ヶ月の価格推移（シミュレーション）
  const genHistory = (p: number) => [
    { n: '30日前', p: p * 1.08 }, { n: '15日前', p: p * 1.02 }, { n: '今日', p: p }
  ];

  return (
    <main className="min-h-screen bg-[#F1F5F9] text-[#0F172A] pb-20 font-sans">
      {/* プロ仕様ヘッダー */}
      <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-orange-600 flex items-center gap-2 italic cursor-pointer" onClick={() => window.location.reload()}>
            <ShoppingCart size={32} strokeWidth={3} /> HappyPrice
          </h1>
          <div className="flex-1 max-w-2xl flex bg-slate-100 rounded-2xl p-1 border-2 border-slate-200 focus-within:border-orange-500 transition">
            <input 
              className="flex-1 bg-transparent px-5 py-2 outline-none font-bold text-lg text-slate-900 placeholder:text-slate-400" 
              placeholder="最安値を一括検索..." 
              value={keyword} onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={() => handleSearch()} className="bg-orange-600 text-white px-8 py-2 rounded-xl font-black shadow-lg hover:bg-orange-700 transition">
              <Search size={24} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer group">
              <Heart size={32} className={favorites.length > 0 ? "text-rose-500 fill-current" : "text-slate-300"} />
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{favorites.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {!results && !loading && (
          <div className="space-y-12">
            {/* 季節のおすすめ：冬のセール（自動更新イメージ） */}
            <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-orange-600 px-4 py-1 rounded-full text-xs font-black mb-6 uppercase tracking-widest animate-pulse">
                  <Award size={14} /> Seasonal Update: Winter 2025
                </div>
                <h2 className="text-5xl font-black mb-6 leading-tight">今、買うべき<br/><span className="text-orange-500 underline decoration-white">最安値</span>はここにある。</h2>
                <div className="flex flex-wrap gap-3 mt-8">
                  {["iPhone 15", "Nintendo Switch", "加湿器", "ダウンジャケット"].map(t => (
                    <button key={t} onClick={() => handleSearch(t)} className="bg-white/10 hover:bg-white text-white hover:text-slate-900 px-6 py-3 rounded-2xl font-black transition border border-white/20">#{t}</button>
                  ))}
                </div>
              </div>
              <Zap className="absolute right-[-40px] bottom-[-40px] text-white/5 rotate-12" size={350} />
            </section>

            {/* カテゴリー検索 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { n: "家電・スマホ", i: <Smartphone />, q: "最新家電" },
                { n: "ファッション", i: <Shirt />, q: "服" },
                { n: "PC・周辺機器", i: <Laptop />, q: "パソコン" },
                { n: "ギフト", i: <Gift />, q: "プレゼント" }
              ].map(c => (
                <button key={c.n} onClick={() => handleSearch(c.q)} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-xl transition flex flex-col items-center gap-4 group">
                  <div className="text-orange-600 group-hover:scale-125 transition-transform">{c.i}</div>
                  <span className="font-black text-slate-800">{c.n}</span>
                </button>
              ))}
            </div>

            {/* メリット表示 */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border-l-8 border-red-600 shadow-lg">
                <h3 className="text-red-600 font-black text-2xl mb-4 flex items-center gap-2"><CreditCard /> 楽天経済圏の強み</h3>
                <p className="text-slate-700 font-bold">楽天カード併用でポイント還元率が最大16倍に。実質価格で選ぶなら楽天がおトク！</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border-l-8 border-blue-600 shadow-lg">
                <h3 className="text-blue-600 font-black text-2xl mb-4 flex items-center gap-2"><Zap /> Yahoo!の即戦力</h3>
                <p className="text-slate-700 font-bold">PayPayポイントがその場で貯まる。ソフトバンク・ワイモバイルユーザーはさらに優遇！</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="py-40 text-center">
            <div className="w-20 h-20 border-8 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-xl"></div>
            <p className="text-3xl font-black text-slate-400 animate-pulse tracking-tighter">価格データを解析中...</p>
          </div>
        )}

        {/* 検索結果 */}
        <div className="space-y-12">
          {results?.rakuten?.slice(0, 5).map((item: any, i: number) => {
            const r = item.Item;
            const y = results.yahoo?.[i];
            const rPrice = r.itemPrice || 0;
            const yPrice = y?.price || 0;
            const minPrice = yPrice > 0 ? Math.min(rPrice, yPrice) : rPrice;

            return (
              <div key={i} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-2 border-slate-100 flex flex-col lg:flex-row gap-12 relative">
                <div className="lg:w-72 flex-shrink-0 flex items-center justify-center bg-white rounded-[2rem] p-4 border-2 border-slate-50">
                  <img src={r.mediumImageUrls[0].imageUrl.replace("?_ex=128x128", "?_ex=400x400")} className="max-h-72 object-contain" alt="product" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4 mb-8">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight line-clamp-2">{r.itemName}</h2>
                    <button onClick={() => toggleFavorite({id: r.itemCode, name: r.itemName})} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:bg-rose-50 transition shadow-inner">
                      <Heart size={28} className={favorites.find(f => f.id === r.itemCode) ? "text-rose-600 fill-current" : "text-slate-300"} />
                    </button>
                  </div>

                  {/* グラフセクション */}
                  <div className="bg-slate-50 rounded-[2rem] p-8 mb-8 border-2 border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <span className="text-sm font-black text-slate-500 uppercase flex items-center gap-2"><TrendingDown size={18} /> 過去1ヶ月の推移</span>
                      <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-black animate-bounce">買い時判定：最高</span>
                    </div>
                    <div className="h-40 w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={genHistory(minPrice)}>
                          <Line type="monotone" dataKey="p" stroke="#EA580C" strokeWidth={6} dot={false} />
                          <Tooltip labelStyle={{color: 'black', fontWeight: 'bold'}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 3社比較カード */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className={`p-6 rounded-[2rem] border-4 transition-all ${rPrice === minPrice ? 'border-red-600 bg-red-50 shadow-xl' : 'border-slate-100'}`}>
                      <p className="text-xs font-black text-red-600 mb-2 uppercase tracking-widest font-sans">楽天市場</p>
                      <p className="text-3xl font-black text-slate-900 mb-4 font-sans">¥{rPrice.toLocaleString()}</p>
                      <a href={r.itemUrl} target="_blank" className="block w-full bg-red-600 text-white py-4 rounded-xl font-black text-sm shadow-lg hover:bg-red-700 transition">ショップへ</a>
                    </div>

                    <div className={`p-6 rounded-[2rem] border-4 transition-all ${yPrice > 0 && yPrice === minPrice ? 'border-blue-600 bg-blue-50 shadow-xl' : 'border-slate-100'}`}>
                      <p className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest font-sans">Yahoo!ショッピング</p>
                      <p className="text-3xl font-black text-slate-900 mb-4 font-sans">{yPrice > 0 ? `¥${yPrice.toLocaleString()}` : "在庫なし"}</p>
                      <a href={y?.url || "#"} target="_blank" className="block w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm shadow-lg hover:bg-blue-700 transition">ショップへ</a>
                    </div>

                    <div className="p-6 rounded-[2rem] border-4 border-slate-100 bg-slate-50 flex flex-col justify-between">
                      <p className="text-xs font-black text-orange-600 mb-2 uppercase tracking-widest font-sans">Amazon.co.jp</p>
                      <p className="text-sm font-black text-slate-400 py-4 italic">最新価格を今すぐ確認</p>
                      <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(r.itemName)}`} target="_blank" className="block w-full bg-orange-600 text-white py-4 rounded-xl font-black text-sm shadow-lg hover:bg-orange-700 transition font-sans">Amazonへ</a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 値下げ通知固定ボタン */}
      <div className="fixed bottom-10 right-10 z-[100] group">
        <div className="absolute bottom-full mb-4 right-0 w-64 bg-white p-4 rounded-2xl shadow-2xl border-2 border-orange-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <p className="text-xs font-black text-slate-900">🔔 お気に入りの値下げをLINEでお知らせ！</p>
        </div>
        <button className="bg-[#06C755] text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-3 font-black text-xl hover:scale-110 active:scale-95 transition-all">
          <Bell size={28} /> LINEで最安値速報
        </button>
      </div>
    </main>
  );
}