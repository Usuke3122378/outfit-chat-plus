import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Calendar, Sparkles } from 'lucide-react';

export type Conditions = {
  region: string;
  scene: string;
  mood: string;
};

type Props = {
  values: Conditions;
  onChange: (values: Conditions) => void;
};

const SCENE_OPTIONS = [
  { value: 'work', label: '仕事' },
  { value: 'holiday', label: '休日のお出かけ' },
  { value: 'park', label: '子どもと公園' },
  { value: 'date', label: 'デート' },
  { value: 'home', label: '家でのんびり' },
];

function ConditionsForm({ values, onChange }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          条件を入力
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-stone-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-400" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3">
          {/* 地域 */}
          <label className="block">
            <span className="text-xs font-medium text-stone-600 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              住んでいる地域 <span className="text-rose-500">*</span>
            </span>
            <input
              type="text"
              value={values.region}
              onChange={(e) => onChange({ ...values, region: e.target.value })}
              placeholder="例：横浜市"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition"
            />
          </label>

          {/* 今日の予定 */}
          <label className="block">
            <span className="text-xs font-medium text-stone-600 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              今日の予定 <span className="text-rose-500">*</span>
            </span>
            <select
              value={values.scene}
              onChange={(e) => onChange({ ...values, scene: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition"
            >
              {SCENE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          {/* 今日の気分 */}
          <label className="block">
            <span className="text-xs font-medium text-stone-600 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              今日の気分 <span className="text-stone-400 font-normal">（任意）</span>
            </span>
            <input
              type="text"
              value={values.mood}
              onChange={(e) => onChange({ ...values, mood: e.target.value })}
              placeholder="例：明るめの色にしたい"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition"
            />
          </label>

          <p className="text-[11px] text-stone-400">
            入力した条件はこの端末に保存され、次に開いたときも残ります
          </p>
        </div>
      )}
    </div>
  );
}

export default ConditionsForm;
