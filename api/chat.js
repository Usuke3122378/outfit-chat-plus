export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST').send('Method Not Allowed');
    return;
  }

  const apiKey = process.env.DIFY_API_KEY;
  if (!apiKey) {
    res.status(500).send('DIFY_API_KEY is not set');
    return;
  }

  const response = await fetch('https://api.dify.ai/v1/chat-messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {}),
  });

  const text = await response.text();
  const contentType = response.headers.get('content-type');
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }
  res.status(response.status).send(text);
}
