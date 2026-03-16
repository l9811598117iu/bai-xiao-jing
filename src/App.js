import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, ArrowLeft, CheckCircle2, XCircle, Award, RotateCcw, 
  Save, Trophy, BookOpen, ChevronRight, ListChecks, Mic, 
  MessageSquare, Book, Heart, User, Send, BrainCircuit, ArrowRight, Lock, BookMarked, Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'BAI_XIAO_JING_KIDS_V1';
const API_KEY = ""; 

// --- 數據庫與故事保持一致 ---
const OFFICIAL_QUIZ_DATA = {
  choice: [
    { q: "「天地重孝孝當先」下一句？", options: ["一個孝字全家安", "孝順能生孝順子", "自古忠臣多孝子", "孝是人道第一步"], answer: 0 },
    { q: "「諸事不順」因何而起？", options: ["運氣不佳", "不孝", "努力不夠", "風水不好"], answer: 1 },
    { q: "「福祿皆由」哪一個字得？", options: ["誠", "禮", "勤", "孝"], answer: 3 },
    { q: "「孝敬父母」在經文中被比喻為什麼？", options: ["如敬天", "如敬神", "如敬師", "如敬友"], answer: 0 },
    { q: "「女得淑名」應該先學什麼？", options: ["勤儉", "織布", "學孝", "修容"], answer: 2 },
    { q: "「處世惟有」什麼力量最大？", options: ["誠力", "智力", "財力", "孝力"], answer: 3 },
    { q: "「能孝不在貧和富」，最重要是？", options: ["給錢", "善體親心", "買名牌", "大房子"], answer: 1 },
    { q: "經文中提到哪種動物「跪乳」？", options: ["烏鴉", "羊羔", "牛犢", "馬駒"], answer: 1 },
    { q: "「百行萬善」以什麼為首？", options: ["誠", "仁", "孝", "信"], answer: 2 },
    { q: "「念得十遍千個孝」能達到？", options: ["發財", "消災免難", "長生", "升官"], answer: 1 }
  ],
  fill: [
    { text: "一個孝字全家安", fragments: ["全家安", "一個", "孝字"], correct: [1, 2, 0] },
    { text: "孝順能生孝順子", fragments: ["孝順子", "孝順", "能生"], correct: [1, 2, 0] },
    { text: "孝是人道第一步", fragments: ["第一步", "人道", "孝是"], correct: [2, 1, 0] },
    { text: "自古忠臣多孝子", fragments: ["多孝子", "忠臣", "自古"], correct: [2, 1, 0] },
    { text: "福祿皆由孝字得", fragments: ["孝字得", "皆由", "福祿"], correct: [2, 1, 0] },
    { text: "孝親即是敬天地", fragments: ["敬天地", "即是", "孝親"], correct: [2, 1, 0] },
    { text: "五穀豐登皆因孝", fragments: ["皆因孝", "豐登", "五穀"], correct: [2, 1, 0] },
    { text: "孝子逢凶化為吉", fragments: ["化為吉", "逢凶", "孝子"], correct: [2, 1, 0] },
    { text: "善體親心是真孝", fragments: ["是真孝", "親心", "善體"], correct: [2, 1, 0] },
    { text: "不孝的人不如禽", fragments: ["不如禽", "的人", "不孝"], correct: [2, 1, 0] }
  ],
  note: [
    { q: "解釋「天地重孝孝當先」的意思。", hint: "小提示：想一想，為什麼好寶寶要先學會孝順呢？" },
    { q: "「能孝不在貧和富」是什麼意思？", hint: "小提示：對爸媽好一定要花大錢買禮物嗎？" },
    { q: "你會怎麼對爸媽「說好話」？", hint: "小提示：分享一句你對爸爸媽媽說過最貼心的話。" },
    { q: "如何實踐「善體親心」？", hint: "小提示：在爸媽累的時候，你會怎麼做呢？" },
    { q: "「百行萬善孝為首」對你的意義？", hint: "小提示：所有的好事情裡面，哪一個最重要？" }
  ]
};

