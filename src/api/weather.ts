// Open-Meteo（無料・APIキー不要）で今日の天気を取得する

export type Weather = {
  placeName: string;
  prefecture: string;
  currentTemp: number;
  maxTemp: number;
  minTemp: number;
  rainChance: number;
  weatherCode: number;
};

type GeoResult = {
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  admin1?: string;
  population?: number;
};

const PREFECTURE_PREFIX = /^(北海道|東京都|京都府|大阪府|.{2,3}県)/;
const MUNICIPAL_SUFFIX = /[市区町村]$/;

// 「横浜」→「横浜市」、「東京都渋谷区」→「渋谷区」「渋谷」のように、検索する名前の候補を作る
function buildCandidates(region: string): string[] {
  const names = new Set<string>([region]);
  const withoutPref = region.replace(PREFECTURE_PREFIX, '');
  for (const base of [region, withoutPref]) {
    if (base.length < 2) continue;
    names.add(base);
    if (MUNICIPAL_SUFFIX.test(base)) {
      const stripped = base.slice(0, -1);
      if (stripped.length >= 2) names.add(stripped);
    } else {
      names.add(`${base}市`);
    }
  }
  return [...names];
}

async function searchPlace(name: string): Promise<GeoResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name,
  )}&count=10&language=ja&format=json`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = (await res.json()) as { results?: GeoResult[] };
  return data.results ?? [];
}

// 候補をまとめて検索し、日本の地名のうち人口が一番多いものを選ぶ
async function findPlace(region: string): Promise<GeoResult | null> {
  const lists = await Promise.all(buildCandidates(region).map(searchPlace));
  const all = lists.flat();
  const japan = all.filter((r) => r.country_code === 'JP');
  const pool = japan.length > 0 ? japan : all;
  if (pool.length === 0) return null;
  return pool.reduce((best, r) =>
    (r.population ?? 0) > (best.population ?? 0) ? r : best,
  );
}

export async function fetchWeather(region: string): Promise<Weather> {
  const place = await findPlace(region.trim());
  if (!place) {
    throw new Error('地域が見つかりませんでした');
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
    '&current=temperature_2m,weather_code' +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&timezone=Asia%2FTokyo&forecast_days=1';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('天気を取得できませんでした');
  }
  const data = (await res.json()) as {
    current: { temperature_2m: number; weather_code: number };
    daily: {
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_probability_max: (number | null)[];
    };
  };

  return {
    placeName: place.name,
    prefecture: place.admin1 ?? '',
    currentTemp: data.current.temperature_2m,
    maxTemp: data.daily.temperature_2m_max[0],
    minTemp: data.daily.temperature_2m_min[0],
    rainChance: data.daily.precipitation_probability_max[0] ?? 0,
    weatherCode: data.current.weather_code,
  };
}

// 天気コード（WMO）を日本語とアイコンに変換する
export function describeWeather(code: number): { label: string; icon: string } {
  if (code === 0) return { label: '晴れ', icon: '☀️' };
  if (code === 1) return { label: 'おおむね晴れ', icon: '🌤️' };
  if (code === 2) return { label: '晴れ時々くもり', icon: '⛅' };
  if (code === 3) return { label: 'くもり', icon: '☁️' };
  if (code === 45 || code === 48) return { label: '霧', icon: '🌫️' };
  if (code >= 51 && code <= 57) return { label: '霧雨', icon: '🌦️' };
  if (code >= 61 && code <= 67) return { label: '雨', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { label: '雪', icon: '❄️' };
  if (code >= 80 && code <= 82) return { label: 'にわか雨', icon: '🌦️' };
  if (code === 85 || code === 86) return { label: 'にわか雪', icon: '🌨️' };
  if (code >= 95) return { label: '雷雨', icon: '⛈️' };
  return { label: '—', icon: '🌡️' };
}
