import ReactMarkdown from 'react-markdown';
import { Star } from 'lucide-react';

export type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  // コーデの提案（あいさつ・エラー以外）のときだけ true
  favoritable?: boolean;
};

type Props = {
  message: Message;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

function ChatMessage({ message, isFavorite = false, onToggleFavorite }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-amber-500 text-white rounded-br-sm'
            : 'bg-white text-stone-800 border border-stone-200 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-stone-800 prose-headings:mt-2 prose-headings:mb-1 prose-h3:text-base prose-ul:my-1 prose-li:my-0.5 prose-strong:text-stone-900 prose-blockquote:border-amber-300 prose-blockquote:text-stone-600">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {message.favoritable && onToggleFavorite && (
          <div className="flex justify-end mt-1 -mb-1">
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                isFavorite
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-stone-400 hover:text-amber-500 hover:bg-amber-50'
              }`}
              aria-pressed={isFavorite}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              {isFavorite ? 'お気に入り済み' : 'お気に入り'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