const STORIES = {
  choice: { id: 'choice', title: "黃香溫席", summary: "九歲小黃香，冬天幫爸爸暖被窩！", content: "漢朝的時候，有個叫黃香的小朋友。冬天好冷好冷，他怕爸爸睡覺會冷得發抖，每天都先鑽進冰冷的被窩，用自己的小身體把被子弄得暖呼呼的，才請爸爸去睡覺。這就是最貼心的愛喔！", options: [{ text: "我也要幫爸媽捶捶背", ending: "真棒！你是家裡的小暖男/小暖女！", type: "大孝" }, { text: "我會自己收好玩具不讓爸媽操心", ending: "懂事的孩子最可愛了！", type: "溫馨" }] },
  fill: { id: 'fill', title: "緹縈救父", summary: "勇敢的少女，救出了被冤枉的爸爸！", content: "緹縈的爸爸被抓走了，緹縈不害怕，她勇敢地寫信給皇帝，求皇帝放過爸爸，她願意自己去當僕人來換爸爸回家。皇帝被她的勇氣感動了，最後讓爸爸平安回家，還廢除了壞壞的法律呢！", options: [{ text: "保護家人需要很大的勇氣", ending: "你的心裡住著一個小英雄！", type: "正義" }, { text: "愛是可以感動別人的力量", ending: "溫暖的心最有魔力了！", type: "守護" }] },
  note: { id: 'note', title: "老萊子戲彩", summary: "七十歲老爺爺，穿上漂亮衣服逗爸媽笑！", content: "老萊子已經七十歲了，他的爸爸媽媽更高齡。為了讓爸媽開心，老萊子穿上像蝴蝶一樣漂亮的彩色衣服，在爸媽面前跳舞唱歌，甚至故意摔倒學小寶寶哭，就是要看爸爸媽媽開心地笑。愛，就是讓爸媽永遠年輕！", options: [{ text: "讓爸爸媽媽大笑是最好玩的事", ending: "家裡有你，每天都是歡樂派對！", type: "至孝" }, { text: "我也要學一個才藝表演給爸媽看", ending: "爸媽一定是你的頭號粉絲！", type: "喜樂" }] }
};

