type Props = {
  onSelect: (question: string) => void;
  disabled: boolean;
};

const SUGGESTIONS = [
  '今日のコーデを教えて',
  'もう少しきれいめにして',
  '雨でも大丈夫なコーデにして',
];

function SuggestedQuestions({ onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-3 py-2">
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className="text-xs rounded-full border border-stone-300 bg-white px-3 py-1.5 text-stone-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

export default SuggestedQuestions;
