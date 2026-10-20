import { useRef, useState } from 'react';
import { Send } from 'lucide-react';

type Props = {
  onSend: (text: string) => void;
  disabled: boolean;
  warning?: string | null;
};

function ChatInput({ onSend, disabled, warning }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-stone-200 bg-white/80 backdrop-blur-md px-3 py-3">
      {warning && (
        <p className="text-xs text-rose-500 mb-1.5 px-1">{warning}</p>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="メッセージを入力（Enterで送信、Shift+Enterで改行）"
          className="flex-1 resize-none rounded-2xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition max-h-[120px]"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !text.trim()}
          className="shrink-0 rounded-2xl bg-amber-500 px-3.5 py-2.5 text-white disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-amber-600 transition-colors flex items-center gap-1.5"
          aria-label="送信"
        >
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">送信</span>
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
