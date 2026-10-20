import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import ConditionsForm, { type Conditions } from '@/components/ConditionsForm';
import ChatMessage, { type Message } from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import ChatInput from '@/components/ChatInput';
import SuggestedQuestions from '@/components/SuggestedQuestions';
import WeatherCard from '@/components/WeatherCard';
import FavoritesPanel, { type Favorite } from '@/components/FavoritesPanel';
import { sendMessage, toSceneLabel, type ChatInputs } from '@/api/chat';
import { loadJSON, saveJSON } from '@/lib/storage';

const GREETING =
  'おはようございます！今日のコーデを一緒に考えます👕\n\n地域と予定を入れて『今日のコーデを教えて』と送ってください。';

const INITIAL_CONDITIONS: Conditions = {
  region: '',
  scene: 'work',
  mood: '',
};

const CONDITIONS_KEY = 'outfit-chat-conditions';
const FAVORITES_KEY = 'outfit-chat-favorites';

function makeId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function App() {
  // 前回入れた条件があれば最初から入れておく
  const [conditions, setConditions] = useState<Conditions>(() => ({
    ...INITIAL_CONDITIONS,
    ...loadJSON<Partial<Conditions>>(CONDITIONS_KEY, {}),
  }));
  const [favorites, setFavorites] = useState<Favorite[]>(() =>
    loadJSON<Favorite[]>(FAVORITES_KEY, []),
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: makeId(), role: 'bot', content: GREETING },
  ]);
  const [conversationId, setConversationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [conditionResetNotice, setConditionResetNotice] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    saveJSON(CONDITIONS_KEY, conditions);
  }, [conditions]);

  useEffect(() => {
    saveJSON(FAVORITES_KEY, favorites);
  }, [favorites]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!conditions.region.trim()) {
        setWarning('地域を入力してください（条件入力エリアにあります）');
        return;
      }
      setWarning(null);

      const userMsg: Message = { id: makeId(), role: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      const inputs: ChatInputs = {
        region: conditions.region.trim(),
        scene: conditions.scene,
        mood: conditions.mood.trim(),
      };

      try {
        const res = await sendMessage({
          query: text,
          inputs,
          conversationId,
        });
        setConversationId(res.conversationId);
        setConditionResetNotice(false);
        setMessages((prev) => [
          ...prev,
          { id: makeId(), role: 'bot', content: res.answer, favoritable: true },
        ]);
      } catch (error) {
        const detail =
          error instanceof Error && error.message
            ? error.message
            : '不明なエラー';
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: 'bot',
            content: `⚠️ うまく返事をもらえませんでした。少し待ってからもう一度送ってください。（${detail}）`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [conditions, conversationId],
  );

  const handleConditionsChange = (next: Conditions) => {
    const changed =
      next.region !== conditions.region ||
      next.scene !== conditions.scene ||
      next.mood !== conditions.mood;
    const hasStartedChat =
      Boolean(conversationId) || messages.some((m) => m.role === 'user');
    if (changed && hasStartedChat) {
      setConversationId('');
      setConditionResetNotice(true);
    }
    setConditions(next);
  };

  const toggleFavorite = (message: Message) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === message.id)) {
        return prev.filter((f) => f.id !== message.id);
      }
      const added: Favorite = {
        id: message.id,
        content: message.content,
        region: conditions.region.trim(),
        sceneLabel: toSceneLabel(conditions.scene),
        savedAt: new Date().toISOString(),
      };
      return [added, ...prev];
    });
  };

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const closeFavorites = useCallback(() => setShowFavorites(false), []);

  const handleReset = () => {
    setMessages([{ id: makeId(), role: 'bot', content: GREETING }]);
    setConversationId('');
    setWarning(null);
    setConditionResetNotice(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-stone-50">
      <Header
        favoriteCount={favorites.length}
        onOpenFavorites={() => setShowFavorites(true)}
      />

      <div className="px-3 pt-3">
        <ConditionsForm values={conditions} onChange={handleConditionsChange} />
        <WeatherCard region={conditions.region} />
        {conditionResetNotice && (
          <p className="mt-2 text-xs text-stone-500">
            条件が変わったので新しい会話として相談します
          </p>
        )}
      </div>

      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          チャット
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-stone-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          新しい会話
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-3"
      >
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m}
            isFavorite={favorites.some((f) => f.id === m.id)}
            onToggleFavorite={() => toggleFavorite(m)}
          />
        ))}
        {loading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      <SuggestedQuestions onSelect={handleSend} disabled={loading} />
      <ChatInput onSend={handleSend} disabled={loading} warning={warning} />

      {showFavorites && (
        <FavoritesPanel
          favorites={favorites}
          onRemove={removeFavorite}
          onClose={closeFavorites}
        />
      )}
    </div>
  );
}

export default App;
