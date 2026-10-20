export type ChatInputs = {
  region: string;
  scene: string;
  mood?: string;
};

export type SendMessagePayload = {
  query: string;
  inputs: ChatInputs;
  conversationId?: string;
};

export type SendMessageResponse = {
  answer: string;
  conversationId: string;
};

const SCENE_LABELS: Record<string, string> = {
  work: '仕事',
  holiday: '休日のお出かけ',
  park: '子どもと公園',
  date: 'デート',
  home: '家でのんびり',
};

const USER_ID_STORAGE_KEY = 'outfit-chat-user-id';

function createRandomId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    }
  } catch {
    // fall through
  }
  return `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function getUserId(): string {
  const fallback = `web-${createRandomId()}`;
  try {
    const existing = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (existing) return existing;
    localStorage.setItem(USER_ID_STORAGE_KEY, fallback);
    return fallback;
  } catch {
    return fallback;
  }
}

export function toSceneLabel(scene: string): string {
  return SCENE_LABELS[scene] ?? scene;
}

function extractErrorDetail(text: string, status: number): string {
  try {
    const data = JSON.parse(text) as { message?: unknown; error?: unknown };
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error;
    }
  } catch {
    // not JSON
  }
  if (text.trim()) return text.trim();
  return `サーバーエラー（ステータス ${status}）`;
}

export async function sendMessage(
  payload: SendMessagePayload,
): Promise<SendMessageResponse> {
  const { query, inputs, conversationId } = payload;

  let response: Response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          region: inputs.region,
          scene: toSceneLabel(inputs.scene),
          mood: inputs.mood ?? '',
        },
        query,
        response_mode: 'blocking',
        conversation_id: conversationId ?? '',
        user: getUserId(),
      }),
    });
  } catch {
    throw new Error('通信に失敗しました。ネットワーク接続を確認してください。');
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(extractErrorDetail(text, response.status));
  }

  try {
    const data = JSON.parse(text) as {
      answer?: unknown;
      conversation_id?: unknown;
    };
    return {
      answer: typeof data.answer === 'string' ? data.answer : '',
      conversationId:
        typeof data.conversation_id === 'string' ? data.conversation_id : '',
    };
  } catch {
    throw new Error('サーバーからの応答を読み取れませんでした。');
  }
}
