import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Star, Trash2, X } from 'lucide-react';

export type Favorite = {
  id: string;
  content: string;
  region: string;
  sceneLabel: string;
  savedAt: string;
};

type Props = {
  favorites: Favorite[];
  onRemove: (id: string) => void;
  onClose: () => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function FavoritesPanel({ favorites, onRemove, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-20 bg-black/40 flex justify-center items-end sm:items-center"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 w-full max-w-2xl max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="お気に入りコーデ"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
          <h2 className="text-base font-bold text-stone-800 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            お気に入りコーデ（{favorites.length}件）
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-3 space-y-3">
          {favorites.length === 0 ? (
            <p className="text-sm text-stone-500 py-8 text-center">
              まだありません。気に入った提案の ☆ を押すとここに保存されます。
            </p>
          ) : (
            favorites.map((f) => (
              <div
                key={f.id}
                className="bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-stone-500">
                    {formatDate(f.savedAt)}・{f.region}・{f.sceneLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemove(f.id)}
                    className="text-xs text-stone-400 hover:text-rose-500 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    削除
                  </button>
                </div>
                <div className="prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-h3:text-base prose-ul:my-1 prose-li:my-0.5">
                  <ReactMarkdown>{f.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPanel;
