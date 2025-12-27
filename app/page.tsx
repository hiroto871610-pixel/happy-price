'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Heart, ShoppingCart, TrendingDown, Zap, ExternalLink, Award, CreditCard, ChevronRight } from 'lucide-react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  // お気に入りをブラウザに保存・読み込み
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
    setKeyword(searchWord);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchWord)}`);
      const data = await res.json();
      setResults(data.search_results?.slice(0, 3) || []);
    } catch (error) {
      alert("検索エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // グラフ用ダミーデータ（APIからの実データがない場合の補完）
  const dummyChartData = [
    { name: '10日前', price: 10500 }, { name: '7日前', price: 9800 },
    { name: '5日前', price: 10200 }, { name: '3日前', price: 9900 }, { name: '今日', price: 9500 },
  ];

  return (
    <main className="min-h-screen bg-[#f1f5f9] text-slate-900 pb-20">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-orange-500 italic tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <ShoppingCart size={32} /> Happy-Price
          </h1>
          
          <div className="flex-1 max-w-2xl w-full flex gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 focus-within:ring-2 ring-orange-400 transition-all">
            <input 
              type="text" className="flex-1 bg-transparent p-3 outline-none px-4 text-black"
              placeholder="Amazon, 楽天, Yahooから一括検索..." value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={() => handleSearch()} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 shadow-md">
              <Search size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-rose-500 font-bold bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
              <Heart size={20} fill={favorites.length > 0 ? "currentColor" : "none"} />
              <span>{favorites.length}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        {/* 楽天カード訴求エリア（収益化） */}
        <div className="mt-8 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-yellow-400 font-bold text-sm uppercase tracking-widest">
              <CreditCard size={18} /> <span>Smart Shopping Tips</span>
            </div>
            <h3 className="text-2xl font-black mb-2 leading-tight">楽天カードでもっとお得に！</h3>
            <p className="text-blue-100 text-sm max-w-md opacity-90">
              新規入会ポイントを使えば、表示価格からさらにお安く。楽天でのポイントも最大3倍にアップします。
            </p>
          </div>
          <a href="#" className="relative z-10 bg-white text-blue-700 px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform">
            入会特典を確認 ➔
          </a>
          <div className="absolute right-0 bottom-0 opacity-10 rotate-12 scale-150"><CreditCard size={160} /></div>
        </div>

        {/* クイック検索タグ */}
        <div className="flex gap-3 mt-8 overflow-x-auto pb-4 no-scrollbar">
          {["家電", "ファッション", "ゲーム", "日用品", "ガジェット"].map(cat => (
            <button key={cat} onClick={() => handleSearch(cat)} className="bg-white px-6 py-2 rounded-full text-sm font-bold shadow-sm border border-slate-200 hover:border-orange-500 transition whitespace-nowrap">
              #{cat}
            </button>
          ))}
        </div>

        {/* 検索結果 */}
        <div className="mt-8 space-y-10">
          {results.length > 0 ? (
            results.map((item, index) => (
              <div key={index} className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-10 relative group">
                {/* お気に入りボタン */}
                <button onClick={() => toggleFavorite(item)} className="absolute top-8 right-8 p-4 rounded-full bg-slate-50 hover:bg-rose-50 border transition z-10">
                  <Heart size={24} className={favorites.find(f => f.asin === item.asin) ? "text-rose-500 fill-current" : "text-slate-300"} />
                </button>

                {/* 画像 */}
                <div className="md:w-64 flex-shrink-0 flex items-center justify-center bg-white rounded-3xl p-4">
                  <img src={item.image} alt={item.title} className="max-h-60 object-contain transition-transform group-hover:scale-105" />
                </div>

                {/* 情報 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-tighter">
                      <Zap size={12} fill="currentColor" /> 最安値を追跡中
                    </span>
                    <span className="text-slate-400 text-xs font-bold">ASIN: {item.asin}</span>
                  </div>
                  <h2 className="text-xl font-black mb-8 leading-tight text-slate-800 line-clamp-2">{item.title}</h2>
                  
                  {/* グラフエリア */}
                  <div className="bg-slate-50 p-6 rounded-[2rem] mb-8 border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <p className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest"><TrendingDown size={18} /> 価格推移 (過去10日間)</p>
                      <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-emerald-200 flex items-center gap-1 animate-bounce">
                        <Zap size={10} fill="white" /> 買い時です！
                      </span>
                    </div>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dummyChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis fontSize={10} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                          <Tooltip contentStyle={{borderRadius:'16px', border:'none', boxShadow:'0 10px 20px -5px rgba(0,0,0,0.1)'}} />
                          <Line type="monotone" dataKey="price" stroke="#f97316" strokeWidth={5} dot={{r:6, fill:'#f97316', strokeWidth:0}} activeDot={{r:10}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 3社比較リンク */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Amazon */}
                    <div className="bg-white border-2 border-orange-100 rounded-[2rem] p-5 hover:border-orange-500 transition-all flex flex-col justify-between group/card shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-orange-500">Amazon</span>
                        <p className="text-2xl font-black text-slate-900 mt-1">¥{item.price?.value?.toLocaleString() || "---"}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">・送料無料あり<br/>・最短翌日配送</p>
                      </div>
                      <a href={item.link} target="_blank" className="mt-4 flex items-center justify-center gap-2 bg-orange-500 text-white py-4 rounded-2xl font-black text-xs hover:bg-orange-600 transition shadow-lg shadow-orange-100">
                        購入ページへ <ExternalLink size={14} />
                      </a>
                    </div>

                    {/* Rakuten */}
                    <div className="bg-white border-2 border-red-50 rounded-[2rem] p-5 hover:border-red-500 transition-all flex flex-col justify-between group/card shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-red-500">楽天市場</span>
                        <p className="text-xs text-slate-400 italic mt-1 font-bold">ポイント倍増中</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">・SPUでポイント還元<br/>・イベント時がお得</p>
                      </div>
                      <a href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(item.title)}/`} target="_blank" className="mt-4 flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-red-700 transition shadow-lg shadow-red-100">
                        最安値を比較 <ExternalLink size={14} />
                      </a>
                    </div>

                    {/* Yahoo */}
                    <div className="bg-white border-2 border-blue-50 rounded-[2rem] p-5 hover:border-blue-500 transition-all flex flex-col justify-between group/card shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-blue-500">Yahoo!</span>
                        <p className="text-xs text-slate-400 italic mt-1 font-bold">PayPayでお得</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">・毎日ポイント5倍<br/>・SBユーザー最強</p>
                      </div>
                      <a href={`https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(item.title)}`} target="_blank" className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                        最安値を比較 <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : !loading && (
            <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={40} />
              </div>
              <p className="text-slate-400 font-bold text-lg">欲しい商品を検索して、最高のお買い物を。</p>
              <p className="text-slate-300 text-sm mt-2">例：ノイズキャンセリングヘッドホン、プロテイン</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}