function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone-500 mr-1">考え中</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
