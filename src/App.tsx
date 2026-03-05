import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getHanziInfo, HanziInfo } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HanziInfo | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Take the first character if multiple are entered
    const kanji = input.trim().charAt(0);
    setInput(kanji);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const info = await getHanziInfo(kanji);
      setResult(info);
    } catch (err) {
      console.error(err);
      setError('情報の取得に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 p-4 md:p-8 font-jp selection:bg-red-200 selection:text-red-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 mt-8 md:mt-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-tr from-red-100 to-amber-100 shadow-md">
              <img 
                src="/mamoto.png" 
                alt="馬本先生" 
                className="w-full h-full object-cover rounded-full border-2 border-white"
                onError={(e) => {
                  // Fallback placeholder until the user uploads the image
                  (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Mamoto&style=circle";
                }}
              />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4"
          >
            日中漢字ナビ
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-medium"
          >
            日本語の漢字から、中国語の読み方と意味を学ぼう
          </motion.p>
        </header>

        {/* Search Form */}
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch} 
          className="relative max-w-2xl mx-auto mb-16"
        >
          <div className="relative flex items-center group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="漢字を1文字入力 (例: 学)"
              className="w-full text-3xl p-6 pl-8 pr-20 bg-white border-2 border-slate-200 rounded-[2rem] shadow-sm focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100/50 transition-all placeholder:text-slate-300 font-bold text-center md:text-left"
              maxLength={2}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 p-4 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={32} /> : <Search size={32} />}
            </button>
          </div>
        </motion.form>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center text-red-600 mb-8 p-4 bg-red-50 rounded-2xl font-medium border border-red-100 max-w-2xl mx-auto"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.japaneseKanji}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100"
            >
              {/* Character Comparison Header */}
              <div className="grid md:grid-cols-2 border-b border-slate-100">
                <div className="p-10 md:p-16 text-center bg-slate-50/50 flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute top-6 left-6 text-sm font-bold text-slate-400 tracking-widest uppercase">日本語</div>
                  <div className="text-[8rem] md:text-[10rem] font-jp font-black text-slate-800 leading-none drop-shadow-sm">
                    {result.japaneseKanji}
                  </div>
                </div>
                <div className="p-10 md:p-16 text-center bg-red-50/40 flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute top-6 left-6 text-sm font-bold text-red-400 tracking-widest uppercase">中国語 (簡体字)</div>
                  <div className="text-[8rem] md:text-[10rem] font-sc font-black text-red-600 leading-none drop-shadow-sm">
                    {result.chineseHanzi}
                  </div>
                  <div className="mt-6 text-3xl md:text-4xl font-medium text-red-500 tracking-wide bg-white/60 px-6 py-2 rounded-full shadow-sm">
                    {result.pinyin}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8 md:p-12 space-y-12">
                {/* Meaning & Nuance */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      意味
                    </h3>
                    <p className="text-2xl md:text-3xl text-slate-800 leading-relaxed font-medium">
                      {result.meaningInJapanese}
                    </p>
                  </div>
                  <div className="bg-amber-50/80 rounded-3xl p-6 md:p-8 border border-amber-100/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                    <h3 className="text-sm font-bold text-amber-600 tracking-widest mb-3 uppercase">解説・ニュアンス</h3>
                    <p className="text-lg md:text-xl text-amber-900 leading-relaxed font-medium">
                      {result.nuanceOrDifference}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 tracking-widest mb-6 uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    単語の例
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {result.examples.map((example, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        key={idx} 
                        className="p-6 md:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <div className="flex flex-col gap-1 mb-4">
                          <span className="text-4xl font-sc font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                            {example.chineseWord}
                          </span>
                          <span className="text-xl text-red-500 font-medium tracking-wide">
                            {example.pinyin}
                          </span>
                        </div>
                        <p className="text-lg text-slate-600 font-medium border-t border-slate-100 pt-4">
                          {example.japaneseTranslation}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
