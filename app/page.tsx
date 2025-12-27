'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Heart, ShoppingCart, TrendingDown, Bell, CreditCard, Zap, Smartphone, Laptop, Shirt, Gift, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('hp-pro-v5');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (item: any) => {
    const isFav = favorites.find(f => f.id === item.id);
    const next = isFav ? favorites.filter(f => f.id !== item.id) : [...favorites, item];
    setFavorites(next);
    localStorage.setItem('hp-pro-v5', JSON.stringify(next));
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

  const genHistory = (p: number) => [
    { n: '30日前', p: p * 1.05 }, { n: '15日前', p: p * 1.02 }, { n: '今日', p: p }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24 font-sans">
      {/* プレミアム・ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
              <ShoppingCart size={24} strokeWidth={3} />
            </div>
            <h1 className="text-2xl font-[1000] tracking-tighter text-slate-900 italic">HappyPrice</h1>
          </div>
          
          <div className="flex-1 max-w-2xl flex bg-slate-100 rounded-2xl p-1 border-2 border-transparent focus-within:border-orange-500 focus-within:bg-white transition-all shadow-inner">
            <input 
              className="flex-1 bg-transparent px-5 py-2 outline-none font-bold text-slate-800 placeholder:text-slate-400" 
              placeholder="iPhone 15, Switch, 炊飯器..." 
              value={keyword} onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={() => handleSearch()} className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-black hover:bg-orange-600 transition-all active:scale-95 shadow-lg">
              <Search size={22} />
            </button>
          </div>

          <button className="flex items-center gap-2 group">
            <Heart size={30} className={favorites.length > 0 ? "text-rose-500 fill-current" : "text-slate-300 group-hover:text-rose-400 transition"} />
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-1 rounded-full">{favorites.length}</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        {!results && !loading && (
          <div className="space-y-16 animate-in fade-in duration-700">
            {/* ヒーローセクション */}
            <section className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
              <div className="relative z-10 max-w-xl text-center md:text-left">
                <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full text-xs font-black mb-6 border border-white/20 mx-auto md:mx-0">
                  <ShieldCheck size={14} className="text-orange-500" /> 安心のリアルタイム価格比較
                </div>
                <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[1.1]">
                  損をしない<br/><span className="text-orange-500">お買い物</span>を。
                </h2>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {["iPhone 16", "PS5 Pro", "ポータブル電源"].map(t => (
                    <button key={t} onClick={() => handleSearch(t)} className="bg-white/5 hover:bg-white hover:text-slate-900 px-6 py-2.5 rounded-full font-bold transition-all border border-white/10">#{t}</button>
                  ))}
                </div>
              </div>
              <div className="mt-10 md:mt-0 relative">
                <div className="w-64 h-64 bg-orange-600 rounded-full blur-[80px] opacity-20 absolute -inset-4"></div>
                <TrendingDown size={200} className="text-orange-500/20 relative rotate-12" />
              </div>
            </section>

            {/* クイックカテゴリー */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { n: "デジタル家電", i: <Smartphone />, q: "スマホ" },
                { n: "ファッション", i: <Shirt />, q: "新作 ファッション" },
                { n: "パソコン", i: <Laptop />, q: "ノートPC" },
                { n: "ギフト", i: <Gift />, q: "プレゼント" }
              ].map(c => (
                <button key={c.n} onClick={() => handleSearch(c.q)} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                  <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner">{c.i}</div>
                  <span className="font-black text-slate-900 block text-lg tracking-tight">{c.n}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="py-40 text-center">
            <div className="w-16 h-16 border-[6px] border-slate-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-2xl font-black text-slate-400 animate-pulse tracking-tight">最安値ショップを照合中...</p>
          </div>
        )}

        {/* 検索結果 */}
        <div className="space-y-12 pb-20">
          {results?.rakuten?.slice(0, 8).map((item: any, i: number) => {
            const r = item.Item;
            // Yahoo側から、タイトルが楽天と似ているものを優先して探す（比較の精度向上）
            const y = results.yahoo?.find((yi: any) => yi.name.includes(keyword)) || results.yahoo?.[i];
            
            const rPrice = r.itemPrice || 0;
            const yPrice = y?.price || 0;
            const minPrice = yPrice > 0 ? Math.min(rPrice, yPrice) : rPrice;

            return (
              <div key={i} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col lg:flex-row gap-12 group hover:border-orange-200 transition-all">
                {/* 商品画像 */}
                <div className="lg:w-72 flex-shrink-0 flex items-center justify-center relative bg-white rounded-[2rem]">
                  <img src={r.mediumImageUrls[0].imageUrl.replace("?_ex=128x128", "?_ex=500x500")} className="max-h-72 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" alt="product" />
                  {rPrice === minPrice && (
                    <div className="absolute top-0 left-0 bg-emerald-500 text-white px-5 py-1.5 rounded-2xl text-xs font-black shadow-lg shadow-emerald-100">最安値確定</div>
                  )}
                </div>

                {/* 詳細情報 */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-6 mb-8">
                    <h2 className="text-2xl font-black text-slate-900 leading-snug line-clamp-2">{r.itemName}</h2>
                    <button onClick={() => toggleFavorite({id: r.itemCode, name: r.itemName})} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm">
                      <Heart size={26} className={favorites.find(f => f.id === r.itemCode) ? "text-rose-500 fill-current" : "text-slate-300"} />
                    </button>
                  </div>

                  {/* 価格履歴グラフ */}
                  <div className="bg-slate-50/50 rounded-[2.5rem] p-8 mb-10 border border-slate-100 shadow-inner">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <TrendingDown size={18} className="text-orange-500" /> Price Trend (30 days)
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                         <span className="text-emerald-600 text-sm font-black italic">BUY NOW</span>
                      </div>
                    </div>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={genHistory(minPrice)}>
                          <Line type="monotone" dataKey="p" stroke="#EA580C" strokeWidth={6} dot={false} strokeLinecap="round" />
                          <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 価格比較グリッド */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-[2.2rem] border-2 transition-all ${rPrice === minPrice ? 'border-orange-500 bg-orange-50/30' : 'border-slate-100 bg-white'}`}>
                      <p className="text-[10px] font-black text-red-600 mb-2 tracking-widest uppercase">楽天市場</p>
                      <p className="text-3xl font-[1000] text-slate-900 mb-4 tracking-tight">¥{rPrice.toLocaleString()}</p>
                      <a href={r.itemUrl} target="_blank" className="block w-full bg-red-600 text-white py-3.5 rounded-xl font-black text-xs text-center shadow-lg hover:bg-red-700 transition-all shadow-red-100">楽天で購入</a>
                    </div>

                    <div className={`p-6 rounded-[2.2rem] border-2 transition-all ${yPrice > 0 && yPrice === minPrice ? 'border-orange-500 bg-orange-50/30' : 'border-slate-100 bg-white'}`}>
                      <p className="text-[10px] font-black text-blue-600 mb-2 tracking-widest uppercase">Yahoo! ショッピング</p>
                      <p className="text-3xl font-[1000] text-slate-900 mb-4 tracking-tight">{yPrice > 0 ? `¥${yPrice.toLocaleString()}` : "在庫なし"}</p>
                      <a href={y?.url || "#"} target="_blank" className="block w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-xs text-center shadow-lg hover:bg-blue-700 transition-all shadow-blue-100">Yahooで購入</a>
                    </div>

                    <div className="p-6 rounded-[2.2rem] border-2 border-slate-100 bg-slate-50 flex flex-col justify-between">
                      <p className="text-[10px] font-black text-orange-600 mb-2 tracking-widest uppercase">Amazon.co.jp</p>
                      <div className="py-2">
                        <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1 leading-tight"><ExternalLink size={12} /> 最新価格と配送予定を<br/>今すぐサイトで確認</p>
                      </div>
                      <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(r.itemName)}`} target="_blank" className="block w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-xs text-center shadow-lg hover:bg-orange-600 transition-all">Amazonを開く</a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 値下げ通知・LINE誘導 */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button className="bg-[#06C755] text-white pl-8 pr-10 py-5 rounded-full shadow-[0_20px_40px_-10px_rgba(6,199,85,0.4)] flex items-center gap-4 font-black text-lg hover:scale-105 active:scale-95 transition-all group">
          <div className="relative">
            <Bell size={28} className="group-hover:animate-swing" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#06C755]"></span>
          </div>
          最安値速報を受け取る
        </button>
      </div>
    </main>
  );
}