const App = () => {
  const [screen, setScreen] = useState('home'); 
  const [userProgress, setUserProgress] = useState({ completedLevels: [], unlockedStories: [], certificates: 0 });
  const [currentLevel, setCurrentLevel] = useState(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedFragments, setSelectedFragments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [passStatus, setPassStatus] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([{ role: 'system', text: '你好呀！小冒險家，我是 Q 版夫子，有什麼悄悄話想跟我說嗎？' }]);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUserProgress(JSON.parse(saved));
  }, []);

  const saveProgress = (levelId) => {
    const newData = {
      ...userProgress,
      completedLevels: [...new Set([...userProgress.completedLevels, levelId])],
      unlockedStories: [...new Set([...userProgress.unlockedStories, levelId])],
      certificates: userProgress.certificates + 1
    };
    setUserProgress(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setScreen('story_unlocked');
  };

  const Header = ({ title, onBack }) => (
    <div className="p-6 bg-[#634c3e] text-[#fdf6e3] flex items-center justify-between shadow-md sticky top-0 z-50 rounded-b-3xl border-b-4 border-[#4a3a2f]">
      <button onClick={onBack} className="p-2 bg-white/20 rounded-full active:scale-90 transition-transform"><ArrowLeft size={20}/></button>
      <h2 className="font-serif font-black text-xl tracking-widest">{title}</h2>
      <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 border-2 border-white shadow-sm font-bold">
        {userProgress.certificates}
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="h-full bg-[#fdf6e3] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-serif">
      {/* 水墨背景元素 */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gray-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl" />
      
      <div className="z-10 w-full max-w-sm">
        <div className="relative mb-8 transform -rotate-2">
            <div className="absolute inset-0 bg-amber-400 rounded-3xl translate-x-2 translate-y-2" />
            <div className="relative border-4 border-[#2d2926] p-8 bg-white rounded-3xl shadow-xl">
              <h1 className="text-6xl font-black text-[#2d2926] tracking-tight mb-2">百孝經</h1>
              <div className="h-1.5 w-20 bg-amber-500 mx-auto rounded-full" />
            </div>
        </div>
        
        <p className="text-amber-900 font-bold tracking-[0.3em] mb-12 animate-pulse bg-amber-100 px-4 py-1 rounded-full inline-block">✨ 小朋友的冒險筆記 ✨</p>
        
        <div className="space-y-6">
          <button 
            onClick={() => { setScreen('map'); setQuizIdx(0); }} 
            className="w-full bg-[#e67e22] text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-2xl font-black hover:bg-[#d35400] transition-all shadow-[0_8px_0_0_#a04000] active:shadow-none active:translate-y-2"
          >
            <Play fill="currentColor" size={24} /> 開始冒險
          </button>
          
          <button 
            onClick={() => setScreen('story_book')} 
            className="w-full bg-white border-4 border-[#2d2926] text-[#2d2926] py-4 rounded-2xl flex items-center justify-center gap-3 text-xl font-black hover:bg-gray-50 transition-all shadow-[0_6px_0_0_#2d2926] active:shadow-none active:translate-y-1"
          >
            <BookOpen size={24} /> 故事寶盒
          </button>
        </div>

        {userProgress.certificates > 0 && (
          <button onClick={() => setScreen('chat')} className="mt-10 flex items-center gap-2 mx-auto bg-amber-200 px-6 py-2 rounded-full text-amber-900 font-black hover:bg-amber-300 transition-colors">
            <Sparkles size={18} /> 找 Q 版夫子聊天
          </button>
        )}
      </div>
    </div>
  );

  const MapScreen = () => (
    <div className="h-full bg-[#fdf6e3] flex flex-col font-serif">
      <Header title="冒險地圖" onBack={() => setScreen('home')} />
      <div className="p-6 space-y-6 overflow-y-auto">
        {[
          { id: 'choice', title: '第 1 關：小小測驗', desc: '選出正確的答案 (10題)', icon: "🎨", color: "bg-blue-100" },
          { id: 'fill', title: '第 2 關：句子拼圖', desc: '把句子拼起來吧 (10題)', icon: "🧩", color: "bg-green-100" },
          { id: 'note', title: '第 3 關：心情筆記', desc: '寫下你的小秘密 (AI 夫子)', icon: "💡", color: "bg-purple-100" }
        ].map((level) => {
          const isDone = userProgress.completedLevels.includes(level.id);
          return (
            <div 
              key={level.id}
              onClick={() => { setCurrentLevel(level.id); setQuizIdx(0); setPassStatus(false); setAiFeedback(""); setScreen('quiz'); }}
              className={`group relative p-6 bg-white border-4 border-[#2d2926] rounded-3xl flex items-center justify-between cursor-pointer transition-all shadow-[0_6px_0_0_#2d2926] active:shadow-none active:translate-y-1`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-4xl w-16 h-16 flex items-center justify-center rounded-2xl ${level.color}`}>
                  {level.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#2d2926]">{level.title}</h3>
                  <p className="text-sm text-gray-500 font-bold">{level.desc}</p>
                </div>
              </div>
              {isDone ? <div className="bg-amber-400 p-2 rounded-full border-2 border-white shadow-sm"><Trophy className="text-amber-900" /></div> : <ArrowRight className="text-gray-300 group-hover:text-amber-500 transition-colors" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  const QuizScreen = () => {
    const handleCheckChoice = (i, answer) => {
        if (i === answer) {
            if (quizIdx < 9) setQuizIdx(quizIdx + 1);
            else saveProgress('choice');
        } else {
            alert("哎呀！再想一下喔，你可以的！💪");
        }
    };

    if (currentLevel === 'choice') {
      const q = OFFICIAL_QUIZ_DATA.choice[quizIdx];
      return (
        <div className="h-full bg-[#fdf6e3] flex flex-col font-serif">
          <Header title="小小測驗" onBack={() => setScreen('map')} />
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-6 bg-white border-4 border-[#2d2926] p-6 rounded-3xl shadow-lg relative">
              <div className="absolute -top-3 right-6 bg-amber-400 px-4 py-1 rounded-full text-xs font-black border-2 border-[#2d2926]">
                第 {quizIdx + 1} / 10 關
              </div>
              <h2 className="text-2xl font-black text-gray-800 leading-relaxed text-center">{q.q}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 flex-1">
              {q.options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleCheckChoice(i, q.answer)}
                  className="w-full p-5 text-center bg-white border-4 border-[#2d2926] text-xl font-bold rounded-2xl hover:bg-amber-50 transition-all shadow-[0_4px_0_0_#2d2926] active:translate-y-1 active:shadow-none"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentLevel === 'fill') {
        const item = OFFICIAL_QUIZ_DATA.fill[quizIdx];
        return (
          <div className="h-full bg-[#fdf6e3] flex flex-col font-serif">
            <Header title="句子拼圖" onBack={() => setScreen('map')} />
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4 text-center font-black text-amber-900 bg-amber-200 py-1 rounded-full">第 {quizIdx + 1} / 10 關</div>
              
              <div className="min-h-[140px] border-4 border-dashed border-amber-300 p-6 flex flex-wrap gap-3 items-center justify-center bg-white/50 rounded-3xl mb-8 relative">
                {selectedFragments.length === 0 && <span className="text-gray-400 font-bold">把下方的方塊點進來吧！</span>}
                {selectedFragments.map((fIdx, i) => (
                  <span key={i} className="bg-amber-500 text-white px-6 py-3 text-xl font-black rounded-xl shadow-md animate-in zoom-in">{item.fragments[fIdx]}</span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {item.fragments.map((f, i) => (
                  <button 
                    key={i} 
                    disabled={selectedFragments.includes(i)}
                    onClick={() => setSelectedFragments([...selectedFragments, i])}
                    className={`px-8 py-4 bg-white border-4 border-[#2d2926] text-xl font-black rounded-2xl shadow-[0_4px_0_0_#2d2926] transition-all ${selectedFragments.includes(i) ? 'opacity-20 translate-y-1 shadow-none' : 'hover:bg-gray-50 active:scale-95'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-4">
                <button onClick={() => setSelectedFragments([])} className="py-4 bg-gray-200 border-4 border-gray-400 rounded-2xl font-black text-gray-600 shadow-[0_4px_0_0_#999]">重來</button>
                <button onClick={() => {
                  if (JSON.stringify(selectedFragments) === JSON.stringify(item.correct)) {
                    setSelectedFragments([]);
                    if (quizIdx < 9) setQuizIdx(quizIdx + 1);
                    else saveProgress('fill');
                  } else { alert("哎呀，順序怪怪的，再試一次！🧩"); }
                }} className="py-4 bg-[#2d2926] text-white rounded-2xl font-black shadow-[0_4px_0_0_#000]">完成拼圖！</button>
              </div>
            </div>
          </div>
        );
    }

    if (currentLevel === 'note') {
      const q = OFFICIAL_QUIZ_DATA.note[quizIdx];
      const checkNote = async (val) => {
          if(!val.trim()) return;
          setIsTyping(true);
          try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `你是一位親切的國小老師。針對問題「${q.q}」，小朋友回答了：「${val}」。請給予20字內非常可愛、溫暖且鼓勵的評語。如果內容通順，請在末尾加上 [PASS]。` }] }]
              })
            });
            const data = await response.json();
            const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "夫子覺得你寫得很棒喔！";
            setAiFeedback(feedback.replace('[PASS]', ''));
            if(feedback.includes('[PASS]')) setPassStatus(true);
          } catch(e) { setAiFeedback("網路怪怪的，夫子沒收到你的心聲喔。"); }
          setIsTyping(false);
      };

      return (
        <div className="h-full bg-[#fdf6e3] flex flex-col font-serif">
          <Header title="心情筆記" onBack={() => setScreen('map')} />
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-4 bg-white border-4 border-[#2d2926] p-6 rounded-3xl shadow-lg">
                <div className="text-amber-800 font-black mb-2 flex items-center gap-2">💡 小提問：</div>
                <h2 className="text-xl font-black text-gray-800 leading-relaxed">{q.q}</h2>
            </div>
            
            <p className="text-sm bg-amber-100 text-amber-900 px-4 py-2 rounded-xl mb-6 font-bold">✨ {q.hint}</p>
            
            <textarea 
              id="note-input"
              disabled={passStatus}
              className={`w-full h-40 p-6 border-4 border-[#2d2926] rounded-3xl text-lg leading-relaxed outline-none shadow-inner ${passStatus ? 'bg-gray-100' : 'bg-white focus:ring-4 ring-amber-200'}`}
              placeholder="在這裡寫下你的想法..."
            ></textarea>
            
            {aiFeedback && (
              <div className="mt-6 p-6 bg-white border-4 border-amber-400 rounded-3xl animate-in zoom-in shadow-xl relative">
                <div className="absolute -top-4 left-6 bg-amber-400 text-white px-3 py-1 rounded-full text-xs font-black">Q 版夫子說：</div>
                <p className="text-amber-900 font-bold leading-relaxed">{aiFeedback} 🌟</p>
              </div>
            )}

            <div className="mt-8">
              {!passStatus ? (
                <button 
                  disabled={isTyping}
                  onClick={() => checkNote(document.getElementById('note-input').value)}
                  className="w-full py-5 bg-[#2d2926] text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-[0_6px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50"
                >
                  {isTyping ? "夫子正在讀你的信..." : "寄給夫子"}
                </button>
              ) : (
                <button 
                  onClick={() => {
                    if (quizIdx < 4) { // 測試環境先設為5題，正式可改回10題
                        setQuizIdx(quizIdx + 1);
                        setAiFeedback("");
                        setPassStatus(false);
                        document.getElementById('note-input').value = "";
                    } else {
                        saveProgress('note');
                    }
                  }}
                  className="w-full py-5 bg-amber-500 text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-[0_6px_0_0_#9d5a00] animate-bounce"
                >
                  {quizIdx < 4 ? "下一關" : "大功告成！"} <ArrowRight size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  const ChatScreen = () => {
    const [msg, setMsg] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [chatMsgs]);

    const handleSend = async () => {
      if (!msg.trim() || isTyping) return;
      const userMsg = msg;
      setMsg("");
      const newMsgs = [...chatMsgs, { role: 'user', text: userMsg }];
      setChatMsgs(newMsgs);
      setIsTyping(true);

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `你是一位超級親切的 Q 版孔夫子，用現代且可愛的語氣跟國小學生聊天。學生說：「${userMsg}」。` }] }],
            systemInstruction: { parts: [{ text: "語氣要充滿活力、可愛，偶爾用一些表情符號，像個溫暖的大哥哥。不要用艱澀的文言文。" }] }
          })
        });
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "夫子正在吃點心，等等找你喔！";
        setChatMsgs([...newMsgs, { role: 'confucius', text: aiText }]);
      } catch (e) {
        setChatMsgs([...newMsgs, { role: 'confucius', text: "哎呀，鴿子信使迷路了，晚點再聊好嗎？" }]);
      } finally {
        setIsTyping(false);
      }
    };

    return (
      <div className="h-full bg-[#fdf6e3] flex flex-col font-serif">
        <Header title="Q 版夫子廟" onBack={() => setScreen('home')} />
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMsgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl shadow-md border-2 ${m.role === 'user' ? 'bg-[#634c3e] text-white border-transparent' : 'bg-white text-gray-800 border-amber-200'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-xs text-amber-600 font-bold animate-pulse">夫子正在打字...</div>}
        </div>
        <div className="p-4 bg-white border-t-4 border-amber-100 flex gap-2">
          <input 
            value={msg} 
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-amber-50 border-4 border-amber-200 p-4 rounded-2xl outline-none focus:border-amber-500 font-bold" 
            placeholder="跟夫子說說話..." 
          />
          <button onClick={handleSend} className="bg-amber-500 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-transform">
            <Send size={24} />
          </button>
        </div>
      </div>
    );
  };

  const StoryBookScreen = () => (
    <div className="h-full bg-[#fdf6e3] flex flex-col font-serif">
      <Header title="故事寶盒" onBack={() => setScreen('home')} />
      <div className="p-6 overflow-y-auto space-y-8">
        <div className="bg-white border-4 border-amber-400 p-4 rounded-3xl text-center shadow-lg">
          <p className="text-amber-900 font-black italic">「🌈 今日小語：愛家人，從抱抱開始！」</p>
        </div>

        {Object.values(STORIES).map((story) => {
          const isUnlocked = userProgress.unlockedStories.includes(story.id);
          return (
            <div 
              key={story.id}
              onClick={() => { if(isUnlocked) { setSelectedStory(story); setScreen('story_play'); } }}
              className={`relative bg-white p-6 border-4 border-[#2d2926] rounded-3xl shadow-[0_8px_0_0_#2d2926] transition-all ${isUnlocked ? 'cursor-pointer active:translate-y-1 active:shadow-none' : 'opacity-50 grayscale cursor-not-allowed'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black text-[#2d2926]">{story.title}</h3>
                {isUnlocked ? <Sparkles className="text-amber-500" size={24} /> : <Lock className="text-gray-400" size={24} />}
              </div>
              <p className="font-bold text-gray-500 leading-relaxed mb-4">{isUnlocked ? story.summary : "闖關後才能看這個故事喔！"}</p>
              {isUnlocked && <div className="text-xs text-amber-800 font-black flex items-center gap-1 uppercase tracking-tighter bg-amber-100 w-fit px-3 py-1 rounded-full"><Book size={12}/> 打開寶盒</div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  const StoryPlayScreen = () => {
    const story = selectedStory || STORIES[currentLevel] || STORIES.choice;
    return (
      <div className="h-full bg-[#fdf6e3] flex flex-col font-serif overflow-hidden">
        <Header title={story.title} onBack={() => setScreen(selectedStory ? 'story_book' : 'map')} />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white border-4 border-[#2d2926] rounded-[2rem] p-8 shadow-2xl relative">
            {/* 萌版裝飾 */}
            <div className="absolute -top-6 -left-4 w-12 h-12 bg-amber-400 rounded-full border-4 border-[#2d2926] shadow-md flex items-center justify-center text-white font-black">1</div>
            
            <p className="text-2xl leading-relaxed text-gray-800 font-bold text-justify mb-10 first-letter:text-5xl first-letter:text-amber-600 first-letter:font-black">
              {story.content}
            </p>
            
            <div className="border-t-4 border-dashed border-amber-200 pt-8 mt-8">
              <h4 className="text-center font-black text-[#2d2926] mb-8 text-xl">💡 讀完故事，你會怎麼做？</h4>
              <div className="space-y-4">
                {story.options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      alert(`太棒了！「${opt.text}」，${opt.ending}`);
                      setScreen('home');
                      setSelectedStory(null);
                    }} 
                    className="w-full p-5 bg-white border-4 border-[#2d2926] text-left font-black rounded-2xl hover:bg-amber-50 transition-all flex items-center justify-between group shadow-[0_4px_0_0_#2d2926] active:shadow-none active:translate-y-1"
                  >
                    <span className="flex-1">{opt.text}</span>
                    <ChevronRight size={24} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StoryUnlockedScreen = () => {
    const story = STORIES[currentLevel] || STORIES.choice;
    return (
      <div className="h-full bg-amber-400 p-8 flex flex-col items-center justify-center text-center font-serif">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-8 border-white/50 flex flex-col items-center">
            <Trophy size={120} className="text-amber-500 mb-8 animate-bounce" fill="currentColor" />
            <h2 className="text-5xl font-black mb-4 text-[#2d2926]">過關啦！</h2>
            <p className="mb-12 text-gray-600 font-bold text-xl leading-relaxed">你的孝心充滿了能量，<br/>得到了一個神祕故事寶盒！</p>
            <button 
              onClick={() => setScreen('story_play')}
              className="bg-[#2d2926] text-white px-12 py-5 rounded-3xl flex items-center gap-3 text-2xl font-black shadow-xl hover:scale-105 transition-transform"
            >
              <BookOpen size={32} /> 翻開看看
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen max-w-md mx-auto bg-[#fdf6e3] shadow-2xl overflow-hidden border-[12px] border-[#2d2926] rounded-[3rem] relative">
      {screen === 'home' && <HomeScreen />}
      {screen === 'map' && <MapScreen />}
      {screen === 'quiz' && <QuizScreen />}
      {screen === 'story_unlocked' && <StoryUnlockedScreen />}
      {screen === 'chat' && <ChatScreen />}
      {screen === 'story_book' && <StoryBookScreen />}
      {screen === 'story_play' && <StoryPlayScreen />}
    </div>
  );
};

export default App;