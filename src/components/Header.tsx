import { Star } from 'lucide-react';

type Props = {
  favoriteCount: number;
  onOpenFavorites: () => void;
};

function Header({ favoriteCount, onOpenFavorites }: Props) {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
            <span aria-hidden>👕</span>
            今日のコーデ相談
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            地域と予定を伝えて、今日の着回しを一緒に考えよう
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenFavorites}
          className="shrink-0 flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          お気に入り
          <span className="ml-0.5 rounded-full bg-white px-1.5 text-[10px]">{favoriteCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
