import { useEffect, useState } from 'react';
import { Droplets } from 'lucide-react';
import { fetchWeather, describeWeather, type Weather } from '@/api/weather';

type Status = 'idle' | 'loading' | 'done' | 'error';

function WeatherCard({ region }: { region: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const name = region.trim();
    if (!name) {
      setStatus('idle');
      setWeather(null);
      return;
    }

    // 入力中に毎回検索しないよう、打ち終わって0.8秒たってから取得する
    let cancelled = false;
    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        const result = await fetchWeather(name);
        if (cancelled) return;
        setWeather(result);
        setStatus('done');
      } catch {
        if (cancelled) return;
        setWeather(null);
        setStatus('error');
      }
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [region]);

  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <div className="mt-2 rounded-xl border border-sky-100 bg-sky-50 px-4 py-2.5 text-xs text-sky-700">
        今日の天気を取得中…
      </div>
    );
  }

  if (status === 'error' || !weather) {
    return (
      <div className="mt-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs text-stone-500">
        天気を取得できませんでした（「横浜市」のように市区町村名で入れてみてください）
      </div>
    );
  }

  const { label, icon } = describeWeather(weather.weatherCode);

  return (
    <div className="mt-2 rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-white px-4 py-2.5 flex items-center gap-3">
      <span className="text-3xl leading-none" aria-hidden>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-500 truncate">
          今日の天気・{weather.prefecture && `${weather.prefecture} `}
          {weather.placeName}
        </p>
        <p className="text-sm font-semibold text-stone-800">
          {label}
          <span className="ml-2">{Math.round(weather.currentTemp)}℃</span>
          <span className="ml-2 text-xs font-normal">
            <span className="text-rose-500">最高 {Math.round(weather.maxTemp)}℃</span>
            {' / '}
            <span className="text-sky-600">最低 {Math.round(weather.minTemp)}℃</span>
          </span>
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[10px] text-stone-400">降水確率</p>
        <p className="text-sm font-semibold text-sky-700 flex items-center gap-0.5 justify-end">
          <Droplets className="w-3.5 h-3.5" />
          {weather.rainChance}%
        </p>
      </div>
    </div>
  );
}

export default WeatherCard;
